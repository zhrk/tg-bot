import { Hono } from 'hono';
import { sendMessage } from './bot';
import { serve } from '@hono/node-server';
import config from '../config.json';

const app = new Hono();

app.post('/send', async (c) => {
  try {
    const body = await c.req.json();

    const { message, channel } = body;

    await sendMessage(message, channel);

    return c.body(null);
  } catch {
    return c.body(null, 500);
  }
});

serve({ fetch: app.fetch, hostname: '0.0.0.0', port: config.port }, (info) => {
  console.log(`listening on ${info.address}:${info.port}`);
});
