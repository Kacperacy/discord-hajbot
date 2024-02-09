import { Command } from "./Command";
import { Hello } from "./commands/Hello";
import { YoHighScore } from "./commands/YoHighScore";
import { YoStreak } from "./commands/YoStreak";

export const Commands: Command[] = [Hello, YoHighScore, YoStreak];
