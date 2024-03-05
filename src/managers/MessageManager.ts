import { Channel, ChannelType, Client } from "discord.js";
import { MongoDBClient } from "../clients/MongoDBClient";

export class MessageManager {
  private static client: Client;
  private static instance: MessageManager;

  constructor() {}

  public static getInstance(): MessageManager {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
    }

    return MessageManager.instance;
  }

  public static setClient(client: Client): void {
    MessageManager.client = client;
  }

  public async sendMessage(channelId: string, content: string): Promise<void> {
    const channel = (await MessageManager.client.channels.fetch(
      channelId,
    )) as Channel;

    if (channel && channel.type === ChannelType.GuildText) {
      channel.send(content);
    }
  }

  public async sendLevelUpMessage(
    guildId: string,
    content: string,
  ): Promise<void> {
    const settings =
      await MongoDBClient.getInstance().getServerSettings(guildId);

    if (!settings) return;
    if (!settings.sendLevelUpMessage) return;

    const channelId = settings.botChannelId;

    if (channelId === null || channelId === undefined) return;

    const channel = (await MessageManager.client.channels.fetch(
      channelId,
    )) as Channel;

    if (channel && channel.type === ChannelType.GuildText) {
      channel.send(content);
    }
  }

  public async sendRandomDuck(url: string): Promise<void> {
    this.sendMessage("1190669915305283615", url);
  }
}
