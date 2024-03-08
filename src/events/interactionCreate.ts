import { Interaction } from "discord.js";
import { BotEvent } from "../types/BotEvent";
import { Logger } from "../util/Logger";

const event: BotEvent = {
  name: "interactionCreate",
  run: (interaction: Interaction) => {
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
