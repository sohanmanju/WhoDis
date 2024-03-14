# WhoDis

A self-hosted discord bot that announces the name of a user that joins your voice channel

![image](https://user-images.githubusercontent.com/28390512/145213235-7dea6b31-0577-4c36-8887-48fee1bda8fd.png)

## Features

1. When someone joins your voice channel, WhoDis will also join the channel and read out the display name of the user who joined.
2. WhoDis also supports the following commands as additional features:
   1. `!say <text>`: WhoDis will join your voice channel and read out the given text.
   2. `!voice <name>`: WhoDis will change the TTS voice to the given name. You may need to check if the voice name is valid for the TTS provider being used.
   3. `!translate <language code> <text>`: WhoDis will translate english text to a given language and read it out in your voice channel.

## Setup

Take a look at `src/config.ts` and make sure the listed environment variables are present.

Run `npm install`.

Then `npm run build && npm run start`.
