import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// ─── Types ──────────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'founder' | 'professional' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  verificationToken: string | null;
  verificationExpiry: number | null;
  resetToken: string | null;
  resetExpiry: number | null;
  createdAt: number;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
}

import fs from 'fs';
import path from 'path';

// ─── Persistent Store ────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

const users: Map<string, User> = new Map();
const emailIndex: Map<string, string> = new Map(); // email -> userId

function loadPersistentUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed: User[] = JSON.parse(data);
      for (const u of parsed) {
        users.set(u.id, u);
        emailIndex.set(u.email.toLowerCase().trim(), u.id);
      }
    }
  } catch (err) {
    console.error('Failed to load persistent users:', err);
  }
}

function savePersistentUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const userArray = Array.from(users.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(userArray, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save persistent users:', err);
  }
}

// Initial load
loadPersistentUsers();

// ─── Constants ──────────────────────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'nexushub-jwt-secret-change-in-production'
);
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const RESET_EXPIRY = 1 * 60 * 60 * 1000; // 1 hour

// ─── Password Utilities ─────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ─── JWT Session Management ─────────────────────────────────────────────────
export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('nexushub-session')?.value;
  if (!token) return null;
  return verifySession(token);
}

// ─── User CRUD ──────────────────────────────────────────────────────────────
export async function createUser(
  fullName: string,
  email: string,
  password: string,
  role: UserRole = 'student'
): Promise<{ user: User; verificationToken: string } | { error: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  if (emailIndex.has(normalizedEmail)) {
    // Generic error to prevent account enumeration
    return { error: 'Unable to create account. Please try again or use a different email.' };
  }

  const id = uuidv4();
  const passwordHash = await hashPassword(password);
  const verificationToken = uuidv4();

  const user: User = {
    id,
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    emailVerified: false,
    verificationToken,
    verificationExpiry: Date.now() + VERIFICATION_EXPIRY,
    resetToken: null,
    resetExpiry: null,
    createdAt: Date.now(),
  };

  users.set(id, user);
  emailIndex.set(normalizedEmail, id);
  savePersistentUsers();

  return { user, verificationToken };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User } | { error: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const userId = emailIndex.get(normalizedEmail);

  // Generic error to prevent account enumeration
  const genericError = 'Invalid email or password.';

  if (!userId) return { error: genericError };

  const user = users.get(userId);
  if (!user) return { error: genericError };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: genericError };

  return { user };
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}

export function getUserByEmail(email: string): User | undefined {
  const userId = emailIndex.get(email.toLowerCase().trim());
  if (!userId) return undefined;
  return users.get(userId);
}

export function updateUserBasic(id: string, updates: { fullName?: string }): User | null {
  const user = users.get(id);
  if (!user) return null;
  if (updates.fullName && updates.fullName.trim()) {
    user.fullName = updates.fullName.trim();
  }
  savePersistentUsers();
  return user;
}

export function updateUserPasswordById(id: string, newPasswordHash: string): boolean {
  const user = users.get(id);
  if (!user) return false;
  user.passwordHash = newPasswordHash;
  savePersistentUsers();
  return true;
}


// ─── Email Verification ─────────────────────────────────────────────────────
export function verifyEmail(token: string): { success: boolean; error?: string } {
  for (const user of users.values()) {
    if (user.verificationToken === token) {
      if (user.verificationExpiry && Date.now() > user.verificationExpiry) {
        return { success: false, error: 'Verification link has expired. Please request a new one.' };
      }
      user.emailVerified = true;
      user.verificationToken = null;
      user.verificationExpiry = null;
      savePersistentUsers();
      return { success: true };
    }
  }
  return { success: false, error: 'Invalid verification token.' };
}

export function regenerateVerificationToken(email: string): { token: string } | { error: string } {
  const user = getUserByEmail(email);
  if (!user) return { error: 'If an account exists, a new verification email will be sent.' };
  if (user.emailVerified) return { error: 'Email is already verified.' };

  const token = uuidv4();
  user.verificationToken = token;
  user.verificationExpiry = Date.now() + VERIFICATION_EXPIRY;
  savePersistentUsers();
  return { token };
}

// ─── Password Reset ─────────────────────────────────────────────────────────
export function createPasswordResetToken(email: string): { token: string } | { error?: string } {
  const user = getUserByEmail(email);
  // Always return success-like message to prevent enumeration
  if (!user) return {};

  const token = uuidv4();
  user.resetToken = token;
  user.resetExpiry = Date.now() + RESET_EXPIRY;
  savePersistentUsers();
  return { token };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  for (const user of users.values()) {
    if (user.resetToken === token) {
      if (user.resetExpiry && Date.now() > user.resetExpiry) {
        return { success: false, error: 'Reset link has expired. Please request a new one.' };
      }
      user.passwordHash = await hashPassword(newPassword);
      user.resetToken = null;
      user.resetExpiry = null;
      savePersistentUsers();
      return { success: true };
    }
  }
  return { success: false, error: 'Invalid or expired reset token.' };
}

// ─── Validation Helpers ─────────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must include an uppercase letter.' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must include a lowercase letter.' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must include a number.' };
  return { valid: true };
}

// ─── Role Authorization ─────────────────────────────────────────────────────
export function authorizeRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
