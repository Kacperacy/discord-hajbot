import { CronJob } from "cron";
import { Logger } from "../util/Logger";
import { MessageManager } from "../managers/MessageManager";

export default class sendNewDayInfoJob {
  cronJob: CronJob;

  constructor() {
    this.cronJob = new CronJob(
      "0 0 * * *",
      async () => {
        try {
          await this.handle();
        } catch (e) {
          Logger.getInstance().error("sendNewDayInfoJob error", e);
        }
      },
      null,
      true,
      "Europe/Warsaw",
    );
  }

  public async handle() {
    try {
      // Hardcoded MP4s for each weekday for now gifs
      const weekdayMp4s: { [key: number]: string } = {
        0: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZnbGdhNndxNzNtenBxMTFjN3hsemR4eTZqNDJlaG9vNjY5NDkwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4P8hjejLHjxaL2FDuK/giphy.gif", // Sunday
        1: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJkcHkyZGtpYW12dmFtcjB0a2N5b201d25qbGJ2NHlhMzZ2Y3k4aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LrZ2TyqQCy6saT0OIR/giphy.gif", // Monday
        2: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmxwMmxtZmE4ZXNreDB0Nzh1cHRwOXFzZHoya2Q0OWFwZWkxZW80OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iEA88xFPjCHScm6Syg/giphy.gif", // Tuesday
        3: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMW93MmJzYWF6a2txdWIwNDdmenBheTV6d3JnNWVyMWZ4ZWpoNGVtNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gpw0UnPPZEfTHwx4xc/giphy.gif", // Wednesday
        4: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXl4aWtzM2V6MDF3Z3B4dWdrb3l4b2JkYnJmanpuanUzcnlyaGd3OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jsRQMrZDW7x50JPKrm/giphy.gif", // Thursday
        5: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTVjMWVrdHA0cDQ5YnU2MWJqdDJ5aXJ0dnU2enBxaTFoaW9ibHVqZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1x2Vv2luqAEJd0nbO1/giphy.gif", // Friday
        6: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzd3ZGh3bnp4ZmZvbDBuamplNTg0MzE2Yzl3dTVqZnptdXlpbnU4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IKCIKZsWrxE8aAP7WH/giphy.gif", // Saturday
      };

      const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
      const mp4Url = weekdayMp4s[today] || "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnRqNmpncHhwenRjMTMxamNyMGUxanB4d2RyamttaGs0cnAxOWhqZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1RkDDoIVs3ntm/giphy.gif";

      // First, send the text message
      const textContent = "JEST :";
      await MessageManager.getInstance().sendNewDayInfo(textContent);

      // Then, send the gif/mp4 link
      await MessageManager.getInstance().sendNewDayInfo(mp4Url);
    } catch (e) {
      Logger.getInstance().error("sendNewDayInfoJob handle error", e);
    }
  }
}
