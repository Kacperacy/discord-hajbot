import { Client, Collection } from "discord.js";
import "./types/Client";
import config from "./config";
import { join } from "path";
import { readdirSync } from "fs";
import { Logger } from "./util/Logger";

import { MessageManager } from "./managers/MessageManager";
import sendRandomDuckJob from "./jobs/sendRandomDuckJob";
import { SlashCommand } from "./types/SlashCommand";

process.on("unhandledRejection", (reason) => {
  Logger.getInstance().error("Unhandled Rejection at:", reason);
});

process.on("uncaughtException", (err) => {
  Logger.getInstance().error("Uncaught Exception thrown:", err);
});

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
client.cooldowns = new Collection<string, Collection<string, number>>();

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
