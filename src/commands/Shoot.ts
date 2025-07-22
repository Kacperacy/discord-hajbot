import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { Logger } from "../util/Logger";

const Shoot: SlashCommand = {
  cooldown: 10 * 60,
  command: new SlashCommandBuilder()
    .setName("shoot")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Wybierz gracza do ruletki")
        .setRequired(true),
    )
    .setDescription("Strzelasz w oponenta"),
  run: async (interaction: ChatInputCommandInteraction) => {
    const target = interaction.options.getUser("target");
    const shooter = interaction.user;

    if (!target) {
      await interaction.reply({
        flags: 1 << 6,
        content: "Nie wybrano gracza!",
      });
      return;
    }

    const rand = Math.floor(Math.random() * 100) + 1;

    if (rand <= 30) {
      try {
        const member = await interaction.guild?.members.fetch(target.id);
        await member?.timeout(
          60 * 1000,
          `${shooter.displayName} cię ustrzelił beka`,
        );
      } catch (err) {
        Logger.getInstance().error(`User timeout error: ${err}`);
      }

      await interaction.reply({
        content: `${shooter.displayName} ustrzelił ${target.displayName}`,
      });
      return;
    }

    if (rand <= 90) {
      try {
        const member = await interaction.guild?.members.fetch(
          interaction.user.id,
        );
        await member?.timeout(
          60 * 1000,
          `Nie trafiłeś w ${target.displayName} beka`,
        );
      } catch (err) {
        Logger.getInstance().error(`User timeout error: ${err}`);
      }

      await interaction.reply({
        content: `${shooter.displayName} nie trafił w ${target.displayName} i sam został ustrzelony`,
      });

      return;
    }

    await interaction.reply({
      content: `${shooter.displayName} strzelał w ${target.displayName} ale trafił w powietrze `,
    });

    await interaction.followUp({
      content: `https://cdn.discordapp.com/attachments/1392806750687592528/1393549257264463992/dawid-jasper.gif`,
    });
  },
};

export default Shoot;
