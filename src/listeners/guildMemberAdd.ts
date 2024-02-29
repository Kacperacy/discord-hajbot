import { Client, TextChannel } from "discord.js";

export default (client: Client): void => {
  client.on("guildMemberAdd", async (member) => {
    if (!client.user || !client.application) return;

    const channel =
      (member.guild.channels.cache.find(
        (c) => c.name === "witajka",
      ) as TextChannel) ??
      member.guild.channels.fetch().then((channels) => {
        channels.find((c) => c?.name === "witajka") as TextChannel;
      });

    if (!channel) return;

    await channel.send(`yo ${member.user.username}!`);
  });
};
