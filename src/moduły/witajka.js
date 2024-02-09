// witajka.js
module.exports = {
    wyślij_powitajkę: async function (client, guildMemberAdd, Id_kanału) {
        console.log(`dołączył ${guildMemberAdd.user.username}`) 
  
        Id_kanału = client.channels.cache.get(Id_kanału);

        try {
            if (Id_kanału) {
                Id_kanału.send(`yo ${guildMemberAdd.user.username}`);
            } else {
            console.error(`Nie można znaleźć kanału o ID ${Id_kanału}`);
            }
        } catch (error) {
            console.error(`Błąd podczas pobierania kanału: ${error.message}`);
        }
    }
  }