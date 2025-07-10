import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/SlashCommand";
import { Logger } from "../util/Logger";

const Shoot: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("shoot")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Wybierz gracza do ruletki")
        .setRequired(true),
    )
    .setDescription("Kręcisz ruletą!"),
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

    if (rand <= 5) {
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

    if (rand <= 15) {
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
      content: `${shooter.displayName} strzelał w ${target.displayName} ale trafił w powietrze`,
    });
  },
};

export default Shoot;
