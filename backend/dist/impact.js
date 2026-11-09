"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImpactRouter = createImpactRouter;
const express_1 = require("express");
// In‑memory placeholder stores – real implementation should query a database.
// We intentionally start with empty arrays to avoid fabricating statistics.
const impactData_1 = require("./impactData");
const contributions = [];
function createImpactRouter() {
    const router = (0, express_1.Router)();
    // Overview endpoint – returns basic module info and counts (derived from actual data).
    router.get('/overview', (_req, res) => {
        res.json({
            status: 'operational',
            module: 'NexusHub Impact',
            counts: {
                initiatives: impactData_1.initiatives.length,
                projects: impactData_1.projects.length,
                stories: impactData_1.stories.length,
                contributions: contributions.length,
            },
        });
    });
    // List initiatives (read‑only)
    router.get('/initiatives', (_req, res) => {
        res.json(impactData_1.initiatives);
    });
    // List projects (read‑only)
    router.get('/projects', (_req, res) => {
        res.json(impactData_1.projects);
    });
    // List impact stories (read‑only)
    router.get('/stories', (_req, res) => {
        res.json(impactData_1.stories);
    });
    // Volunteer / participation opportunities – expose initiatives as opportunities.
    router.get('/volunteer', (_req, res) => {
        res.json(impactData_1.initiatives);
    });
    // Submit an enquiry for organization / NGO collaboration.
    router.post('/enquire', (req, res) => {
        const { name, email, organization, message } = req.body;
        if (!name || !email || !organization || !message) {
            return res.status(400).json({ error: 'All fields (name, email, organization, message) are required.' });
        }
        // In a real implementation we would store the enquiry securely.
        // Here we simply acknowledge receipt without persisting.
        return res.status(201).json({ status: 'received', message: 'Enquiry submitted successfully.' });
    });
    // Track a user's contribution – protected route, expects auth headers.
    router.post('/contribute', (req, res) => {
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
exports.default = createImpactRouter;
