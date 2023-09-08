import type { Client } from '@classes/discord';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import { FilterQuery, Model } from 'mongoose';

export async function getFromCollection<T>(
  Schema: Model<T>,
  query: FilterQuery<T>,
  client: Client,
  cacheName: string,
  defaultObj?: T,
) {
  try {
    let res: NonNullMongooseReturn<T> | T | undefined = client.cache.get<T>(cacheName);

    if (res) return res;
    res = ((await Schema.findOne<T>(query)
      .clone()
      .catch(() => {})) ?? (await new Schema(defaultObj).save())) as NonNullMongooseReturn<T>;

    client.cache.set(cacheName, res);

    // return (
    //   client.cache.get<T>(cacheName) ??
    //   (await Schema.findOne(query)
    //     .clone()
    //     .catch(() => {})) ??
    //   (await new Schema(defaultObj).save())
    // );
    return res;
  } catch (err) {
    console.log(err);
  }
}
