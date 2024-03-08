import { Collection } from "discord.js";
import { SlashCommand } from "./SlashCommand";

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
  }
}
