import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { MongoDBClient } from "../MongoDBClient";

export const YoStreak: Command = {
  name: "yo-streak",
  description: "Returns table with top 10 users with the highest streaks.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const users = await MongoDBClient.getInstance().getTopStreaks(10);

    if (users === null || users === undefined) {
      await interaction.followUp({
        ephemeral: true,
        content: "An error has occurred",
      });
      return;
    }

    if (users.length === 0) {
      await interaction.followUp({
        ephemeral: true,
        content: "No users found",
      });
      return;
    }

    let content = "Top users with the highest streaks:\n";
    for (const [index, user] of users.entries()) {
      let userObj = client.users.cache.get(user.discordId);

      if (userObj === undefined) {
        userObj = await client.users.fetch(user.discordId);
      }

      content += `${index + 1}. ${userObj?.globalName} -> Current streak: ${
        user.yoStreak
      } Best streak: ${user.yoBestStreak}\n`;
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
