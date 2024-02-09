

// witajka.js
module.exports = {
    wyślij_odpowiedź: async function (message) {
        if (message.content === 'yo') {
            message.react("🦆");
        }
        if (message.content === 'co') {
            message.reply("jajco :egg:");
        }
        if (message.content === 'hehe') {
            message.reply(`hihi :flushed:`);
        }
        if (message.content === 'syzyf') {
            message.reply(`https://tenor.com/view/struggle-sisyphus-gif-4952086791107433131`);
        }
        if ((message.channel.id === '1020741092972433439') && !/^y+[!?. ;3:o]*$/i.test(message.content)) {
            message.react("🤬");
        }
        if (((message.channel.id === '1020740231156220017') || (message.channel.id === '1195509728378368080')) && /sperma/i.test(message.content)) {
            message.reply("https://media.discordapp.net/attachments/1020740231156220017/1148697472663830619/cooltext442495480652602.gif");
        }
        if (((message.channel.id === '1020740231156220017') || (message.channel.id === '1195509728378368080')) && /bagno/i.test(message.content)) {
            message.reply("https://cdn.discordapp.com/attachments/1020740231156220017/1190031310207598703/LOL.gif");
        }     
    }
  }