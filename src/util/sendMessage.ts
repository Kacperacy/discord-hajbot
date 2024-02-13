import { Channel, ChannelType } from "discord.js";

export default async function (
  content: string,
  channelId: string
): Promise<void> {
  const client = require("../util/clientObj").getClient();

  const channel = (await client.channels.fetch(channelId)) as Channel;
  if (channel.type === ChannelType.GuildText) {
    channel.send(content);
  }
}
