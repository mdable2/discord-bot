const dotenv = require("dotenv");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const fs = require("fs");

dotenv.config();

const client = new Discord.Client();

const prefix = "!";

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping": {
      message.author.send("hello");
      console.log(message.author);
    }
    case "tilt-checker": {
      // Voice only works with guilds
      if (!message.guild) return;

      // Only join if member is part of a voice channel themselves
      if (message.member.voice.channel) {
        // Join the voice channel the member is currently in
        const connection = await message.member.voice.channel.join();
        connection.on("speaking", (user, speaking) => {
          console.log("here");
        });
        connection.on("debug", (debug) => {
          console.log("debug: ", debug);
        });
        connection.on("error", (err) => {
          console.log("error: ", err);
        });

        connection.on("speaking", (user, speaking) => {
          console.log("here");
          //   // Create a ReadableStream of s16le PCM audio (encoded Opus packets)
          //   const receiver = connection.receiver.createStream(user, {
          //     mode: "pcm",
          //   });
          //   receiver.pipe(fs.createWriteStream("user_audio"));

          if (speaking) {
            user.send("I am listening to you!");
          }
        });
      } else {
        message.reply("You need to join a voice channel first!");
      }
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
