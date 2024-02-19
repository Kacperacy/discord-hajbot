import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { MongoDBClient } from "../clients/MongoDBClient";
import { defaultUser } from "../types/User";

export const Exp: Command = {
  name: "exp",
  description: "Returns a experience abd level of the user",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.user.id || !interaction.guildId) return;

    const user = await MongoDBClient.getInstance().getUser(
      interaction.guildId,
      interaction.user.id,
    );

    if (user === null || user === undefined) {
      const newUser = { ...defaultUser };
      newUser.discordId = interaction.user.id;
      MongoDBClient.getInstance().upsertUser(interaction.guildId, newUser);

      await interaction.followUp({
        ephemeral: true,
        content: "You have no experience!",
      });
      return;
    }

    const content = `You have ${user.exp} experience and are level ${user.level} with ${user.expTotal} total experience!`;

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
