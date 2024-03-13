import config from './config.js';

let voice = config.defaultVoice;

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

export const nativeVoiceMapping = {
  ja: ['Mizuki', 'Takumi'],
  zh: ['Zhiyu'],
  'zh-cn': ['Zhiyu'],
  'zh-tw': ['Zhiyu'],
  ar: ['Zeina'],
  fa: ['Zeina'],
  hi: ['Aditi', 'Raveena'],
  ko: ['Seoyeon'],
  ru: ['Tatyana', 'Maxim'],
};
