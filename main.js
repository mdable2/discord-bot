const dotenv = require("dotenv");
const Discord = require("discord.js");

dotenv.config();

const client = new Discord.Client();

const prefix = "!";

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping": {
      message.author.send("hello");
      console.log(message.author);
    }
    default: {
      return;
    }
  }
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
  try {
    let username;
    if (oldPresence) {
      username = oldPresence.member.user.username;
    }

    if (username && username === "sadsacks") {
      newPresence.activities.forEach((activity) => {
        if (activity.type === "PLAYING") {
          oldPresence.member
            .setNickname(`I suck at ${activity.name}`)
            .then(() => console.log(`Nickname change for ${username} success.`))
            .catch((err) => {
              console.error("Error: ", err);
            });
        }
      });
    }
  } catch (error) {
    console.log("Presence update error: ", error);
  }
});

// Must be last line in file
client.login(process.env.BOT_TOKEN);
