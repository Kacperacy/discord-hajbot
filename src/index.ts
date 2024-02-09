import { Client } from "discord.js";
import config from "./config";

import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { connectToDatabase } from "./services/database.service";

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});

connectToDatabase();
ready(client);
interactionCreate(client);
messageCreate(client);

client.login(config.TOKEN);
