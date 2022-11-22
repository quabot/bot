import { Client } from "discord.js";
import { cache } from "../../main";

const Server = require('../../structures/schemas/ServerSchema');

export const getServerConfig = async (client: Client, guildId: string) => {
    let serverConfig;
    const cacheConfig = cache.get(`${guildId}-server-config`);

    if (cacheConfig) serverConfig = cacheConfig;
    if (!serverConfig) await Server.findOne({
        guildId,
    }, (err: any, server: any) => {
        if (err) console.log(err);
        if (!server) new Server({
            guildId,
            locale: 'en-us',
            color: '#3a5a74',
            updatesChannel: 'none'
        }).save();
    }).catch(() => { });

    cache.set(`${guildId}-server-config`, serverConfig);
    return serverConfig;
}