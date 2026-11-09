import { Router, Request, Response } from 'express';

// In‑memory placeholder stores – real implementation should query a database.
const categories = [] as Array<{ id: string; title: string; description?: string; imageUrl?: string }>;
const courses = [] as Array<{
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  instructorId?: string;
  contentUrl?: string;
}>;
const enrollments = [] as Array<{ userId: string; courseId: string }>; // No fake enrollment data.
const progress = [] as Array<{ userId: string; courseId: string; completed: boolean }>; // No fake progress.

const router = Router();

// Public: list categories
router.get('/categories', (req: Request, res: Response) => {
  res.json(categories);
});

// Public: list courses for a category
router.get('/categories/:catId/courses', (req: Request, res: Response) => {
  const { catId } = req.params;
  const filtered = courses.filter((c) => c.categoryId === catId);
  res.json(filtered);
});

// Public: get course detail
router.get('/courses/:courseId', (req: Request, res: Response) => {
  const { courseId } = req.params;
  const course = courses.find((c) => c.id === courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Middleware to extract user info from headers (used by other routes)
function extractUser(req: Request) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');
  return { userId, role };
}

// Protected: enroll in a course (students only)
router.post('/enroll', (req: Request, res: Response) => {
  const { userId, role } = extractUser(req);
  if (!userId || role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });
  // Prevent duplicate enrollment
  if (enrollments.some((e) => e.userId === userId && e.courseId === courseId)) {
    return res.status(200).json({ message: 'Already enrolled' });
  }
  enrollments.push({ userId, courseId });
  res.status(201).json({ message: 'Enrolled successfully' });
});

// Protected: update progress (students only)
router.patch('/progress', (req: Request, res: Response) => {
  const { userId, role } = extractUser(req);
  if (!userId || role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const { courseId, completed } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });
  const entry = progress.find((p) => p.userId === userId && p.courseId === courseId);
  if (entry) {
    entry.completed = Boolean(completed);
  } else {
    progress.push({ userId, courseId, completed: Boolean(completed) });
  }
  res.json({ message: 'Progress updated' });
});

export default router;
