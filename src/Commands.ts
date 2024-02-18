import { Command } from "./Command";
import { Hello } from "./commands/Hello";
import { YoHighScore } from "./commands/YoHighScore";
import { YoStreak } from "./commands/YoStreak";
import { SetBotChannel } from "./commands/SetBotChannel";
import { Exp } from "./commands/Exp";

export const Commands: Command[] = [
  Hello,
  YoHighScore,
  YoStreak,
  SetBotChannel,
  Exp,
];
