import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { MongoDBClient } from "../clients/MongoDBClient";
import { Logger } from "../util/Logger";

const ExpHighScore: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("exp-high-score")
    .setDescription("Returns a experience abd level of the user"),
  run: async (interaction) => {
    if (!interaction.user.id || !interaction.guildId) return;

    const users = await MongoDBClient.getInstance().getTopExp(
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

    let content = "Top users with the highest exp:\n";
    for (const [index, user] of users.entries()) {
      let userObj;
      try {
        userObj = interaction.client.users.cache.get(user.discordId);
        if (!userObj) {
          userObj = await interaction.client.users.fetch(user.discordId);
        }
      } catch (error) {
        Logger.getInstance().info(`User not found: ${user.discordId}`);
      }

      content += `${index + 1}. ${userObj?.globalName || "Unknown User"} -> Level: ${user.level}, current exp: ${user.exp}, total exp: ${user.expTotal}\n`;
    }

    await interaction.reply({
      content,
    });
  },
};

export default ExpHighScore;
