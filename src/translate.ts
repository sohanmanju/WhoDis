import { translate as tr } from 'bing-translate-api';
import { type Client } from 'discord.js';
import { log } from './log.js';
import { nativeVoiceMapping, voice } from './tts.js';

export const translate = async (
  text: string,
  toLanguage: string,
  client: Client<true>
): Promise<string | undefined> => {
  try {
    const translateAPIResult = await tr(text, 'en', toLanguage);
    if (!translateAPIResult?.translation) {
      await log(`Did not get a translation from the API.`, client);
      return;
    }

    await log(translateAPIResult.translation, client);
    const toLanguageCode = translateAPIResult.language.to;
    if (
      !(
        nativeVoiceMapping[toLanguageCode] &&
        nativeVoiceMapping[toLanguageCode].length &&
        nativeVoiceMapping[toLanguageCode].includes(voice)
      )
    ) {
      await log(
        `Current voice ${voice} is not a native speaker of the translated language.`,
        client
      );
    }

    return translateAPIResult.translation;
  } catch (error: unknown) {
    if (error instanceof Error) {
      await log(`Could not translate: ${error.message}`, client);
      return;
    }
    await log(`Could not translate`, client);
  }
};
