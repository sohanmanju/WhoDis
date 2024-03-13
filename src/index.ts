import config from './config.js';

import { Client, Events, GatewayIntentBits, VoiceChannel } from 'discord.js';
import { log } from './log.js';
import { playMediaFromUrl } from './play_audio_to_discord.js';
import { getTtsMediaUrl, setVoice } from './tts.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
}) as Client<true>;

const commandPrefix = '!';

/* This is a two step process:
 * First, we make a request to our TTS provider and get a media URL.
 * Then we play the media behind that URL in the Discord voice channel
 * of the user who triggered this action.
 * Since there are external dependencies on two separate vendors here,
 * the chances of things breaking are high. As a result, we should
 * handle any errors gracefully.
 */
const speak = async (text: string, voiceChannelId: string) => {
  try {
    const mediaUrl = await getTtsMediaUrl(
      config.ttsUrl,
      config.ttsReferer,
      text
    );
    await playMediaFromUrl(mediaUrl, voiceChannelId, client);
  } catch (error: unknown) {
    if (error instanceof Error) {
      await log(
        `Could not play text to speech as audio: ${error.message}`,
        client
      );
    } else {
      await log(`Could not play text to speech as audio`, client);
    }
  }
};

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  await log('WhoDis is running.', readyClient);
});

/* If someone sends a message, before taking any action, we
 * want to first verify the following:
 * 1. The message starts with our command prefix
 * 2. The message is sent to the configured text channel for this bot
 * 3. The person sending the message is in a voice channel
 */
client.on(Events.MessageCreate, async (message) => {
  if (
    message.content.startsWith(commandPrefix) &&
    message.channelId === config.textChannelId
  ) {
    const voiceChannelIdOfPromptAuthor = client.guilds.cache
      .get(message.guildId || '')
      ?.members.cache.get(message.author.id)?.voice.channelId;

    if (!voiceChannelIdOfPromptAuthor) {
      await log(
        `Could not get ID for the voice channel that the prompting user '${message.author.tag}' was connected to. Maybe they are not in a voice channel?`,
        client
      );
      return;
    }

    const commands = message.content.split(' ');

    switch (commands[0]) {
      case `${commandPrefix}say`: {
        commands.shift();
        await speak(commands.join(' '), voiceChannelIdOfPromptAuthor);
        break;
      }

      case `${commandPrefix}voice`: {
        setVoice(commands[1]);
        const announcementLine = `Voice changed to ${commands[1]}`;
        await speak(announcementLine, voiceChannelIdOfPromptAuthor);
        await log(announcementLine, client);
        break;
      }

      default:
        return;
    }
  }
});

/* If there is a change in the users in voice chat, before taking
 * any action, we want to first verify the following:
 * 1. There is a voice channel associated with the change
 * 2. The voice channels before and after the change is not the same
 *    (This is a way to check that the change is associated with
 *     someone/something specifically joining a voice channel)
 * 3. The change is associated with a person joining a voice channel
 * 4. The person joining the voice channel is not our bot
 *
 */
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (
    newState.channelId &&
    newState.channelId !== oldState.channelId &&
    newState.member &&
    newState.member.user.id !== client.user.id
  ) {
    const voiceChannel = client.channels.cache.get(
      newState.channelId
    ) as VoiceChannel;
    if (voiceChannel.members.size === 1) {
      // No point announcing yourself to yourself
      return;
    }

    // If all conditions are met, announce who joined in the voice channel
    await speak(newState.member.displayName, voiceChannel.id);

    await log(
      `${newState.member?.displayName} joined ${newState.channel?.name}`,
      client
    );
  }
});

client.login(config.token);
