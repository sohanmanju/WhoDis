import config from './config.js';

export let voice = config.defaultVoice;

export const getTtsMediaUrl = async (
  url: string,
  referer: string,
  text: string
): Promise<string> => {
  const reply = (await (
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        referer,
      },
      body: JSON.stringify({
        voice,
        text,
      }),
    })
  ).json()) as { error: string; speak_url: string };
  if (reply.error) {
    throw new Error(reply.error);
  } else {
    return reply.speak_url;
  }
};

export const setVoice = (newVoice: string): void => {
  voice = newVoice;
};

export const nativeVoiceMapping: Record<string, string[]> = {
  ar: ['Zeina'],
  fa: ['Zeina'],
  hi: ['Aditi', 'Raveena'],
  ja: ['Mizuki', 'Takumi'],
  ko: ['Seoyeon'],
  ru: ['Tatyana', 'Maxim'],
  'zh-Hans': ['Zhiyu'],
};
