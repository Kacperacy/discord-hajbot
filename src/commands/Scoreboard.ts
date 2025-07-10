import { SlashCommand } from "../types/SlashCommand";
import { MongoDBClient } from "../clients/MongoDBClient";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

const Scoreboard: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("scoreboard")
    .setDescription("Create or manage a customizable scoreboard")
    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Create a scoreboard in this channel"),
    ),
  run: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId || !interaction.channelId) return;

    const sub = interaction.options.getSubcommand();

    if (sub === "create") {
      const existing = await MongoDBClient.getInstance().getScoreboard(
        interaction.guildId,
        interaction.channelId,
      );

      if (existing) {
        await interaction.reply({
          content: "Scoreboard already exists in this channel!",
          flags: 1 << 6,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Scoreboard")
        .setDescription(
          "No users yet. Use the buttons below to add users and variables.",
        )
        .setColor(0x00ae86);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("scoreboard-add-user")
          .setLabel("Add User")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("scoreboard-add-var")
          .setLabel("Add Variable")
          .setStyle(ButtonStyle.Secondary),
      );

      const textChannel = interaction.channel as TextChannel;
      const msg = await textChannel.send({
        embeds: [embed],
        components: [row],
      });
      await MongoDBClient.getInstance().createScoreboard(
        interaction.guildId,
        interaction.channelId,
        msg.id,
      );
      await interaction.reply({
        content: "Scoreboard created!",
        flags: 1 << 6,
      });
    }
  },
};

export default Scoreboard;
