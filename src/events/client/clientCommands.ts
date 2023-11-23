import type { EventArgs } from '@typings/functionArgs';
import Responder from '@schemas/Responder';

//* Activate custom commands.
//* This is a one-time event, so it's set to once: true.
export default {
  event: 'ready',
  name: 'clientCommands',
  once: true,

  async execute({ client }: EventArgs) {
    //* This is used to properly listen to custom commands/responses.
    client.custom_commands.push(...(await Responder.find()));
  },
};
