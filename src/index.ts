import { Client, Collection } from "discord.js";
import config from "./config";
import { join } from "path";
import { readdirSync } from "fs";

import { MessageManager } from "./managers/MessageManager";
import sendRandomDuckJob from "./jobs/sendRandomDuckJob";
import { SlashCommand } from "./types/SlashCommand";

const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "MessageContent",
    "GuildVoiceStates",
  ],
});

client.slashCommands = new Collection<string, SlashCommand>();

MessageManager.setClient(client);
new sendRandomDuckJob();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith(".js")) return;
  import(`${handlersDir}/${handler}`).then((handler) =>
    handler.default.default(client),
  );
});

client.login(config.TOKEN);
