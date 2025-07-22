import { SlashCommandBuilder } from "discord.js";
import { MongoDBClient } from "../clients/MongoDBClient";
import { SlashCommand } from "../types/SlashCommand";

const YoStreak: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("yo-streak")
    .setDescription(
      "Returns table with top 10 users with the highest streaks.",
    ),
  run: async (interaction) => {
    if (!interaction.guildId) return;
    const users = await MongoDBClient.getInstance().getTopStreaks(
      interaction.guildId,
      10,
    );

    if (users === null || users === undefined) {
      await interaction.reply({
        flags: 1 << 6,
        content: "An error has occurred",
      });
      return;
    }

    if (users.length === 0) {
      await interaction.reply({
        flags: 1 << 6,
        content: "No users found",
      });
      return;
    }

    let content = "Top users with the highest streaks:\n";
    for (const [index, user] of users.entries()) {
      let userObj = interaction.client.users.cache.get(user.discordId);

      if (userObj === undefined) {
        userObj = await interaction.client.users.fetch(user.discordId);
      }

      content += `${index + 1}. ${userObj?.globalName} -> Current streak: ${
        user.yoStreak
      } Best streak: ${user.yoBestStreak}\n`;
    }

    await interaction.reply({
      content,
    });
  },
};

export default YoStreak;
