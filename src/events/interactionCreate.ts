import { Interaction, TextChannel, EmbedBuilder, Collection } from "discord.js";
import { BotEvent } from "../types/BotEvent";
import { Logger } from "../util/Logger";

const event: BotEvent = {
  name: "interactionCreate",
  run: async (interaction: Interaction) => {
    const { cooldowns } = interaction.client;

    if (cooldowns && interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      );
      if (command && command.cooldown) {
        const now = Date.now();
        const cooldownAmount = command.cooldown * 1000; // Convert to milliseconds

        if (!cooldowns.has(command.command.name)) {
          cooldowns.set(command.command.name, new Collection());
        }

        const commandCooldowns = cooldowns.get(command.command.name);

        if (!commandCooldowns) {
          Logger.getInstance().error(
            `No cooldowns found for command ${command.command.name}`,
          );
          return;
        }

        if (!commandCooldowns.has(interaction.user.id)) {
          commandCooldowns.set(interaction.user.id, now);
        } else {
          const lastUsed = commandCooldowns.get(interaction.user.id)!;
          if (now - lastUsed < cooldownAmount) {
            await interaction.reply({
              flags: 1 << 6,
              content: `Please wait ${Math.ceil((cooldownAmount - (now - lastUsed)) / 1000)} seconds before using this command again.`,
            });
            return;
          }
          commandCooldowns.set(interaction.user.id, now);
        }
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      );
      if (!command) return;
      command.run(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      );
      if (!command) {
        Logger.getInstance().error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }
      try {
        if (!command.autocomplete) return;
        command.autocomplete(interaction);
      } catch (error) {
        Logger.getInstance().error("Interaction autocomplete error", error);
      }
    } else if (interaction.isModalSubmit()) {
      const command = interaction.client.slashCommands.get(
        interaction.customId,
      );
      if (!command) {
        Logger.getInstance().error(
          `No command matching ${interaction.customId} was found.`,
        );
        return;
      }
      try {
        if (!command.modal) return;
        command.modal(interaction);
      } catch (error) {
        Logger.getInstance().error("Interaction modal error", error);
      }
    }
  },
};

export default event;
