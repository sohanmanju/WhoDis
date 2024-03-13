import { type Client, type TextChannel } from 'discord.js';
import config from './config.js';

let textChannel: TextChannel | undefined;

export const log = async (message: string, client: Client<true>) => {
  if (!textChannel) {
    textChannel = client.channels.cache.get(
      config.textChannelId
    ) as TextChannel;
  }
  await textChannel.send(message);
};
