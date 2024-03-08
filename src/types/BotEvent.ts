export interface BotEvent {
  name: string;
  once?: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  run: (...args: any[]) => void;
}
