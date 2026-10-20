import { Bot } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config.json';

const agent = new HttpsProxyAgent(config.proxy);

const bot = new Bot(config.token, { client: { baseFetchConfig: { agent } } });

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim().toLowerCase();

  if (text === '/start') return;
  if (ctx.from?.id !== config.admin_id) return;

  await fetch(config.sr_url, {
    method: 'POST',
    body: JSON.stringify({ slug: text }),
    headers: { 'Content-Type': 'application/json', 'X-Token': config.sr_token },
  });
});

export const sendMessage = (message: string, channel: 'first' | 'second') =>
  bot.api.sendMessage(config.channels[channel], message, { parse_mode: 'HTML' });

bot.start();
