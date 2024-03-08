import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { MongoDBClient } from "../clients/MongoDBClient";
import ServerSettings from "../types/ServerSettings";

const SendLevelUp: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("sendlevelup")
    .addBooleanOption((option) =>
      option
        .setName("state")
        .setDescription("Turn on or off the level up message")
        .setRequired(true),
    )
    .setDescription("Turn on or off the level up message"),
  run: async (interaction) => {
    if (!interaction.guildId) return;

    const settings = await MongoDBClient.getInstance().getServerSettings(
      interaction.guildId,
    );

    if (!settings) {
      await MongoDBClient.getInstance().upsertServerSettings({
        guildId: interaction.guildId,
        sendLevelUpMessage: interaction.options.get("state")?.value,
      } as ServerSettings);
    } else {
      settings.sendLevelUpMessage = interaction.options.get("state")
        ?.value as boolean;
      await MongoDBClient.getInstance().upsertServerSettings(settings);
    }

    if (!interaction.options.get("state")?.value) {
      await interaction.reply({
        ephemeral: true,
        content: "Level up message is off!",
      });
      return;
    } else if (interaction.options.get("state")?.value) {
      await interaction.reply({
        ephemeral: true,
        content: "Level up message is on!",
      });
      return;
    }
  },
};

export default SendLevelUp;
