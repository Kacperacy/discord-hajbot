import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  Emoji,
  Collector,
} from "discord.js";
import { Command } from "../Command";
import interactionCreate from "../listeners/interactionCreate";

// Add new button
const button = new ButtonBuilder()
  .setCustomId("open_case_button")
  .setLabel("Open Case")
  .setStyle(ButtonStyle.Primary);
  
// Add new button
const button2 = new ButtonBuilder()
  .setCustomId("close_button")
  .setLabel("Close")
  .setStyle(ButtonStyle.Primary);
  
// Add new button
const button3 = new ButtonBuilder()
  .setCustomId("duck_button")
  .setLabel(":duck:")
  .setStyle(ButtonStyle.Primary)
  

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
          type: 1, 
          components: [button.toJSON()], 
        },
        {
          type: 1, 
          components: [button2.toJSON()], 
        },
        {
          type: 1, 
          components: [button3.toJSON()], 
        },
      ],
    });


    // Inreactions with buttons
    client.on('interactionCreate', (interaction) => {
      if(interaction.isButton()) {
        if(interaction.customId === 'close_button') {
          interaction.reply('Zamykam');
        } else {
          interaction.reply('yo');
        }
      }
    })

    // Disable buttons after 5 seconds
    setTimeout(() => {
      interaction.followUp({
        components: [
          {
            type: 1,
            components: [button.setDisabled(true).toJSON()],
          },
          {
            type: 1,
            components: [button2.setDisabled(true).toJSON()],
          },
          {
            type: 1,
            components: [button3.setDisabled(true).toJSON()],
          },
        ],
      });
    }, 5000);
  },
};
