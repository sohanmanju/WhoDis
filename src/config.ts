import 'dotenv/config';

const camelCaseToConstantCase = (input: string) =>
  input.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toUpperCase();

const config = {
  token: process.env.TOKEN || '',
  defaultVoice: process.env.DEFAULT_VOICE || 'Aditi',
  textChannelId: process.env.TEXT_CHANNEL_ID || '',
  ttsUrl: process.env.TTS_URL || '',
  ttsReferer: process.env.TTS_REFERER || '',
};

for (const [key, value] of Object.entries(config)) {
  if (!value) {
    throw new Error(
      `No value found for ${camelCaseToConstantCase(key)}. Make sure an environment variable with this key is available with a non-empty value.`
    );
  }
}

export default config;
