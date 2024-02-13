import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { getTopCount } from "../services/database.service";

export const YoHighScore: Command = {
  name: "yo-high-score",
  description: "Returns a greeting",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const users = await getTopCount(10);

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

    let content = "Top users with the highest `yo` count:\n";
    for (const [index, user] of users.entries()) {
      let userObj = client.users.cache.get(user.discordId);

      if (userObj === undefined) {
        userObj = await client.users.fetch(user.discordId);
      }

      content += `${index + 1}. ${userObj?.globalName} -> Yo count: ${
        user.yoCount
      }\n`;
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
