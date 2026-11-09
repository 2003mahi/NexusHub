"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// In‑memory placeholder stores – real implementation should query a database.
const categories = [];
const courses = [];
const enrollments = []; // No fake enrollment data.
const progress = []; // No fake progress.
const router = (0, express_1.Router)();
// Public: list categories
router.get('/categories', (req, res) => {
    res.json(categories);
});
// Public: list courses for a category
router.get('/categories/:catId/courses', (req, res) => {
    const { catId } = req.params;
    const filtered = courses.filter((c) => c.categoryId === catId);
    res.json(filtered);
});
// Public: get course detail
router.get('/courses/:courseId', (req, res) => {
    const { courseId } = req.params;
    const course = courses.find((c) => c.id === courseId);
    if (!course)
        return res.status(404).json({ error: 'Course not found' });
    res.json(course);
});
// Middleware to extract user info from headers (used by other routes)
function extractUser(req) {
    const userId = req.header('x-user-id');
    const role = req.header('x-user-role');
    return { userId, role };
}
// Protected: enroll in a course (students only)
router.post('/enroll', (req, res) => {
    const { userId, role } = extractUser(req);
    if (!userId || role !== 'student')
        return res.status(403).json({ error: 'Forbidden' });
    const { courseId } = req.body;
    if (!courseId)
        return res.status(400).json({ error: 'courseId required' });
    // Prevent duplicate enrollment
    if (enrollments.some((e) => e.userId === userId && e.courseId === courseId)) {
        return res.status(200).json({ message: 'Already enrolled' });
    }
    enrollments.push({ userId, courseId });
    res.status(201).json({ message: 'Enrolled successfully' });
});
// Protected: update progress (students only)
router.patch('/progress', (req, res) => {
    const { userId, role } = extractUser(req);
    if (!userId || role !== 'student')
        return res.status(403).json({ error: 'Forbidden' });
    const { courseId, completed } = req.body;
    if (!courseId)
        return res.status(400).json({ error: 'courseId required' });
    const entry = progress.find((p) => p.userId === userId && p.courseId === courseId);
    if (entry) {
        entry.completed = Boolean(completed);
    }
    else {
        progress.push({ userId, courseId, completed: Boolean(completed) });
    }
    res.json({ message: 'Progress updated' });
});
exports.default = router;
