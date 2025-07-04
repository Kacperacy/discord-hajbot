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
      // Hardcoded MP4s for each weekday
      const weekdayMp4s: { [key: number]: string } = {
        0: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.mp4", // Sunday
        1: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4", // Monday
        2: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.mp4", // Tuesday
        3: "https://media.giphy.com/media/xT0GqFh1howpF6fG3G/giphy.mp4", // Wednesday
        4: "https://media.giphy.com/media/3o6Zt8zb1Pp2v3nRkQ/giphy.mp4", // Thursday
        5: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4", // Friday
        6: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.mp4", // Saturday
      };

      const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
      const mp4Url = weekdayMp4s[today] || "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif";

      // You may want to customize the message content
      const content = `JEST : \n${mp4Url}`;

      // Send the message to the appropriate channel(s)
      // You may want to loop through all servers or channels as needed
      // For demonstration, we'll assume a method sendMessage exists and a channelId is known
      // Replace 'YOUR_CHANNEL_ID' with the actual channel ID or fetch dynamically

      const channelId = "1195509728378368080";
      await MessageManager.getInstance().sendMessage(channelId, content);
    } catch (e) {
      Logger.getInstance().error("sendNewDayInfoJob handle error", e);
    }
  }
}
