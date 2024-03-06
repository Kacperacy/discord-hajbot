import { Command } from "./Command";
import { Hello } from "./commands/Hello";
import { YoHighScore } from "./commands/YoHighScore";
import { YoStreak } from "./commands/YoStreak";
import { SetBotChannel } from "./commands/SetBotChannel";
import { Exp } from "./commands/Exp";
import { SendLevelUp } from "./commands/SendLevelUp";
import { ExpHighScore } from "./commands/ExpHighScore";
import { Hobby } from "./commands/Hobby";

export const Commands: Command[] = [
  Hello,
  YoHighScore,
  YoStreak,
  SetBotChannel,
  Exp,
  SendLevelUp,
  ExpHighScore,
  Hobby,
];
