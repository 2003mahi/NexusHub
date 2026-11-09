"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommunityRouter = createCommunityRouter;
const express_1 = require("express");
function createCommunityRouter() {
    const router = (0, express_1.Router)();
    const FOUNDER_INFO = {
        name: 'Mahidhar',
        role: 'Founder & Lead Architect at NexusHub',
        bio: 'Building NexusHub as the unified global ecosystem uniting student innovators, venture founders, and high-impact industry professionals.',
        vision: 'Empowering ambitious creators with real-world project labs, peer networking, founder acceleration, and direct mentorship pathways.',
        location: 'Global / Virtual Hub',
        channels: [
            {
                name: 'NexusHub WhatsApp Channel',
                description: 'Instant announcements, project drops, community alerts, and official platform notifications directly on WhatsApp.',
                url: 'https://whatsapp.com/channel/0029VbBhwMJ0AgW4DyiKl40q',
                type: 'whatsapp',
                badge: 'Official Broadcast',
                actionLabel: 'Join WhatsApp Channel',
            },
            {
                name: 'NexusHub Telegram Space',
                description: 'Follow ecosystem updates, deep-dive technical insights, and access high-value community threads.',
                url: 'https://t.me/aMKEo1zdyzk1Njdl',
                type: 'telegram',
                badge: 'Follow & Read More',
                actionLabel: 'Open Telegram Channel',
            },
            {
                name: 'Topmate — Mahidhar',
                description: 'Book 1-on-1 mentorship sessions, startup advisory, tech architecture reviews, and personal career roadmaps.',
                url: 'https://topmate.io/mahidhar_07',
                type: 'topmate',
                badge: '1:1 Mentorship & Advisory',
                actionLabel: 'Book on Topmate',
            },
            {
                name: 'LinkedIn — Mahidhar',
                description: 'Connect directly on LinkedIn for ecosystem partnerships, executive outreach, and verified professional collaboration.',
                url: 'https://www.linkedin.com/in/mahidhar07/',
                type: 'linkedin',
                badge: 'Professional Network',
                actionLabel: 'Connect on LinkedIn',
            },
        ],
    };
    // Health and overview
    router.get('/overview', (_req, res) => {
        res.json({
            status: 'operational',
            module: 'NexusHub Community & Networking',
            founder: FOUNDER_INFO,
            channelsCount: FOUNDER_INFO.channels.length,
            features: [
                'member-discovery',
                'student-networking',
                'founder-circle',
                'professional-network',
                'discussions-ugc',
                'events-rsvp',
                'founder-channels',
            ],
        });
    });
    router.get('/founder', (_req, res) => {
        res.json(FOUNDER_INFO);
    });
    return router;
}
