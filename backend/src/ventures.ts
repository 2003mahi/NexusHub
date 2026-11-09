import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// In‑memory store for ventures and founders – replace with a real DB in production.
interface Founder {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

interface Venture {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  founderId: string;
  confidentialInfo?: string; // never exposed publicly
}

const DATA_DIR = path.join(process.cwd(), '.data');
const VENTURES_FILE = path.join(DATA_DIR, 'ventures.json');

const founders: Founder[] = [];
const ventures: Venture[] = [];

function loadPersistentData() {
  try {
    if (fs.existsSync(VENTURES_FILE)) {
      const data = JSON.parse(fs.readFileSync(VENTURES_FILE, 'utf-8')) as {
        founders: Founder[];
        ventures: Venture[];
      };
      founders.splice(0, founders.length, ...data.founders);
      ventures.splice(0, ventures.length, ...data.ventures);
    }
  } catch (err) {
    console.error('Failed to load ventures data:', err);
  }
}

function savePersistentData() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      VENTURES_FILE,
      JSON.stringify({ founders, ventures }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Failed to save ventures data:', err);
  }
}

// Initial load
loadPersistentData();

const router = Router();

// Helper to extract user info from auth headers (same pattern as academy)
function extractUser(req: Request) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role') as any;
  return { userId, role };
}

// Public: list all ventures with optional pagination (query: page, limit)
router.get('/', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 20);
  const start = (page - 1) * limit;
  const paged = ventures.slice(start, start + limit).map(v => ({
    id: v.id,
    name: v.name,
    description: v.description,
    logoUrl: v.logoUrl,
    founderId: v.founderId,
  }));
  res.json({
    items: paged,
    pagination: {
      page,
      limit,
      total: ventures.length,
      totalPages: Math.ceil(ventures.length / limit),
    },
  });
});

// Public: get venture details (excluding confidentialInfo)
router.get('/:ventureId', (req: Request, res: Response) => {
  const { ventureId } = req.params;
  const venture = ventures.find(v => v.id === ventureId);
  if (!venture) return res.status(404).json({ error: 'Venture not found' });
  const { confidentialInfo, ...publicData } = venture;
  res.json(publicData);
});

// Protected: create a new venture (founders only)
router.post('/', (req: Request, res: Response) => {
  const { userId, role } = extractUser(req);
  if (!userId || role !== 'founder') return res.status(403).json({ error: 'Forbidden' });

  const { name, description, logoUrl, confidentialInfo } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const newVenture: Venture = {
    id,
    name,
    description,
    logoUrl,
    founderId: userId,
    confidentialInfo,
  };
  ventures.push(newVenture);
  savePersistentData();
  res.status(201).json({ id });
});

// Protected: update venture (owner founder or admin)
router.patch('/:ventureId', (req: Request, res: Response) => {
  const { ventureId } = req.params;
  const { userId, role } = extractUser(req);
  if (!userId) return res.status(403).json({ error: 'Forbidden' });
  const venture = ventures.find(v => v.id === ventureId);
  if (!venture) return res.status(404).json({ error: 'Venture not found' });
  if (venture.founderId !== userId && role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  const { name, description, logoUrl, confidentialInfo } = req.body;
  if (name) venture.name = name;
  if (description) venture.description = description;
  if (logoUrl) venture.logoUrl = logoUrl;
  if (confidentialInfo) venture.confidentialInfo = confidentialInfo;
  savePersistentData();
  res.json({ message: 'Venture updated' });
});

// Protected: delete venture (owner founder or admin)
router.delete('/:ventureId', (req: Request, res: Response) => {
  const { ventureId } = req.params;
  const { userId, role } = extractUser(req);
  if (!userId) return res.status(403).json({ error: 'Forbidden' });
  const index = ventures.findIndex(v => v.id === ventureId);
  if (index === -1) return res.status(404).json({ error: 'Venture not found' });
  const venture = ventures[index];
  if (venture.founderId !== userId && role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  ventures.splice(index, 1);
  savePersistentData();
  res.json({ message: 'Venture deleted' });
});

// Public: list founders with optional pagination (query: page, limit)
router.get('/founders', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 20);
  const start = (page - 1) * limit;
  const paged = founders.slice(start, start + limit).map(f => ({ id: f.id, name: f.name, avatarUrl: f.avatarUrl }));
  res.json({
    items: paged,
    pagination: {
      page,
      limit,
      total: founders.length,
      totalPages: Math.ceil(founders.length / limit),
    },
  });
});

// Public: get founder profile (includes ventures they own)
router.get('/founders/:founderId', (req: Request, res: Response) => {
  const { founderId } = req.params;
  const founder = founders.find(f => f.id === founderId);
  if (!founder) return res.status(404).json({ error: 'Founder not found' });
  const ownedVentures = ventures.filter(v => v.founderId === founderId).map(v => ({
    id: v.id,
    name: v.name,
    description: v.description,
    logoUrl: v.logoUrl,
  }));
  res.json({ ...founder, ventures: ownedVentures });
});

export { router as createVenturesRouter };
