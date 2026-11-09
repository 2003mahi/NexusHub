"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactRouter = createContactRouter;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Data storage – shared with frontend if present
const FRONTEND_DATA_DIR = path_1.default.resolve(__dirname, '../../frontend/.data');
const LOCAL_DATA_DIR = path_1.default.resolve(__dirname, '../.data');
const DATA_DIR = fs_1.default.existsSync(path_1.default.resolve(__dirname, '../../frontend'))
    ? FRONTEND_DATA_DIR
    : LOCAL_DATA_DIR;
const CONTACT_FILE = path_1.default.join(DATA_DIR, 'contact.json');
let store = { submissions: [] };
function loadStore() {
    try {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs_1.default.existsSync(CONTACT_FILE)) {
            const data = fs_1.default.readFileSync(CONTACT_FILE, 'utf-8');
            const parsed = JSON.parse(data);
            store = { submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [] };
        }
        else {
            store = { submissions: [] };
            saveStore();
        }
    }
    catch (err) {
        console.error('Error loading contact store:', err);
        store = { submissions: [] };
    }
}
function saveStore() {
    try {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs_1.default.writeFileSync(CONTACT_FILE, JSON.stringify(store, null, 2), 'utf-8');
    }
    catch (err) {
        console.error('Error saving contact store:', err);
    }
}
// Simple honeypot spam protection – client should send empty "hp" field
function isSpam(req) {
    const honeypot = req.body?.hp || '';
    return honeypot.trim().length > 0;
}
function createContactRouter() {
    const router = (0, express_1.Router)();
    router.post('/', (req, res) => {
        if (isSpam(req)) {
            // Pretend success to discourage spammers
            return res.status(200).json({ success: true, message: 'Submitted' });
        }
        const { name, email, phone, category, subject, message } = req.body;
        // Server‑side validation
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ success: false, error: 'Name is required (min 2 characters).' });
        }
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Valid email is required.' });
        }
        const allowed = ['general', 'partnership', 'startup', 'recruitment', 'institution'];
        if (!category || !allowed.includes(category)) {
            return res.status(400).json({ success: false, error: 'Invalid contact category.' });
        }
        if (!subject || typeof subject !== 'string' || subject.trim().length < 5) {
            return res.status(400).json({ success: false, error: 'Subject must be at least 5 characters.' });
        }
        if (!message || typeof message !== 'string' || message.trim().length < 20) {
            return res.status(400).json({ success: false, error: 'Message must be at least 20 characters.' });
        }
        const submission = {
            id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: name.trim(),
            email: email.trim(),
            phone: phone?.trim(),
            category,
            subject: subject.trim(),
            message: message.trim(),
            createdAt: Date.now()
        };
        loadStore();
        store.submissions.unshift(submission);
        saveStore();
        return res.status(200).json({ success: true, message: 'Your message has been received.' });
    });
    // Health endpoint for the router
    router.get('/health', (_, res) => {
        res.json({ status: 'ok', service: 'contact' });
    });
    return router;
}
