import { Client } from "discord.js";
import config from "./config";

import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import gulidMemberAdd from "./listeners/guildMemberAdd";
import messageCreate from "./listeners/messageCreate";
import voiceStateUpdate from "./listeners/voiceStateUpdate";
import { ExpManager } from "./managers/ExpManager";
import { MessageManager } from "./managers/MessageManager";

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
interactionCreate(client);
gulidMemberAdd(client);
messageCreate(client);
voiceStateUpdate(client);

new ExpManager();
new MessageManager(client);

client.login(config.TOKEN);
