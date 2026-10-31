import { Bot } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config.json';
import { execFile } from 'child_process';
import path from 'path';

const agent = new HttpsProxyAgent(config.proxy);

const bot = new Bot(config.token, { client: { baseFetchConfig: { agent } } });

bot.on('message:text', async (ctx) => {
  let text = ctx.message.text.trim();

  if (text === '/start') return;
  if (ctx.from?.id !== config.admin_id) return;

  if (text.includes('instagram') || text.includes('tiktok')) {
    execFile(
      'gallery-dl',
      ['-c', path.join(process.cwd(), 'gallery-dl.conf'), text],
      (error, stdout, stderr) => {
        console.log(error?.message || stdout || stderr);
      }
    );
  }

  if (text.includes('kick')) {
    text = text.toLowerCase();

    await fetch(config.sr_url, {
      method: 'POST',
      body: JSON.stringify({ slug: text }),
      headers: { 'Content-Type': 'application/json', 'X-Token': config.sr_token },
    });
  }
});

export const sendMessage = (message: string, channel: 'first' | 'second') =>
  bot.api.sendMessage(config.channels[channel], message, { parse_mode: 'HTML' });

bot.start();
