import { ObjectId } from "mongodb";

export default interface User {
  _id: ObjectId;
  discordId: string;
  yoCount: number;
  yoTotal: number;
  yoStreak: number;
  yoBestStreak: number;
  yoBestStreakDate: Date;
  yoLastDate: Date;
  timeSpent: number;
  exp: number;
  expTotal: number;
  level: number;
  totalMessages: number;
}
