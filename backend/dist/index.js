"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
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
const careers_1 = require("./careers");
const community_1 = require("./community");
const academy_1 = __importDefault(require("./academy"));
app.use('/api/careers', (0, careers_1.createCareersRouter)());
app.use('/api/community', (0, community_1.createCommunityRouter)());
app.use('/api/academy', academy_1.default);
const impact_1 = require("./impact");
const contact_1 = require("./contact");
app.use('/api/impact', (0, impact_1.createImpactRouter)());
app.use('/api/contact', (0, contact_1.createContactRouter)());
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'nexushub-backend' });
});
// Authentication service status & API proxy info
app.get('/api/auth/status', (_req, res) => {
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
exports.default = app;
