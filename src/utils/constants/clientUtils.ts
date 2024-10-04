import { Client } from '@classes/discord';

export const getGuildCount = async (client: Client) => {
  if (!client.shard) return client.guilds.cache.size;
  
	//* Fetch the number of guilds from every shard
  const req = await client.shard.fetchClientValues('guilds.cache.size').catch(() => {
		return [0];
	}) as number[];

  //* Return the total number of guilds
  return req.reduce((p: number, n: number) => p + n, 0);
};

export const getUserCount = async (client: Client) => {
	if (!client.shard) return client.users.cache.size;

	//* Fetch the number of users from every shard
	const req = await client.shard.fetchClientValues('users.cache.size').catch(() => {
		return [0];
	}) as number[];

	//* Return the total number of users
	return req.reduce((p: number, n: number) => p + n, 0);
}