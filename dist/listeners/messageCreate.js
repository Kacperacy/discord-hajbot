"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../services/database.service");
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
async function updateStreak(userId) {
    const user = await (0, database_service_1.getUser)(userId);
    if (user !== undefined && user !== null) {
        let nextDay = new Date(user.yoLastDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (new Date() > nextDay) {
            user.yoTotal += 1;
            user.yoStreak += 1;
            if (user.yoStreak > user.yoBestStreak) {
                user.yoBestStreak = user.yoStreak;
                user.yoBestStreakDate = new Date();
            }
            user.yoLastDate = new Date();
        }
        user.yoCount += 1;
        await (0, database_service_1.updateUser)(userId, user);
    }
    else {
        await (0, database_service_1.createUser)(userId);
    }
}
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        if (!client.user || !client.application || message.author.bot) {
            return;
        }
        const channel = message.channel;
        if (channel === null)
            return;
        if (channel.name === null)
            return;
        const channelName = channel.name.toLowerCase();
        const isGeneralChannel = channelName === generalChannel || channelName === generalPrivChannel;
        if (message.content === "yo") {
            message.react("🦆");
            if (channelName === yoChannel)
                updateStreak(message.author.id);
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
        if (channelName === yoChannel &&
            !message.content.match(/^y+[!?. ;3:o]*$/i)) {
            message.react("🤬");
        }
        if (isGeneralChannel && message.content.includes("sperma")) {
            message.reply("https://media.discordapp.net/attachments/1020740231156220017/1148697472663830619/cooltext442495480652602.gif");
        }
        if (isGeneralChannel && message.content.includes("bagno")) {
            message.reply("https://cdn.discordapp.com/attachments/1020740231156220017/1190031310207598703/LOL.gif");
        }
    });
};
