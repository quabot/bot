import { Snowflake } from 'discord.js';
import Server from '@schemas/Server';
import type { IServer } from '@typings/schemas';
import type { Client } from '@classes/discord';
import type { CallbackError } from 'mongoose';
import type { MongooseReturn } from '@typings/mongoose';
// import { getFromCollection } from '@functions/mongoose';

export async function getServerConfig(client: Client, guildId: Snowflake) {
  // return await getFromCollection<IServer>(Server, { guildId }, client, `${guildId}-server-config`);

  const serverConfig =
    client.cache.get(`${guildId}-server-config`) ??
    (await Server.findOne({ guildId }, (err: CallbackError, server: MongooseReturn<IServer>) => {
      if (err) console.log(err);
      if (!server)
        new Server({
          guildId,
          locale: 'en-us',
          color: '#416683',
          updatesChannel: 'none',
          disabledCommands: [],
        }).save();
    })
      .clone()
      .catch(() => {}));
  client.cache.set(`${guildId}-server-config`, serverConfig);
  return serverConfig;
}
