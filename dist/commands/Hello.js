"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hello = void 0;
const discord_js_1 = require("discord.js");
exports.Hello = {
    name: "hello",
    description: "Returns a greeting",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const content = "Hello there!";
        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};
