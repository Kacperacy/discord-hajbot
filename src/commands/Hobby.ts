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


    // Show buttons
    let message = interaction.followUp({
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

    // Disable buttons after 5 seconds
    setTimeout(async () => {
      (await message).edit({
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
  },
};
