"use strict";
const api_1 = require("./api");
const server_1 = require("./server");
class Client extends api_1.EasyMC {
    constructor(api) {
        super(api);
        this.default = this;
        this.Client = Client;
    }
    createServer() {
        return (0, server_1.createServer)();
    }
}
module.exports = new Client('https://api.easymc.io/v1');
