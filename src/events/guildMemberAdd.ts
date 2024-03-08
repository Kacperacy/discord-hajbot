import { GuildMember, TextChannel } from "discord.js";
import { BotEvent } from "../types/BotEvent";

const event: BotEvent = {
  name: "guildMemberAdd",
  run: async (member: GuildMember) => {
    const channel =
      (member.guild.channels.cache.find(
        (c) => c.name === "witajka",
      ) as TextChannel) ??
      member.guild.channels.fetch().then((channels) => {
        channels.find((c) => c?.name === "witajka") as TextChannel;
      });

    if (!channel) return;

    await channel.send(`yo ${member.user.username}!`);
  },
};

export default event;
