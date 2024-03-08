import User, { UserLevel } from "../types/User";
import { MessageManager } from "./MessageManager";
import getBaseLog from "../util/getBaseLog";
import { MongoDBClient } from "../clients/MongoDBClient";

export class ExpManager {
  private static instance: ExpManager;

  constructor() {}

  public static getInstance(): ExpManager {
    if (!ExpManager.instance) {
      ExpManager.instance = new ExpManager();
    }

    return ExpManager.instance;
  }

  async levelUp(exp: number, currentLevel: number): Promise<UserLevel> {
    while (await this.isLevelUp(exp, currentLevel)) {
      exp -= await this.requiredExp(currentLevel + 1);
      currentLevel++;
    }
    return { exp, level: currentLevel };
  }

  async isLevelUp(exp: number, currentLevel: number): Promise<boolean> {
    return (await this.requiredExp(currentLevel + 1)) <= exp;
  }

  async requiredExp(level: number): Promise<number> {
    return Math.floor(level * (await getBaseLog(5, level)) * 1000 + 1000);
  }

  public async addExp(
    guildId: string,
    user: User,
    amount: number,
  ): Promise<void> {
    const level = await this.levelUp(user.exp + amount, user.level);

    if (level.level > user.level) {
      MessageManager.getInstance().sendLevelUpMessage(
        guildId,
        `Pozdro dla ciebie <@${user.discordId}>! Właśnie wbiłeś/łaś ${level.level} poziom!`,
      );
    }

    user.exp = level.exp;
    user.level = level.level;
    user.expTotal += amount;

    MongoDBClient.getInstance().upsertUser(guildId, user);
  }
}
