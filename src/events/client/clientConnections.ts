import type { EventArgs } from '@typings/functionArgs';
import { connect, set } from 'mongoose';
import consola from 'consola';
import { AutoPoster } from 'topgg-autoposter';

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

    // Post the stats to top.gg
    if (!process.env.TOPGG_API_KEY) return;

    AutoPoster(process.env.TOPGG_API_KEY ?? '', client).on('posted', stats =>
      consola.info(`Published statistics: ${stats.serverCount} servers.`),
    );
  },
};
