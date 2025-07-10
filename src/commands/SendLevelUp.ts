import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
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
  run: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) return;

    const state = interaction.options.getBoolean("state");
    const settings = await MongoDBClient.getInstance().getServerSettings(
      interaction.guildId,
    );

    if (!settings) {
      await MongoDBClient.getInstance().upsertServerSettings({
        guildId: interaction.guildId,
        sendLevelUpMessage: state,
      } as ServerSettings);
    } else {
      settings.sendLevelUpMessage = state as boolean;
      await MongoDBClient.getInstance().upsertServerSettings(settings);
    }

    if (!state) {
      await interaction.reply({
        flags: 1 << 6,
        content: "Level up message is off!",
      });
      return;
    } else if (state) {
      await interaction.reply({
        flags: 1 << 6,
        content: "Level up message is on!",
      });
      return;
    }
  },
};

export default SendLevelUp;
