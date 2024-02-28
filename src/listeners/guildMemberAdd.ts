import { Client, TextChannel } from "discord.js";

export default (client: Client): void => {
  client.on("guildMemberAdd", async (member) => {
    if (!client.user || !client.application) {
      console.log("1");

      return;
    }

    const channel = client.channels.cache.get("1020783307736236063");

    if (!channel) {
      console.log("nie znalazło kanału");
      return;
    } else {

      client.on("message", function (message) {
        message.channel.send(`yo ${member.nickname}!`);
        console.log("sranie w banie");
      });
      
      console.log("3");
    }
  });
};
