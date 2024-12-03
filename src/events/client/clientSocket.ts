import type { EventArgs } from '@typings/functionArgs';
import { WebSocketServer } from 'ws';
import consola from 'consola';

export default {
  event: 'ready',
  name: 'clientSocket',
  once: true,

  async execute({ client }: EventArgs) {
    //* If the year is 2025, stop.
    if (new Date().getFullYear() === 2025) return;
    
    const wss = new WebSocketServer({ port: parseInt(process.env.WEBSOCKET_PORT!) });
    consola.info(`Listening on port :${process.env.WEBSOCKET_PORT}`);

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', async function message(d) {
        //todo gotta debug to see real type
        //@ts-ignore
        const data = JSON.parse(d);
        if (data.status !== 200) return;

        const WebSocket = client.ws_events.get(data.type);
        if (!WebSocket) return consola.warn('Unhandled WebSocket event: ' + data.type + '.');

        WebSocket.execute({ client, data }).catch(e => {
          consola.error('WebSocket error:' + e);
          console.log(e);
        });
      });

      client.on('guildCreate', async guild => {
        ws.send(JSON.stringify({ status: 200, type: 'guildCreate', guild: guild.id }));
      });
      client.on('guildDelete', async guild => {
        ws.send(JSON.stringify({ status: 200, type: 'guildDelete', guild: guild.id }));
      });

      if (process.env.NODE_ENV !== 'production') return;

      // Post the stats to the QuaBot Site every minute
      if (process.env.POST_STATS === 'true') {
        postStats()
        setInterval(postStats, 30 * 1000);

        function postStats() {
          ws.send(JSON.stringify({
            status: 200, type: 'siteStats', stats: {
              servers: client.guilds.cache.size,
              channels: client.channels.cache.size,
              users: client.users.cache.size,
            }
          }))
        }
      }
    });
  },
};
