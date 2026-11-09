"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVenturesRouter = void 0;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(process.cwd(), '.data');
const VENTURES_FILE = path_1.default.join(DATA_DIR, 'ventures.json');
const founders = [];
const ventures = [];
function loadPersistentData() {
    try {
        if (fs_1.default.existsSync(VENTURES_FILE)) {
            const data = JSON.parse(fs_1.default.readFileSync(VENTURES_FILE, 'utf-8'));
            founders.splice(0, founders.length, ...data.founders);
            ventures.splice(0, ventures.length, ...data.ventures);
        }
    }
    catch (err) {
        console.error('Failed to load ventures data:', err);
    }
}
function savePersistentData() {
    try {
        if (!fs_1.default.existsSync(DATA_DIR))
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        fs_1.default.writeFileSync(VENTURES_FILE, JSON.stringify({ founders, ventures }, null, 2), 'utf-8');
    }
    catch (err) {
        console.error('Failed to save ventures data:', err);
    }
}
// Initial load
loadPersistentData();
const router = (0, express_1.Router)();
exports.createVenturesRouter = router;
// Helper to extract user info from auth headers (same pattern as academy)
function extractUser(req) {
    const userId = req.header('x-user-id');
    const role = req.header('x-user-role');
    return { userId, role };
}
// Public: list all ventures with optional pagination (query: page, limit)
router.get('/', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
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
router.get('/:ventureId', (req, res) => {
    const { ventureId } = req.params;
    const venture = ventures.find(v => v.id === ventureId);
    if (!venture)
        return res.status(404).json({ error: 'Venture not found' });
    const { confidentialInfo, ...publicData } = venture;
    res.json(publicData);
});
// Protected: create a new venture (founders only)
router.post('/', (req, res) => {
    const { userId, role } = extractUser(req);
    if (!userId || role !== 'founder')
        return res.status(403).json({ error: 'Forbidden' });
    const { name, description, logoUrl, confidentialInfo } = req.body;
    if (!name)
        return res.status(400).json({ error: 'Name is required' });
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const newVenture = {
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
router.patch('/:ventureId', (req, res) => {
    const { ventureId } = req.params;
    const { userId, role } = extractUser(req);
    if (!userId)
        return res.status(403).json({ error: 'Forbidden' });
    const venture = ventures.find(v => v.id === ventureId);
    if (!venture)
        return res.status(404).json({ error: 'Venture not found' });
    if (venture.founderId !== userId && role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    const { name, description, logoUrl, confidentialInfo } = req.body;
    if (name)
        venture.name = name;
    if (description)
        venture.description = description;
    if (logoUrl)
        venture.logoUrl = logoUrl;
    if (confidentialInfo)
        venture.confidentialInfo = confidentialInfo;
    savePersistentData();
    res.json({ message: 'Venture updated' });
});
// Protected: delete venture (owner founder or admin)
router.delete('/:ventureId', (req, res) => {
    const { ventureId } = req.params;
    const { userId, role } = extractUser(req);
    if (!userId)
        return res.status(403).json({ error: 'Forbidden' });
    const index = ventures.findIndex(v => v.id === ventureId);
    if (index === -1)
        return res.status(404).json({ error: 'Venture not found' });
    const venture = ventures[index];
    if (venture.founderId !== userId && role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    ventures.splice(index, 1);
    savePersistentData();
    res.json({ message: 'Venture deleted' });
});
// Public: list founders with optional pagination (query: page, limit)
router.get('/founders', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
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
router.get('/founders/:founderId', (req, res) => {
    const { founderId } = req.params;
    const founder = founders.find(f => f.id === founderId);
    if (!founder)
        return res.status(404).json({ error: 'Founder not found' });
    const ownedVentures = ventures.filter(v => v.founderId === founderId).map(v => ({
        id: v.id,
        name: v.name,
        description: v.description,
        logoUrl: v.logoUrl,
    }));
    res.json({ ...founder, ventures: ownedVentures });
});
