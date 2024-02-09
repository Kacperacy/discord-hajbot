// yodaily.js

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('usersDatabase.db');

module.exports = {
    yo_daily: async function (message, client) {

        const userId = message.author.id;

        // Tworzymy tabelę users w bazie danych, jeśli nie istnieje
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, yoCount INTEGER, lastMessageDate INTEGER, todayYo BOOLEAN, maxyo INTEGER)");
        });

        if (message.content === 'yo') {
            const userID = message.author.id;
            addUserIfNotExist(userID, () => {
                countDailyStreak(userID);
            });
        }

        if ((message.channel.id === '1022438140197224500') && message.content.toLowerCase() === '!topyo') {
            displayTopList(message);       
        }

        if ((message.channel.id === '1022438140197224500') && message.content.toLowerCase() === '!pokabaze' && 
        message.author.id === '240533404624355329') {
            pokabaze(message);       
        }
        

        // Funkcja dodająca użytkownika do bazy danych, jeśli nie istnieje
        function addUserIfNotExist(userID, callback) {
            db.get("SELECT * FROM users WHERE id = ?", [userID], (err, row) => {
                if (err) {
                    console.error("Błąd podczas dodawania użytkownika:", err);
                    return;
                }
                if (!row) {
                    db.run("INSERT INTO users (id, yoCount, lastMessageDate, todayYo) VALUES (?, 0, ?, 0)", [userID, new Date().getDate()], err => {
                        if (err) {
                            console.error("Błąd podczas dodawania użytkownika:", err);
                            return;
                        }
                        console.log("Dodano nowego użytkownika do bazy danych:", userID);
                    });
                }
                callback();
            });
        }

        // Funkcja zliczająca dzienny streak i resetująca go co 24 godziny
        function countDailyStreak(userID) {
            const currentDate = new Date().getDate();
            db.get("SELECT * FROM users WHERE id = ?", [userID], (err, row) => {
                if (err) {
                    console.error("Błąd podczas zliczania streaka:", err);
                    return;
                }
                if (row.lastMessageDate !== currentDate) {
                    db.run("UPDATE users SET lastMessageDate = ? WHERE id = ?", [currentDate, userID], err => {
                        if (err) {
                            console.error("Błąd zmiana daty", err);
                            return;
                        }
                    });
                    console.log(row.lastMessageDate);
                    console.log(currentDate);
                    db.run("UPDATE users SET yoCount = 0 WHERE id = ?", [userID], err => {
                        if (err) {
                            console.error("Błąd podczas resetowania punktów:", err);
                            return;
                        }
                    });
                }
                if (!row.todayYo) {
                    db.run("UPDATE users SET yoCount = yoCount + 1, todayYo = 1, lastMessageDate = ? WHERE id = ?", [currentDate, userID], err => {
                        if (err) {
                            console.error("Błąd podczas zliczania streaka:", err);
                            return;
                        }
                    });
                    
                    if (row.maxyo === null) {
                        db.run("UPDATE users SET yomax = 0 WHERE id = ?", [currentDate, userID], err => {
                            if (err) {
                                console.error("Błąd podczas zliczania streaka:", err);
                                return;
                            }
                        });
                    }
                    console.log("działąsdasd")
                }
            });
        }


        // Funkcja wyświetlająca top listę użytkowników
        function displayTopList(message) {
            db.all("SELECT * FROM users ORDER BY yoCount DESC", async (err, rows) => {
                if (err) {
                    console.error("Błąd podczas pobierania danych:", err);
                    return;
                }
                let topList = "Top lista użytkowników:\n";

                for (const [index, row] of rows.entries()) {
                    let user = client.users.cache.get(row.id);
                
                    if (!user) {
                        try {
                            user = await client.users.fetch(row.id);
                        } catch (error) {
                            console.error('Error fetching user:', error);
                            continue;
                        }
                    }
                
                    topList += `${index + 1}. Użytkownik ${user.globalName} z ilością yo: ${row.yoCount}\n`;
                }

                message.channel.send(topList);
            });
        }

         // Funkcja wyświetlająca bazę użytkowników
         function pokabaze(message) {
            db.all("SELECT * FROM users ORDER BY yoCount DESC", async (err, rows) => {
                if (err) {
                    console.error("Błąd podczas pobierania danych:", err);
                    return;
                }
                let topList = "Lista użytkowników:\n";

                for (const [index, row] of rows.entries()) {
                    let user = client.users.cache.get(row.id);
                
                    if (!user) {
                        try {
                            user = await client.users.fetch(row.id);
                        } catch (error) {
                            console.error('Error fetching user:', error);
                            continue;
                        }
                    }
                
                    topList += `${index + 1} ${row.yoCount} ${row.lastMessageDate} ${row.todayYo} ${row.maxyo}\n`;
                }

                message.channel.send("```"+topList+"```");
            });
        }

    }
}