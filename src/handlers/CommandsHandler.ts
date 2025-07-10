import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import config from "../config";
import { Logger } from "../util/Logger";

export default async (client: Client) => {
  const slashCommands: SlashCommandBuilder[] = [];

  const slashCommandsDir = join(__dirname, "../commands");

  const files = readdirSync(slashCommandsDir);
  for (const file of files) {
    if (!file.endsWith(".js")) return;
    const command = (await import(`${slashCommandsDir}/${file}`)).default
      .default;
    slashCommands.push(command.command);
    client.slashCommands.set(command.command.name, command);
  }

  setInterval(() => {}, 1000);

  const rest = new REST({ version: "10" }).setToken(config.TOKEN as string);

  rest
    .put(Routes.applicationCommands(config.CLIENT_ID as string), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((data: any) => {
      Logger.getInstance().info(
        `Successfully loaded ${data.length} slash command(s)`,
      );
    })
    .catch((e) => {
      Logger.getInstance().error(e);
    });
};
