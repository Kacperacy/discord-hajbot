import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../config";
import { Logger } from "../util/Logger";
import User from "../types/User";
import ServerSettings from "../types/ServerSettings";

export class MongoDBClient {
  private client: MongoClient;

  private static instance: MongoDBClient;

  static getInstance(): MongoDBClient {
    if (!this.instance) this.instance = new MongoDBClient();
    return this.instance;
  }

  constructor() {
    if (!config.DB_CONN_STRING) {
      Logger.getInstance().error("DB_CONN_STRING not found in config");
      throw new Error("DB_CONN_STRING not found in config");
    }

    this.client = new MongoClient(config.DB_CONN_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    });
  }

  public async getUser(
    guildId: string,
    discordId: string,
  ): Promise<User | undefined> {
    try {
      const users = this.client.db(config.USERS_DB_NAME).collection(guildId);

      return (await users?.findOne({
        discordId: discordId,
      })) as User;
    } catch (err) {
      Logger.getInstance().error(
        `Error getting user with discordId: ${discordId}: ${err}`,
      );
    }
  }

  public async getTopStreaks(
    guildId: string,
    amount: number,
  ): Promise<User[] | undefined> {
    try {
      const users = this.client.db(config.USERS_DB_NAME).collection(guildId);

      return (await users
        ?.find()
        .sort({ yoBestStreak: -1 })
        .limit(amount)
        .toArray()) as User[];
    } catch (err) {
      Logger.getInstance().error(`Error getting top streaks: ${err}`);
    }
  }

  public async getTopCount(
    guildId: string,
    amount: number,
  ): Promise<User[] | undefined> {
    try {
      const users = this.client.db(config.USERS_DB_NAME).collection(guildId);

      return (await users
        ?.find()
        .sort({ yoCount: -1 })
        .limit(amount)
        .toArray()) as User[];
    } catch (err) {
      Logger.getInstance().error(`Error getting top count: ${err}`);
    }
  }

  public async getTopExp(
    guildId: string,
    amount: number,
  ): Promise<User[] | undefined> {
    try {
      const users = this.client.db(config.USERS_DB_NAME).collection(guildId);

      return (await users
        ?.find()
        .sort({ expTotal: -1 })
        .limit(amount)
        .toArray()) as User[];
    } catch (err) {
      Logger.getInstance().error(`Error getting top exp: ${err}`);
    }
  }

  public async upsertUser(guildId: string, update: User): Promise<void> {
    try {
      const users = this.client.db(config.USERS_DB_NAME).collection(guildId);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...updateWithoutId } = update;

      await users?.updateOne(
        { discordId: update.discordId },
        { $set: updateWithoutId },
        { upsert: true },
      );
    } catch (err) {
      Logger.getInstance().error(`Error updating user: ${err}`);
    }
  }

  public async createServerSettings(guildId: string): Promise<void> {
    try {
      if (config.SETTINGS_COLLECTION_NAME === undefined)
        throw new Error("settingsCollectionName is undefined");

      const settings = this.client
        .db(config.SETTINGS_DB_NAME)
        .collection(config.SETTINGS_COLLECTION_NAME);

      await settings?.insertOne({
        guildId,
        botChannelId: "",
        sendLevelUpMessage: true,
      });
    } catch (err) {
      Logger.getInstance().error(`Error adding server settings: ${err}`);
    }
  }

  public async getServerSettings(
    guildId: string,
  ): Promise<ServerSettings | null> {
    try {
      if (config.SETTINGS_COLLECTION_NAME === undefined)
        throw new Error("settingsCollectionName is undefined");

      const settings = this.client
        .db(config.SETTINGS_DB_NAME)
        .collection(config.SETTINGS_COLLECTION_NAME);

      return (await settings?.findOne({
        guildId: guildId,
      })) as ServerSettings;
    } catch (err) {
      Logger.getInstance().error(`Error getting server settings: ${err}`);
      return null;
    }
  }

  public async upsertServerSettings(
    serverSettings: ServerSettings,
  ): Promise<void> {
    try {
      if (config.SETTINGS_COLLECTION_NAME === undefined)
        throw new Error("settingsCollectionName is undefined");

      const settings = this.client
        .db(config.SETTINGS_DB_NAME)
        .collection(config.SETTINGS_COLLECTION_NAME);

      await settings?.updateOne(
        { guildId: serverSettings.guildId },
        { $set: serverSettings },
        { upsert: true },
      );
    } catch (err) {
      Logger.getInstance().error(`Error updating server settings: ${err}`);
    }
  }
}
