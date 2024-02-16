import { Command } from "./Command";
import { Hello } from "./commands/Hello";
import { YoHighScore } from "./commands/YoHighScore";
import { YoStreak } from "./commands/YoStreak";
import { SetBotChannel } from "./commands/SetBotChannel";

export const Commands: Command[] = [
  Hello,
  YoHighScore,
  YoStreak,
  SetBotChannel,
];
