import type { Client } from '@classes/discord';
import { MongooseReturn, NonNullMongooseReturn } from '@typings/mongoose';
import { FilterQuery, Model } from 'mongoose';

export async function getFromCollection<T>({
  Schema,
  query,
  client,
  cacheName,
  defaultObj,
}: GetFromCollectionArgs<T>): Promise<MongooseReturn<T> | void> {
  try {
    let res: MongooseReturn<T> | undefined = client?.cache.get<NonNullMongooseReturn<T>>(cacheName);

    if (res !== undefined) return res;
    res = await find();

    if (res === null && defaultObj !== undefined) {
      if (client?.cache.has(`creating_${cacheName}`)) return;
      client?.cache.set(`creating_${cacheName}`, true);

      await new Schema(defaultObj).save();

      client?.cache.del(`creating_${cacheName}`);
      res = await find();
    }

    if (res !== null) client?.cache.set(cacheName, res);

    return res;
  } catch (err) {
    console.log(err);
  }

  async function find() {
    return (await Schema.findOne<T>(query).catch(() => {})) as MongooseReturn<T>;
  }
}

export type GetFromCollectionArgs<T> = {
  Schema: Model<T>;
  query: FilterQuery<T>;
  defaultObj?: T;
} & ({ client: Client; cacheName: string } | { client?: undefined; cacheName?: undefined });