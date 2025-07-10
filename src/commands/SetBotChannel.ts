import { SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { MongoDBClient } from "../clients/MongoDBClient";
import ServerSettings from "../types/ServerSettings";

const SetBotChannel: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("setbotchannel")
    .setDescription("Sets the bot channel to the current channel."),
  run: async (interaction) => {
    if (!interaction.guildId) return;
    const channel = interaction.channel as TextChannel;
    if (channel === null) {
      await interaction.reply({
        flags: 1 << 6,
        content: "An error has occurred",
      });
      return;
    }
    await MongoDBClient.getInstance().upsertServerSettings({
      guildId: interaction.guildId,
      botChannelId: channel.id,
    } as ServerSettings);
    await interaction.reply({
      flags: 1 << 6,
      content: `Bot channel has been set to ${channel.name}`,
    });
  },
};

export default SetBotChannel;
