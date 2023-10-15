import rps from '../../../commands/fun/rps';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'rps-replay',

  async execute({ client, interaction, color }: ButtonArgs) {
    await rps.execute({ client, interaction, color }).catch(e => console.log(e.message));
  },
};
