import { Client } from "discord.js";

let client: Client;

export function setClient(newClient: Client) {
  client = newClient;
}

export function getClient() {
  return client;
}
