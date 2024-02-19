import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from "../Command";
import { MongoDBClient } from "../clients/MongoDBClient";
import ServerSettings from "../types/ServerSettings";

export const SendLevelUp: Command = {
  name: "sendlevelup",
  description: "Turn on or off the level up message",
  options: [
    {
      name: "state",
      description: "Turn on or off the level up message",
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    },
  ],
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
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
      await interaction.followUp({
        ephemeral: true,
        content: "Level up message is off!",
      });
      return;
    } else if (interaction.options.get("state")?.value) {
      await interaction.followUp({
        ephemeral: true,
        content: "Level up message is on!",
      });
      return;
    }
  },
};
