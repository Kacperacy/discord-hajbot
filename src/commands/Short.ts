import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  bold,
} from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { Logger } from "../util/Logger";

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
  run: async (interaction: ChatInputCommandInteraction) => {
    const url = interaction.options.getString("url");

    if (!url) {
      await interaction.reply({
        flags: 1 << 6,
        content: "No URL provided!",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://kacperacy.ovh/api/shorten?link=${url}`,
      );

      const data = (await response.json()) as ShortenResponse;

      await interaction.reply({
        content: `Shortened URL: ${bold(data.shortUrl)}`,
      });
    } catch (e) {
      Logger.getInstance().error(`Url shortener error: ${e}`);
      await interaction.reply({
        flags: 1 << 6,
        content: "Error while shortening URL!",
      });
    }
  },
};

export default Short;
