# discord-bot

To run type `node .` in root.

## "I Suck At {Game}" Feature

Everytime `user` plays `game` the `user`'s display name becomes `user-sucks-at-game`

## "Tilt Checker" Feature

Links for creating a "Detect Tilt" feature:

- https://discordjs.guide/voice/#quick-example
- https://discord.js.org/#/docs/main/stable/topics/voice
- https://discord.js.org/#/docs/main/stable/class/VoiceReceiver
- https://stackoverflow.com/questions/54786472/discord-save-user-voice-with-voicereceiver
- https://discordjs.guide/additional-info/changes-in-v12.html#voice

Overall idea --> discord.js server gets pcm voice stream, connection to flask hosted websocket server via socketio to send this byte stream to server which analyzes voice data with pyaudio, voice data sent back to discord.js server so "Tilt Checker" can be utilized AND voice data from server is sent to another python connection that receives the data and displays it graphically via numpy and matplotlib.
- https://www.fullstackpython.com/websockets.html
