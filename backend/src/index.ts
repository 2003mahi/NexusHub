import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// CORS configuration for local frontend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id, x-user-role, x-user-name, x-user-email');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

import { createCareersRouter } from './careers';
import { createCommunityRouter } from './community';
import academyRouter from './academy';
import { createVenturesRouter } from './ventures';

app.use('/api/careers', createCareersRouter());
app.use('/api/community', createCommunityRouter());
app.use('/api/academy', academyRouter);
import { createImpactRouter } from './impact';
import { createContactRouter } from './contact';

app.use('/api/impact', createImpactRouter());
app.use('/api/contact', createContactRouter());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'nexushub-backend' });
});

// Authentication service status & API proxy info
app.get('/api/auth/status', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'operational',
    version: '1.0.0',
    authProvider: 'NexusHub Security Suite',
    features: ['signup', 'login', 'email-verification', 'password-reset', 'rbac', 'session-management', 'careers-marketplace']
  });
});

app.listen(PORT, () => {
  console.log(`NexusHub backend running on http://localhost:${PORT}`);
});

export default app;
