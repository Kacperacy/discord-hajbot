import { Client, Message, TextChannel } from "discord.js";
import { getUser, updateUser } from "../services/database.service";
import { ExpManager } from "../managers/ExpManager";
import { ObjectManager } from "../managers/ObjectManager";

const reactions = {
  lewak: "🇵🇱",
};

const messages = {
  co: "jajco :egg:",
  hehe: "hihi :flushed:",
  syzyf: "https://tenor.com/view/struggle-sisyphus-gif-4952086791107433131",
};

const yoChannel = "yo";
const generalChannel = "general";
const generalPrivChannel = "general-priv";

async function addMessageExp(message: Message): Promise<void> {
  const user = await getUser(message.author.id);
  if (user === null || user === undefined) return;
  if (user.totalMessages === undefined) user.totalMessages = 0;
  user.totalMessages += 1;

  const manager = ObjectManager.getInstance().getObject(
    ExpManager.name,
  ) as ExpManager;

  await manager.addExp(user, Math.floor(message.content.length / 2 + 100));
}

async function updateStreak(userId: string) {
  const user = await getUser(userId);
  if (user === null || user === undefined) return;

  const nextDay = new Date(user.yoLastDate);
  nextDay.setDate(nextDay.getDate() + 1);

  if (new Date() < nextDay && new Date() > user.yoLastDate) {
    user.yoTotal += 1;
    user.yoStreak += 1;
    if (user.yoStreak > user.yoBestStreak) {
      user.yoBestStreak = user.yoStreak;
      user.yoBestStreakDate = new Date();
    }
    user.yoLastDate = new Date();
  } else if (new Date() > nextDay) {
    user.yoTotal += 1;
    user.yoStreak = 1;
    user.yoLastDate = new Date();
  }

  user.yoCount += 1;

  await updateUser(user);
}

export default (client: Client): void => {
  client.on("messageCreate", async (message) => {
    if (!client.user || !client.application || message.author.bot) {
      return;
    }

    await addMessageExp(message);

    const channel = message.channel as TextChannel;
    if (channel === null) return;
    if (channel.name === null) return;
    const channelName = channel.name.toLowerCase();

    const isGeneralChannel =
      channelName === generalChannel || channelName === generalPrivChannel;

    if (message.content === "yo") {
      message.react("🦆");
      if (channelName === yoChannel) await updateStreak(message.author.id);
    }

    for (const [key, value] of Object.entries(reactions)) {
      if (message.content.toLowerCase() === key) {
        message.react(value);
      }
    }

    for (const [key, value] of Object.entries(messages)) {
      if (message.content.toLowerCase() === key) {
        message.reply(value);
      }
    }

    if (
      channelName === yoChannel &&
      !message.content.match(/^y+[!?. ;3:o]*$/i)
    ) {
      message.react("🤬");
    }
    if (isGeneralChannel && message.content.includes("sperma")) {
      message.reply(
        "https://media.discordapp.net/attachments/1020740231156220017/1148697472663830619/cooltext442495480652602.gif",
      );
    }
    if (isGeneralChannel && message.content.includes("bagno")) {
      message.reply(
        "https://cdn.discordapp.com/attachments/1020740231156220017/1190031310207598703/LOL.gif",
      );
    }
  });
};
