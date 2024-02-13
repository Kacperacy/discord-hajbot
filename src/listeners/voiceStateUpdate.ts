import { Client } from "discord.js";
import {
  createUser,
  getUser,
  updateUserTimeSpent,
} from "../services/database.service";
import addExp from "../util/addExp";

interface UsersInVoice {
  id: string;
  joinedAt: Date;
}

const usersInVoice: UsersInVoice[] = [];

async function addTimeSpentExp(
  userId: string,
  timeSpent: number
): Promise<void> {
  let user = await getUser(userId);
  if (user === undefined || user === null) {
    await createUser(userId);
    user = await getUser(userId);
    if (user === undefined || user === null) return;
  }

  await addExp(user, timeSpent);
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
          (new Date().getTime() - user.joinedAt.getTime()) / 1000
        );
        updateUserTimeSpent(member.user.id, timeSpent);
        addTimeSpentExp(member.user.id, timeSpent);
      }
    }
  });
};
