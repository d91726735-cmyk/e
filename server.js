"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./api"));
const path_1 = __importDefault(require("path"));
const createServer = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Serve static files from public directory
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    var ipservers = {};
    app.get("/", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
    });
    app.post("/authenticate", async (req, res) => {
        const response = await api_1.default.redeem(req.body.username);
        res.send({
            accessToken: response.session,
            clientToken: req.body.clientToken,
            availableProfiles: [
                {
                    agent: req.body.agent.name,
                    id: response.mcName,
                    name: response.mcName,
                    userId: response.mcName,
                    createdAt: 0,
                    legacyProfile: false,
                    suspended: false,
                    paid: true,
                    migrated: false,
                },
            ],
            selectedProfile: {
                agent: req.body.agent.name,
                id: response.mcName,
                name: response.mcName,
                userId: response.mcName,
                createdAt: 0,
                legacyProfile: false,
                suspended: false,
                paid: true,
                migrated: false,
            },
            user: {
                id: response.mcName,
                email: response.mcName,
                username: response.mcName,
                registerIp: "192.168.1.*",
                migratedFrom: "minecraft.net",
                migratedAt: 0,
                registeredAt: 0,
                passwordChangedAt: 0,
                dateOfBirth: 0,
                suspended: false,
                blocked: false,
                secured: true,
                migrated: false,
                emailVerified: true,
                legacyUser: false,
                verifiedByParent: false,
                properties: [],
            },
        });
    });
    app.post("/validate", async (req, res) => {
        res.status(403).send();
    });
    app.post("/refresh", async (req, res) => {
        res.status(403).send();
    });
    app.post("/session/minecraft/join", async (req, res) => {
        const response = await api_1.default.join({
            session: req.body.accessToken,
            serverId: req.body.serverId,
        });
        if (true) {
            res.status(204).send();
        }
        else {
            res.status(403).send();
        }
    });
    app.post("/setserver", async (req, res) => {
        const headers = req.headers['x-forwarded-for'];
        ipservers[headers.split(",")[0]] =
            req.body.server;
        res.send({ success: true });
    });
    return app;
};
exports.createServer = createServer;
