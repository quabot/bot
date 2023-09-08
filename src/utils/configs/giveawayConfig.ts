import { Snowflake } from 'discord.js';
import GiveawayConfig from '@schemas/GiveawayConfig';
// import { CallbackError } from 'mongoose';
// import { IGiveawayConfig, MongooseReturn } from '@typings/mongoose';
import type { Client } from '@classes/discord';
import { getFromCollection } from '@functions/mongoose';
import { IGiveawayConfig } from '@typings/mongoose';

export async function getGiveawayConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IGiveawayConfig>(GiveawayConfig, { guildId }, client, `${guildId}-giveaway-config`);

  // const giveawayConfig =
  //   client.cache.get(`${guildId}-giveaway-config`) ??
  //   (await GiveawayConfig.findOne({ guildId }, (err: CallbackError, suggest: MongooseReturn<IGiveawayConfig>) => {
  //     if (err) console.log(err);
  //     if (!suggest)
  //       new GiveawayConfig({
  //         guildId,
  //         enabled: true,
  //         pingEveryone: false,
  //       }).save();
  //   })
  //     .clone()
  //     .catch(() => {}));
  // client.cache.set(`${guildId}-giveaway-config`, giveawayConfig);
  // return giveawayConfig;
}
