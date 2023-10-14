//? Remove after next succesful build
//@ts-nocheck
import { execute } from '@commands/fun/rps';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'rps-replay',

  async execute({ client, interaction, color }: ButtonArgs) {
    await execute(client, interaction, color).catch(e => console.log(e.message));
  },
};
