import { updateUser } from "../services/database.service";
import User from "../models/User";
import sendMessage from "./sendMessage";

interface UserLevel {
  exp: number;
  level: number;
}

async function levelUp(exp: number, currentLevel: number): Promise<UserLevel> {
  while (await isLevelUp(exp, currentLevel)) {
    exp -= await requiredExp(currentLevel + 1);
    currentLevel++;
  }
  return { exp, level: currentLevel };
}

async function isLevelUp(exp: number, currentLevel: number): Promise<Boolean> {
  return (await requiredExp(currentLevel + 1)) <= exp;
}

async function requiredExp(level: number): Promise<number> {
  return Math.floor(level * getBaseLog(5, level) * 1000 + 1000);
}

function getBaseLog(x: number, y: number) {
  return Math.log(y) / Math.log(x);
}

export default async function addExp(
  user: User,
  amount: number
): Promise<void> {
  const level = await levelUp(user.exp + amount, user.level);

  if (level.level > user.level) {
    sendMessage(
      `Pozdro dla ciebie <@${user.discordId}>! Właśnie wbiłeś ${level.level} poziom!`,
      "1022438140197224500"
    );
  }

  user.exp = level.exp;
  user.level = level.level;

  updateUser(user);
}
