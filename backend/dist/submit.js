"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmitRouter = createSubmitRouter;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Data directory – share with frontend if exists, otherwise use local .data
const FRONTEND_DATA_DIR = path_1.default.resolve(__dirname, '../../frontend/.data');
const LOCAL_DATA_DIR = path_1.default.resolve(__dirname, '../.data');
const DATA_DIR = fs_1.default.existsSync(path_1.default.resolve(__dirname, '../../frontend')) ? FRONTEND_DATA_DIR : LOCAL_DATA_DIR;
// Ensure the directory exists
if (!fs_1.default.existsSync(DATA_DIR)) {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
}
const SUBMISSIONS_FILE = path_1.default.join(DATA_DIR, 'submissions.json');
function loadSubmissions() {
    if (!fs_1.default.existsSync(SUBMISSIONS_FILE))
        return [];
    try {
        const raw = fs_1.default.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return [];
    }
}
function saveSubmissions(arr) {
    fs_1.default.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
}
function createSubmitRouter() {
    const router = (0, express_1.Router)();
    router.post('/', (req, res) => {
        const payload = req.body;
        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ error: 'Invalid submission payload' });
        }
        const submissions = loadSubmissions();
        const entry = { id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, createdAt: Date.now(), ...payload };
        submissions.push(entry);
        saveSubmissions(submissions);
        res.status(201).json({ status: 'ok', entryId: entry.id });
    });
    router.get('/', (_req, res) => {
        const submissions = loadSubmissions();
        res.json(submissions);
    });
    return router;
}
