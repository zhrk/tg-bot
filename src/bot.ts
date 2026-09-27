import { Telegraf } from 'telegraf';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config.json';

const agent = new HttpsProxyAgent(config.proxy);

const bot = new Telegraf(config.token, { telegram: { agent } });

export const sendMessage = (message: string) =>
  bot.telegram.sendMessage(config.channel_id, message, { parse_mode: 'HTML' });
