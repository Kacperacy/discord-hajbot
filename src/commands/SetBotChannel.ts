import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  TextChannel,
} from "discord.js";
import { Command } from "../Command";
import { MongoDBClient } from "../clients/MongoDBClient";
import ServerSettings from "../types/ServerSettings";

export const SetBotChannel: Command = {
  name: "set bot channel",
  description: "Sets the bot channel to the current channel.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const channel = interaction.channel as TextChannel;

    if (channel === null) {
      await interaction.followUp({
        ephemeral: true,
        content: "An error has occurred",
      });
      return;
    }

    await MongoDBClient.getInstance().upsertServerSettings({
      guildId: interaction.guildId,
      botChannelId: channel.id,
    } as ServerSettings);

    await interaction.followUp({
      ephemeral: true,
      content: `Bot channel has been set to ${channel.name}`,
    });
  },
};
