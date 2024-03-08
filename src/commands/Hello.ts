import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";

const Hello: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Returns a greeting"),
  run: async (interaction) => {
    const content = "Hello there! I'm a bot!";

    await interaction.reply({
      ephemeral: false,
      content,
    });
  },
};

export default Hello;
