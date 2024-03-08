import { SlashCommandBuilder } from "discord.js";
import { MongoDBClient } from "../clients/MongoDBClient";
import { SlashCommand } from "../types/SlashCommand";

const YoHighScore: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("yo-high-score")
    .setDescription("Returns a greeting"),
  run: async (interaction) => {
    if (!interaction.guildId) return;
    const users = await MongoDBClient.getInstance().getTopCount(
      interaction.guildId,
      10,
    );

    if (users === null || users === undefined) {
      await interaction.reply({
        ephemeral: true,
        content: "An error has occurred",
      });
      return;
    }

    if (users.length === 0) {
      await interaction.reply({
        ephemeral: true,
        content: "No users found",
      });
      return;
    }

    let content = "Top users with the highest `yo` count:\n";
    for (const [index, user] of users.entries()) {
      let userObj = interaction.client.users.cache.get(user.discordId);

      if (userObj === undefined) {
        userObj = await interaction.client.users.fetch(user.discordId);
      }

      content += `${index + 1}. ${userObj?.globalName} -> Yo count: ${
        user.yoCount
      }\n`;
    }

    await interaction.reply({
      ephemeral: false,
      content,
    });
  },
};

export default YoHighScore;
