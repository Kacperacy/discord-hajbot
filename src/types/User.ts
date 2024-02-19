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

export const defaultUser: User = {
  _id: new ObjectId(),
  discordId: "",
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
  totalMessages: 0,
};

export interface UsersInVoice {
  id: string;
  joinedAt: Date;
}

export interface UserLevel {
  exp: number;
  level: number;
}
