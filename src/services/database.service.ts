import * as mongoDB from "mongodb";
import config from "../config";
import User from "../models/User";

export const collections: { users?: mongoDB.Collection } = {};

export async function createUser(discordId: string) {
  try {
    await collections.users?.insertOne({
      discordId,
      yoCount: 0,
      yoTotal: 0,
      yoStreak: 0,
      yoBestStreak: 0,
      yoBestStreakDate: new Date(),
      yoLastDate: new Date(),
      timeSpent: 0,
      exp: 0,
      expTotal: 0,
      level: 0,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getUser(discordId: string): Promise<User | undefined> {
  try {
    const user = (await collections.users?.findOne({
      discordId: discordId,
    })) as User;

    if (!user) {
      await createUser(discordId);
      return (await collections.users?.findOne({
        discordId: discordId,
      })) as User;
    }

    return user;
  } catch (err) {
    console.log(err);
  }
}

export async function getTopStreaks(
  amount: number,
): Promise<User[] | undefined> {
  try {
    return (await collections.users
      ?.find()
      .sort({ yoBestStreak: -1 })
      .limit(amount)
      .toArray()) as User[];
  } catch (err) {
    console.log(err);
  }
}

export async function getTopCount(amount: number): Promise<User[] | undefined> {
  try {
    return (await collections.users
      ?.find()
      .sort({ yoCount: -1 })
      .limit(amount)
      .toArray()) as User[];
  } catch (err) {
    console.log(err);
  }
}

export async function updateUser(update: User): Promise<void> {
  try {
    await collections.users?.updateOne(
      { discordId: update.discordId },
      { $set: update },
      { upsert: true },
    );
  } catch (err) {
    console.log(err);
  }
}

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    config.DB_CONN_STRING,
  );

  await client.connect();

  const db: mongoDB.Db = client.db(config.DB_NAME);

  const usersCollection: mongoDB.Collection = db.collection(
    config.USERS_COLLECTION_NAME,
  );

  collections.users = usersCollection;
}
