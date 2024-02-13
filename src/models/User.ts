import { ObjectId, Timestamp } from "mongodb";

export default interface User {
  _id: ObjectId;
  discordId: string;
  yoCount: number;
  yoTotal: number;
  yoStreak: number;
  yoBestStreak: number;
  yoBestStreakDate: Date;
  yoLastDate: Date;
  timeSpent: Timestamp;
  exp: number;
  expTotal: number;
  level: number;
}
