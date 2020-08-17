const dotenv = require("dotenv");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { debug } = require("console");

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
        const receiver = connection.receiver;

        // Need to play sound on join in order for bot to detect 'speaking' events
        const dispatcher = connection.play("fire_bow_sound-mike-koenig.mp3");
        dispatcher.on("start", () => {
          console.log("Scribe: Play Starting...");
        });
        dispatcher.on("finish", () => {
          console.log("Scribe: Finished playing!");
        });
        dispatcher.on("end", (end) => {
          console.log("Scribe: End Finished playing!");
        });

        connection.on("error", (err) => {
          console.log("Voice Error: ", err);
        });

        connection.on("speaking", (user, speaking) => {
          console.log(`${user.username} is speaking!`);

          // This creates a 16-bit signed PCM, stereo 48KHz PCM stream
          const audioStream = receiver.createStream(user, { mode: "pcm" });

          // TODO: need to set this outputStream to an external API so I can decode and capture the data I want then send it back
          const outputStream = fs.createWriteStream("audio_file.txt");

          audioStream.pipe(outputStream);

          audioStream.on("end", () => {
            console.log(`Scribe: stopped listening to ${user.username}`);
          });
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
