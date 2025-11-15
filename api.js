"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyMC = exports.Alt = exports.defaultProxy = void 0;
const got_1 = __importDefault(require("got"));
exports.defaultProxy = 'https://easymc-serverproxy.glitch.me';
class Alt {
    constructor(client, data) {
        this.client = client;
        this.data = data;
        this.token = this.data.token;
        this.username = this.data.username;
    }
    async getSkin() {
        return this.client.get(`/token/skin?${this.token}`, { responseType: 'text' });
    }
    /**
     * Renews this alt.
     * @deprecated Doesn't work since the renew endpoint has a captcha.
     */
    async renew() {
        return this.client.renew(this.token);
    }
    /**
     * Redeems an alt, including information like the full minecraft username and the session.
     */
    async redeem() {
        return this.client.redeem(this.token);
    }
    /**
     * Checks if this alt is expired.
     */
    async isExpired() {
        const session = await this.redeem().then(i => i.session);
        const res = await this.client.post('/session/status', {
            json: {
                sessions: [session]
            }
        });
        return res[session].expired;
    }
    /**
     * Creates a client with `minecraft-protocol` that you can use to login to the alt and manage packets at a low level.
     * @param opts The options to use with `minecraft-protocol`.
     */
    createClient(opts) {
        throw new Error('minecraft-protocol is not available in this build');
    }
    /**
     * Creates a bot with `mineflayer` that you can use to manage the bot at a higher level.
     * @param opts The options to use with `mineflayer`.
     */
    createBot(opts) {
        throw new Error('mineflayer is not available in this build');
    }
}
exports.Alt = Alt;
class EasyMC {
    constructor(api) {
        this.api = api;
        this.setCaptcha('Default');
    }
    /**
     * Sets the captcha to use for some requests
     * @deprecated
     * @param captcha The captcha to set it to
     */
    setCaptcha(captcha) {
        this.captcha = captcha;
        return this;
    }
    /**
     * Renews an alt from a token.
     * @deprecated Doesn't work since the renew endpoint has a captcha.
     * @param token The token to renew.
     */
    async renew(token) {
        const alt = await this.post('/token/renew', {
            json: {
                token
            }
        });
        return alt;
    }
    /**
     * Redeems an alt, including information like the full minecraft username and the session.
     * @param token The token to redeem.
     */
    async redeem(token) {
        return await this.post('/token/redeem', {
            json: {
                token,
                captcha: this.captcha
            }
        });
    }
    /**
     * @deprecated EasyMC has changed to require a captcha every 30 seconds, so this won't work.
     * Generates an alt. May require you go to onto the EasyMC site first and get one so that you can refresh the captcha.
     * @param newAlt Whether to generate a new alt or use the last previously generated one
     */
    async generate(newAlt = true) {
        const alt = await this.get(newAlt ? `/token?new=true` : `/token`);
        return new Alt(this, alt);
    }
    /**
     * Creates an alt object from the token.
     * @param token
     */
    async alt(token) {
        const alt = {
            token
        };
        return new Alt(this, alt);
    }
    /**
     * Sends a `GET` request to the EasyMC api on a lower level.
     * @param url The path for your request
     * @param options The options of the request
     */
    async get(url, options) {
        const req = `${this.api}${url}`;
        return got_1.default.get(req, { responseType: 'json', ...options }).then(i => i.body);
    }
    /**
     * Sends at a `POST` request to the EasyMC api on a lower level.
     * @param url The path for your request
     * @param options The options of the request
     */
    async post(url, options) {
        return got_1.default.post(`${this.api}${url}`, { responseType: 'json', ...options }).then(i => i.body);
    }
    /**
     * Gets the settings for the EasyMC client, like the version of the client.
     */
    async clientSettings() {
        return this.get('/client/settings');
    }
    /**
     * Gets the auth and session server for EasyMC.
     */
    async getAuthServer() {
        return this.clientSettings().then(i => i.authServer);
    }
    async join(...args) {
        if (args.length === 1) {
            const [arg] = args;
            let server;
            if (arg.serverId) {
                server = arg.serverId;
            }
            else if (arg.serverHash) {
                server = arg.serverHash;
            }
            return await this.join(arg.session, server);
        }
        const [session, serverId] = args;
        return this.post('/session/join', {
            json: {
                session,
                serverId
            }
        });
    }
    /**
     * Sets the server with the EasyMC API. May be needed for logging in. Returns a `got` response.
     * @param server The server to login to.
     * @param proxy The proxy to login to. Defaults to the easymc proxy on glitch. You can host your own proxy with the exported `createServer()` method.
     */
    async setServer(server, proxy) {
        proxy = proxy !== null && proxy !== void 0 ? proxy : exports.defaultProxy;
        return await got_1.default.post(`${proxy}/setserver`, {
            json: {
                server
            }
        });
    }
    /**
     * Creates a client with `minecraft-protocol` that you can use to login to an alt and manage packets at a low level.
     * @param opts The options to use with `minecraft-protocol`.
     */
    async createClient(token, opts) {
        throw new Error('minecraft-protocol is not available in this build');
    }
    /**
     * Creates a bot with `mineflayer` that you can use to manage the bot at a higher level.
     * @param opts The options to use with `mineflayer`.
     */
    async createBot(token, opts) {
        throw new Error('mineflayer is not available in this build');
    }
}
exports.EasyMC = EasyMC;
const easymc = new EasyMC('https://api.easymc.io/v1');
exports.default = easymc;
