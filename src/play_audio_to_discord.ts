import { type VoiceChannel, type Client } from 'discord.js';
import { log } from './log.js';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';

let speaking = false;

export const playMediaFromUrl = async (
  mediaUrl: string,
  voiceChannelId: string,
  client: Client<true>
) => {
  if (speaking) {
    await log('I can only say one thing at a time', client);
    return;
  }

  speaking = true;

  const voiceChannel = client.channels.cache.get(
    voiceChannelId
  ) as VoiceChannel;
  if (!voiceChannel) {
    await log(
      `Could not connect to voice channel with ID '${voiceChannelId}'`,
      client
    );
    return;
  }

  return new Promise<void>((resolve) => {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const audioPlayer = createAudioPlayer();
    const audioResource = createAudioResource(mediaUrl);
    audioPlayer.play(audioResource);
    const subscription = connection.subscribe(audioPlayer);
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      setTimeout(() => {
        audioPlayer.stop();
        subscription?.unsubscribe();
        connection.disconnect();
        speaking = false;
        resolve();
      }, 500);
    });
  });
};
