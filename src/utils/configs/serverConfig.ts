import { Client, Snowflake } from 'discord.js';
import Server from '@schemas/Server';
import { CallbackError } from 'mongoose';
import { IServer, MongooseReturn } from '@typings/mongoose';

export async function getServerConfig(client: Client, guildId: Snowflake) {
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
