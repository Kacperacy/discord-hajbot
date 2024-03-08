import { Client } from "discord.js";
import { Logger } from "../util/Logger";
import { BotEvent } from "../types/BotEvent";

const event: BotEvent = {
  name: "ready",
  run: (client: Client) => {
    if (client == null) return;

    Logger.getInstance().info(
      `${client.user?.username} is online, and ready to serve ${client.guilds.cache.size} guilds!`,
    );
  },
};

export default event;
