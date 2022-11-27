import type { Client } from 'discord.js';
import { cache } from '../../main';
import Server from '../../structures/schemas/ServerSchema';

export const getServerConfig = async (_client: Client, guildId: string) => {
    const serverConfig =
        cache.get(`${guildId}-server-config`) ??
        (await Server.findOne(
            {
                guildId,
            },
            (err: any, server: any) => {
                if (err) console.log(err);
                if (!server)
                    new Server({
                        guildId,
                        locale: 'en-us',
                        color: '#3a5a74',
                        updatesChannel: 'none',
                    }).save();
            }
        )
            .clone()
            .catch(() => {}));

    cache.set(`${guildId}-server-config`, serverConfig);
    return serverConfig;
};
