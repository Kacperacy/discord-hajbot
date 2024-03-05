import { CronJob } from "cron";
import { Logger } from "../util/Logger";
import { MessageManager } from "../managers/MessageManager";

interface Duck {
  url: string;
}

export default class sendRandomDuckJob {
  cronJob: CronJob;

  constructor() {
    this.cronJob = new CronJob("0 7 * * *", async () => {
      try {
        await this.handle();
      } catch (e) {
        Logger.getInstance().error("sendRandomDuckJob error", e);
      }
    });
  }

  public async handle() {
    try {
      const content: Duck = await fetch("https://random-d.uk/api/random").then(
        (res) => res.json() as Promise<Duck>,
      );

      if (!content) {
        throw new Error("No duck found");
      }

      MessageManager.getInstance().sendRandomDuck(content.url);
    } catch (e) {
      Logger.getInstance().error("sendRandomDuckJob handle error", e);
    }
  }
}
