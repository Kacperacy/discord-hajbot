import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { MongoDBClient } from "../clients/MongoDBClient";

export const ExpHighScore: Command = {
  name: "exp-high-score",
  description: "Returns a experience abd level of the user",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.user.id || !interaction.guildId) return;

    const users = await MongoDBClient.getInstance().getTopExp(
      interaction.guildId,
      10,
    );

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

    let content = "Top users with the highest exp:\n";
    for (const [index, user] of users.entries()) {
      let userObj = client.users.cache.get(user.discordId);

      if (userObj === undefined) {
        userObj = await client.users.fetch(user.discordId);
      }

      content += `${index + 1}. ${userObj?.globalName} -> Level: ${user.level}, current exp: ${user.exp}, total exp: ${user.expTotal}\n`;
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
