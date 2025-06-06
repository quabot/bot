import type { EventArgs } from '@typings/functionArgs';
import { connect, set } from 'mongoose';
import consola from 'consola';
import { AutoPoster } from 'topgg-autoposter';
import axios from 'axios';
import { API_URL } from '@constants/discord';

export default {
  event: 'ready',
  name: 'clientConnections',
  once: true,

  async execute({ client }: EventArgs) {
    set('strictQuery', true);

    // Connect MongoDB
    connect(process.env.DATABASE_URI!)
      .then(db => {
        consola.info(`Connected to database '${db.connections[0].name}'.`);
      })
      .catch(err => {
        consola.error(`Failed to connect to the database: ${err}`);
      });

    if (process.env.NODE_ENV !== 'production') return;

    // Post the stats to the QuaBot Site every minute
    if (process.env.POST_STATS === 'true') {
      postStats();
      setInterval(postStats, 120 * 1000);

      function postStats() {
        axios
          .post(
            `${API_URL}/site/set-stats`,
            {
              servers: client.guilds.cache.size,
              channels: client.channels.cache.size,
              users: client.users.cache.size,
            },
            {
              headers: {
                Authorization: process.env.STATS_KEY!,
              },
            },
          )
          .catch(() => {});
      }
    }

    // Post the stats to top.gg
    if (!process.env.TOPGG_API_KEY) return;

    AutoPoster(process.env.TOPGG_API_KEY ?? '', client, {
      interval: 60 * 60 * 1000,
    });
  },
};
