import consola from 'consola';
import type { WsEventArgs } from '@typings/functionArgs';

//* Handle info events from the backend.
export default {
  code: 'info',
  async execute({ data }: WsEventArgs) {
    console.log('');
    consola.info('Websocket: ' + data.message);
  },
};
