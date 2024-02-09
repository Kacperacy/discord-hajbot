"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const config_1 = tslib_1.__importDefault(require("./config"));
const ready_1 = tslib_1.__importDefault(require("./listeners/ready"));
const interactionCreate_1 = tslib_1.__importDefault(require("./listeners/interactionCreate"));
const messageCreate_1 = tslib_1.__importDefault(require("./listeners/messageCreate"));
const database_service_1 = require("./services/database.service");
const client = new discord_js_1.Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});
(0, database_service_1.connectToDatabase)();
(0, ready_1.default)(client);
(0, interactionCreate_1.default)(client);
(0, messageCreate_1.default)(client);
client.login(config_1.default.TOKEN);
