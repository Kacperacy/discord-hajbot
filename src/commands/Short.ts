import { CommandInteraction, SlashCommandBuilder, bold } from "discord.js";
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
  run: async (interaction: CommandInteraction) => {
    const url = interaction.options.get("url")?.value as string;

    if (!url) {
      await interaction.reply({
        ephemeral: true,
        content: "No URL provided!",
      });
      return;
    }

    try {
      const response = await fetch(`https://kacperacy.ovh/shorten?link=${url}`);

      const data = (await response.json()) as ShortenResponse;

      await interaction.reply({
        ephemeral: false,
        content: `Shortened URL: ${bold(data.shortUrl)}`,
      });
    } catch (e) {
      Logger.getInstance().error("Url shortener error", e);
      await interaction.reply({
        ephemeral: true,
        content: "Error while shortening URL!",
      });
    }
  },
};

export default Short;
