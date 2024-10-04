import type { EventArgs } from '@typings/functionArgs';
import { connect, set } from 'mongoose';
import consola from 'consola';
import { AutoPoster } from 'topgg-autoposter';
import { Events } from 'discord.js';

export default {
  event: Events.ClientReady,
  once: true,
  async execute({ client }: EventArgs) {
    set('strictQuery', true);

    //* Connect to MongoDB
    connect(process.env.DATABASE_URI!)
      .then(db => {
        consola.log(`  Connected to database '${db.connections[0].name}'.`);
      })
      .catch(err => {
        consola.error(`  Failed to connect to the database: ${err}`);
      });

    if (process.env.NODE_ENV !== 'production') return;

    //? Post the stats to top.gg
    if (!process.env.TOPGG_API_KEY) return;

    AutoPoster(process.env.TOPGG_API_KEY ?? '', client, {
      interval: 60 * 60 * 1000,
    });
  },
};
