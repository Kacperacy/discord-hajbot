import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "../types/BotEvent";
import { Logger } from "../util/Logger";

export default (client: Client) => {
  const eventsDir = join(__dirname, "../events");

  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;
    import(`${eventsDir}/${file}`).then((file) => {
      const event: BotEvent = file.default.default;
      event.once
        ? client.once(event.name, (...args) => event.run(...args))
        : client.on(event.name, (...args) => event.run(...args));
      Logger.getInstance().info(`Successfully loaded event ${event.name}`);
    });
  });
};
