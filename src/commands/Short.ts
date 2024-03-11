import { CommandInteraction, SlashCommandBuilder, bold } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";

interface ShortenResponse {
  shortUrl: string;
}

const Short: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("short")
    .addStringOption((option) =>
      option.setName("url").setDescription("URL to shorten").setRequired(true),
    )
    .setDescription("Shortens link."),
  run: async (interaction: CommandInteraction) => {
    const url = interaction.options.get("url")?.value as string;

    if (!url) {
      await interaction.reply({
        ephemeral: true,
        content: "No URL provided!",
      });
      return;
    }

    const response = await fetch(`http://kacperacy.ovh/shorten?link=${url}`);

    const data = (await response.json()) as ShortenResponse;

    await interaction.reply({
      ephemeral: false,
      content: `Shortened URL: ${bold(data.shortUrl)}`,
    });
  },
};

export default Short;
