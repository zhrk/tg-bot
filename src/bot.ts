import { Bot } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config.json';

const agent = new HttpsProxyAgent(config.proxy);

const bot = new Bot(config.token, { client: { baseFetchConfig: { agent } } });

export const sendMessage = (message: string) =>
  bot.api.sendMessage(config.channel_id, message, { parse_mode: 'HTML' });
