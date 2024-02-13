import * as mongoDB from "mongodb";
import config from "../config";
import User from "../models/User";

export const collections: { users?: mongoDB.Collection } = {};

export async function createUser(discordId: string) {
  await collections.users?.insertOne({
    discordId,
    yoCount: 1,
    yoTotal: 1,
    yoStreak: 1,
    yoBestStreak: 1,
    yoBestStreakDate: new Date(),
    yoLastDate: new Date(),
    timeSpent: 0,
    exp: 0,
    expTotal: 0,
    level: 0,
  });
}

export async function getUser(discordId: string): Promise<User | undefined> {
  return (await collections.users?.findOne({ discordId: discordId })) as User;
}

export async function getTopStreaks(amount: number): Promise<User[]> {
  return (await collections.users
    ?.find()
    .sort({ yoBestStreak: -1 })
    .limit(amount)
    .toArray()) as User[];
}

export async function getTopCount(amount: number): Promise<User[]> {
  return (await collections.users
    ?.find()
    .sort({ yoCount: -1 })
    .limit(amount)
    .toArray()) as User[];
}

export async function updateUser(discordId: string, update: User) {
  await collections.users?.updateOne(
    { discordId: discordId },
    { $set: update }
  );
}

export async function updateUserTimeSpent(
  discordId: string,
  timeSpent: number
) {
  await collections.users?.updateOne(
    { discordId: discordId },
    { $inc: { timeSpent } }
  );
}

export async function updateUserExp(
  discordId: string,
  exp: number,
  level: number
) {
  await collections.users?.updateOne(
    { discordId: discordId },
    { $inc: { expTotal: exp }, $set: { level, exp } }
  );
}

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    config.DB_CONN_STRING
  );

  await client.connect();

  const db: mongoDB.Db = client.db(config.DB_NAME);

  const usersCollection: mongoDB.Collection = db.collection(
    config.USERS_COLLECTION_NAME
  );

  collections.users = usersCollection;
}
