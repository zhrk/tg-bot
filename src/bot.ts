import { Bot } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import config from '../config.json';

const agent = new HttpsProxyAgent(config.proxy);

const bot = new Bot(config.token, { client: { baseFetchConfig: { agent } } });

export const sendMessage = (message: string, channel: 'first' | 'second') =>
  bot.api.sendMessage(config.channels[channel], message, { parse_mode: 'HTML' });
