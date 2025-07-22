import { Message, TextChannel } from "discord.js";
import { ExpManager } from "../managers/ExpManager";
import { MongoDBClient } from "../clients/MongoDBClient";
import { defaultUser } from "../types/User";
import { BotEvent } from "../types/BotEvent";

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

async function addMessageExp(guildId: string, message: Message): Promise<void> {
  let user = await MongoDBClient.getInstance().getUser(
    guildId,
    message.author.id,
  );
  if (user === null || user === undefined) {
    user = { ...defaultUser };
    user.totalMessages = 1;
    user.discordId = message.author.id;
    await MongoDBClient.getInstance().upsertUser(guildId, user);
  } else {
    if (user.totalMessages === undefined) user.totalMessages = 0;
    user.totalMessages += 1;
  }

  await ExpManager.getInstance().addExp(
    guildId,
    user,
    Math.floor(message.content.length / 2 + 100),
  );
}

async function updateStreak(guildId: string, userId: string) {
  let user = await MongoDBClient.getInstance().getUser(guildId, userId);
  if (user === null || user === undefined) {
    user = { ...defaultUser };
    user.discordId = userId;
    await MongoDBClient.getInstance().upsertUser(guildId, user);
  }
  const nextDay = new Date(
    user.yoLastDate.getFullYear(),
    user.yoLastDate.getMonth(),
    user.yoLastDate.getDate(),
  );
  nextDay.setDate(nextDay.getDate() + 1);
  const nextTwoDays = new Date(
    user.yoLastDate.getFullYear(),
    user.yoLastDate.getMonth(),
    user.yoLastDate.getDate(),
  );
  nextTwoDays.setDate(nextTwoDays.getDate() + 2);
  const now = new Date();

  if (now < nextTwoDays && now > nextDay) {
    user.yoTotal += 1;
    user.yoStreak += 1;
    user.yoLastDate = now;
  } else if (now > nextDay) {
    user.yoTotal += 1;
    user.yoStreak = 1;
    user.yoLastDate = now;
  }

  if (user.yoStreak > user.yoBestStreak) {
    user.yoBestStreak = user.yoStreak;
    user.yoBestStreakDate = now;
  }

  user.yoCount += 1;

  await MongoDBClient.getInstance().upsertUser(guildId, user);
}

const event: BotEvent = {
  name: "messageCreate",
  run: async (message: Message) => {
    if (message.author.bot) return;
    if (message.guildId !== null) await addMessageExp(message.guildId, message);

    const channel = message.channel as TextChannel;
    if (channel === null) return;
    if (channel.name === null) return;
    const channelName = channel.name.toLowerCase();

    const isGeneralChannel =
      channelName === generalChannel || channelName === generalPrivChannel;

    if (message.content === "yo") {
      message.react("🦆");
      if (channelName === yoChannel && message.guildId !== null)
        await updateStreak(message.guildId, message.author.id);
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
  },
};

export default event;
