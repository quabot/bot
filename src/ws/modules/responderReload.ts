import type { WsEventArgs } from '@typings/functionArgs';
import Responder from '@schemas/Responder';

//* Reload the autoresponder reponses for the server.
export default {
  code: 'responder-reload',
  async execute({ client, data }: WsEventArgs) {
    client.custom_commands = client.custom_commands.filter(c => c.guildId !== data.guildId);

    const responses = await Responder.find({ guildId: data.guildId });
    responses.forEach(response => {
      client.custom_commands.push(response);
    });
  },
};
