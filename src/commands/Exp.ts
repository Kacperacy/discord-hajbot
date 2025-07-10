import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { MongoDBClient } from "../clients/MongoDBClient";
import { defaultUser } from "../types/User";

const Exp: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("exp")
    .setDescription("Returns a experience abd level of the user"),
  run: async (interaction: CommandInteraction) => {
    if (!interaction.user.id || !interaction.guildId) return;

    const user = await MongoDBClient.getInstance().getUser(
      interaction.guildId,
      interaction.user.id,
    );

    if (user === null || user === undefined) {
      const newUser = { ...defaultUser };
      newUser.discordId = interaction.user.id;
      MongoDBClient.getInstance().upsertUser(interaction.guildId, newUser);

      await interaction.reply({
        flags: 1 << 6,
        content: "You have no experience!",
      });
      return;
    }

    const content = `You have ${user.exp} experience and are level ${user.level} with ${user.expTotal} total experience!`;

    await interaction.reply({
      content,
    });
  },
};

export default Exp;
