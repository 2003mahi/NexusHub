import { Router, Request, Response } from 'express';

// In‑memory placeholder stores – real implementation should query a database.
// We intentionally start with empty arrays to avoid fabricating statistics.
import { initiatives, projects, stories } from './impactData';
const contributions: Array<{ userId: string; projectId: string; role: string }> = [];

export function createImpactRouter(): Router {
  const router = Router();

  // Overview endpoint – returns basic module info and counts (derived from actual data).
  router.get('/overview', (_req: Request, res: Response) => {
    res.json({
      status: 'operational',
      module: 'NexusHub Impact',
      counts: {
        initiatives: initiatives.length,
        projects: projects.length,
        stories: stories.length,
        contributions: contributions.length,
      },
    });
  });

  // List initiatives (read‑only)
  router.get('/initiatives', (_req: Request, res: Response) => {
    res.json(initiatives);
  });

  // List projects (read‑only)
  router.get('/projects', (_req: Request, res: Response) => {
    res.json(projects);
  });

  // List impact stories (read‑only)
  router.get('/stories', (_req: Request, res: Response) => {
    res.json(stories);
  });

  // Volunteer / participation opportunities – expose initiatives as opportunities.
  router.get('/volunteer', (_req: Request, res: Response) => {
    res.json(initiatives);
  });

  // Submit an enquiry for organization / NGO collaboration.
  router.post('/enquire', (req: Request, res: Response) => {
    const { name, email, organization, message } = req.body;
    if (!name || !email || !organization || !message) {
      return res.status(400).json({ error: 'All fields (name, email, organization, message) are required.' });
    }
    // In a real implementation we would store the enquiry securely.
    // Here we simply acknowledge receipt without persisting.
    return res.status(201).json({ status: 'received', message: 'Enquiry submitted successfully.' });
  });

  // Track a user's contribution – protected route, expects auth headers.
  router.post('/contribute', (req: Request, res: Response) => {
    const userId = req.header('x-user-id');
    const { projectId, role } = req.body;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!projectId || !role) {
      return res.status(400).json({ error: 'projectId and role are required.' });
    }
    contributions.push({ userId, projectId, role });
    return res.status(201).json({ status: 'recorded', message: 'Contribution recorded.' });
  });

  return router;
}

export default createImpactRouter;
