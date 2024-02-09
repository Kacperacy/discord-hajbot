const config = require('./config/config').TOKEN;

const {Client, IntentsBitField} = require('discord.js');

// Import modułów
const witajka =require('./moduły/witajka.js');
const odpowiedzi =require('./moduły/odpowiedzi.js');
const xp =require('./moduły/xp.js');
const yodaily =require('./moduły/yodaily.js');

const util = require('minecraft-server-util');
const minecraftServerUtil = require('minecraft-server-util');

// Adres IP i port serwera Minecraft
const minecraftServerIP = '26.20.219.247';
const minecraftServerPort = 60121;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,  
  ]  
})

client.on('ready', (c) => {
  console.log(`Bocik działa sobie. Nazwa: ${c.user.tag}`)
  StatusBota(); // Dodano funkcję do ustawiania statusu
  setInterval(StatusBota, 60000); // Uruchamia funkcję co minutę (60000 milisekund)

})

client.on('messageCreate', (message) => {
  // odpowiedzi.wyślij_odpowiedź(message); 
  odpowiedzi.wyślij_odpowiedź(message);
  // xp
  xp.funkcja_xp();
  // yodaily
  yodaily.yo_daily(message,client);
})

client.on('guildMemberAdd', (guildMemberAdd) => {
  // witajka.wyślij_powitajkę(client, guildMemberAdd, Id_kanału); 
  witajka.wyślij_powitajkę(client, guildMemberAdd,'1020783307736236063'); 
})





async function StatusBota() {
  try {
    // Pobierz informacje o serwerze Minecraft
    const serverStatus = await minecraftServerUtil.status(minecraftServerIP, minecraftServerPort);

    // Ustaw nowy status bota z informacjami o serwerze
    client.user.setActivity({
      name: `test!!  Minecraft: ${serverStatus.online ? `Online (${serverStatus.players.online}/${serverStatus.players.max})` : 'Offline'}`,
    });
  } catch (error) {
    console.error('Błąd podczas pobierania informacji o serwerze Minecraft:', error);
  }
}

client.login(config)