import type { WsEventArgs } from '@typings/functionArgs';

//* Remove the config from the cache when the backend tells it to.
export default {
  code: 'cache',
  async execute({ client, data }: WsEventArgs) {
    client.cache.take(data.message);
  },
};
