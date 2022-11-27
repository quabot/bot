import { Client } from 'discord.js';
import { connect } from 'mongoose';
import consola from 'consola';
import { AutoPoster } from 'topgg-autoposter';

module.exports = {
    event: 'ready',
    once: true,
    async execute(client: Client) {
        connect(process.env.DATABASE_URI || '')
            .then(db => {
                consola.info(`Connected to database ${db.connections[0].name}.`);
            })
            .catch(err => {
                consola.error(`Failed to connect to the database: ${err}`);
            });

        if (process.env.NODE_ENV !== 'production') return;
        AutoPoster(process.env.TOPGG_API_KEY || '', client).on('posted', stats =>
            consola.info(`Published statistics: ${stats.serverCount} servers.`)
        );
    },
};
