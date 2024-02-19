import { Client } from "discord.js";
import { ExpManager } from "../managers/ExpManager";
import { ObjectManager } from "../managers/ObjectManager";
import { MongoDBClient } from "../clients/MongoDBClient";
import { UsersInVoice, defaultUser } from "../types/User";

const usersInVoice: UsersInVoice[] = [];

async function updateUserTimeSpent(
  guildId: string,
  userId: string,
  timeSpent: number,
): Promise<void> {
  let user = await MongoDBClient.getInstance().getUser(guildId, userId);
  if (user === null || user === undefined) {
    user = { ...defaultUser };
    user.discordId = userId;
    await MongoDBClient.getInstance().upsertUser(guildId, user);
  }
  user.timeSpent += timeSpent;

  const manager = ObjectManager.getInstance().getObject(
    ExpManager.name,
  ) as ExpManager;

  await manager.addExp(guildId, user, timeSpent);
}

export default (client: Client): void => {
  client.on("voiceStateUpdate", (oldState, newState) => {
    const member = oldState.member || newState.member;

    if (!member) return;
    if (
      !client.user ||
      !client.application ||
      oldState.member?.user.bot ||
      newState.member?.user.bot
    ) {
      return;
    }

    if (oldState.channelId === null && newState.channelId !== null) {
      usersInVoice.push({ id: member.user.id, joinedAt: new Date() });
    } else if (oldState.channelId !== null && newState.channelId === null) {
      const user = usersInVoice.find((u) => u.id === member.user.id);
      if (user) {
        const timeSpent = Math.floor(
          (new Date().getTime() - user.joinedAt.getTime()) / 1000,
        );
        updateUserTimeSpent(member.guild.id, member.user.id, timeSpent);
        usersInVoice.splice(usersInVoice.indexOf(user), 1);
      }
    }
  });
};
