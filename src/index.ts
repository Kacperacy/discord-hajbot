import { Client } from "discord.js";
import config from "./config";

import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import voiceStateUpdate from "./listeners/voiceStateUpdate";
import { ExpManager } from "./managers/ExpManager";
import { MessageManager } from "./managers/MessageManager";
import guildMemberAdd from "./listeners/guildMemberAdd";
import sendRandomDuckJob from "./jobs/sendRandomDuckJob";

const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "MessageContent",
    "GuildVoiceStates",
  ],
});

ready(client);
guildMemberAdd(client);
interactionCreate(client);
messageCreate(client);
voiceStateUpdate(client);

new ExpManager();
new MessageManager(client);
new sendRandomDuckJob();

client.login(config.TOKEN);
