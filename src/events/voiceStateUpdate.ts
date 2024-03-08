import { ExpManager } from "../managers/ExpManager";
import { MongoDBClient } from "../clients/MongoDBClient";
import { UsersInVoice, defaultUser } from "../types/User";
import { BotEvent } from "../types/BotEvent";
import { VoiceState } from "discord.js";

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

  await ExpManager.getInstance().addExp(guildId, user, timeSpent);
}

const event: BotEvent = {
  name: "voiceStateUpdate",
  run: (oldState: VoiceState, newState: VoiceState) => {
    const member = oldState.member || newState.member;

    if (!member) return;
    if (oldState.member?.user.bot || newState.member?.user.bot) {
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
  },
};

export default event;
