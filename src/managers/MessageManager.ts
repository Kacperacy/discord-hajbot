import { Channel, ChannelType, Client } from "discord.js";
import { ObjectManager } from "./ObjectManager";
import { MongoDBClient } from "../clients/MongoDBClient";

export class MessageManager {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    ObjectManager.getInstance().registerObjectIfNotExists(
      this.constructor.name,
      this,
    );
  }

  public async sendMessage(channelId: string, content: string): Promise<void> {
    const channel = (await this.client.channels.fetch(channelId)) as Channel;

    if (channel.type === ChannelType.GuildText) {
      channel.send(content);
    }
  }

  public async sendMessageDefaultChannel(
    guildId: string,
    content: string,
  ): Promise<void> {
    const channelId = (
      await MongoDBClient.getInstance().getServerSettings(guildId)
    )?.guildId;
    if (channelId === null || channelId === undefined) return;

    const channel = (await this.client.channels.fetch(channelId)) as Channel;

    if (channel.type === ChannelType.GuildText) {
      channel.send(content);
    }
  }
}
