import { Bot } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config.json';
import { execFile, spawn } from 'child_process';
import path from 'path';

const cwd = process.cwd();

const getUrl = (text: string) => {
  const url = new URL(text);

  return url.origin + url.pathname;
};

const agent = new HttpsProxyAgent(config.proxy);

const bot = new Bot(config.token, { client: { baseFetchConfig: { agent } } });

bot.on('message:text', async (ctx) => {
  let text = ctx.message.text.trim();

  if (text === '/start') return;
  if (ctx.from?.id !== config.admin_id) return;

  if (text.includes('instagram') || text.includes('tiktok')) {
    execFile(
      'gallery-dl',
      ['-c', path.join(cwd, 'gallery-dl.conf'), getUrl(text)],
      (_, __, stderr) => ctx.react(stderr.includes('[error]') ? '😡' : '👍')
    );
  }

  if (text.includes('twitch')) {
    spawn(
      'wt',
      [
        '-w',
        '-1',
        'powershell',
        '-Command',
        'yt-dlp',
        '--config-location',
        path.join(cwd, 'yt-dlp.conf'),
        '--live-from-start',
        getUrl(text),
      ],
      { stdio: 'ignore', detached: true }
    ).unref();

    await ctx.react('👍');
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
