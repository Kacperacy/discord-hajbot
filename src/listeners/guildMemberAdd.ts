import { Client, TextChannel } from "discord.js";

export default (client: Client): void => {
  client.on("guildMemberAdd", async (member) => {
    if (!client.user || !client.application) {
      return;
    }

    const channel = client.channels.cache.get("witajka") as TextChannel;

    if (!channel) {
      return;
    }

    await channel.send(`yo ${member.nickname}!`);
  });
};
