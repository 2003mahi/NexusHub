import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Data directory – share with frontend if exists, otherwise use local .data
const FRONTEND_DATA_DIR = path.resolve(__dirname, '../../frontend/.data');
const LOCAL_DATA_DIR = path.resolve(__dirname, '../.data');
const DATA_DIR = fs.existsSync(path.resolve(__dirname, '../../frontend')) ? FRONTEND_DATA_DIR : LOCAL_DATA_DIR;

// Ensure the directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

function loadSubmissions(): any[] {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSubmissions(arr: any[]) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
}

export function createSubmitRouter(): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid submission payload' });
    }
    const submissions = loadSubmissions();
    const entry = { id: `${Date.now()}-${Math.random().toString(36).substr(2,5)}`, createdAt: Date.now(), ...payload };
    submissions.push(entry);
    saveSubmissions(submissions);
    res.status(201).json({ status: 'ok', entryId: entry.id });
  });

  router.get('/', (_req: Request, res: Response) => {
    const submissions = loadSubmissions();
    res.json(submissions);
  });

  return router;
}

