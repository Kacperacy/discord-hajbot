"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoStreak = void 0;
const discord_js_1 = require("discord.js");
const database_service_1 = require("../services/database.service");
exports.YoStreak = {
    name: "yo-streak",
    description: "Returns table with top 10 users with the highest streaks.",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const users = await (0, database_service_1.getTopStreaks)(10);
        let content = "Top users with the highest streaks:\n";
        users.forEach((user, index) => {
            const userObj = client.users.cache.get(user.discordId);
            content += `${index + 1}. ${userObj?.globalName} -> Current streak: ${user.yoStreak} Best streak: ${user.yoBestStreak}|\n`;
        });
        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};
