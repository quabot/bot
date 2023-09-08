import type { Client } from '@classes/discord';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import { FilterQuery, Model } from 'mongoose';

export async function getFromCollection<T>({
  Schema,
  query,
  defaultObj,
  client,
  cacheName,
}: GetFromCollectionParams<T>) {
  try {
    let res: NonNullMongooseReturn<T> | T | undefined;
    if (cacheName) res = client.cache.get<T>(cacheName);

    if (res) return res;
    res =
      (await Schema.findOne(query)
        .clone()
        .catch(() => {})) ?? (await new Schema(defaultObj).save());

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

export type GetFromCollectionParams<T> = {
  Schema: Model<T>;
  query: FilterQuery<T>;
  defaultObj?: T;
} & ({ client: Client; cacheName: string } | { client?: undefined; cacheName?: undefined });
