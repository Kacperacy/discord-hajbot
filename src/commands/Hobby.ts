import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Command } from "../Command";

// Dodawanie przycisku
const button = new ButtonBuilder()
  .setCustomId("open_case_button")
  .setLabel("Open Case")
  .setStyle(ButtonStyle.Primary);

export const Hobby: Command = {
  name: "hobby",
  description: "Symulator hobby",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = "Open case?";

    await interaction.followUp({
      ephemeral: true,
      content,
      components: [
        {
          type: 1, // Typ 1 to wiersz akcji
          components: [button.toJSON()], // Dodajemy przycisk do wiersza akcji
        },
      ],
    });
  },
};
