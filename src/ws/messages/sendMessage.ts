import { CustomEmbed } from '@constants/customEmbed';
import { hasSendPerms } from '@functions/discord';
import type { WsEventArgs } from '@typings/functionArgs';

//* QuaBot Dashboard Message Sender Handler.
export default {
  code: 'send-message',
  async execute({ client, data }: WsEventArgs) {
    //* Get the guild and channel.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    const embed = data.embed;
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    //* Send the message.
    const getParsedString = (s: string) => {
      return `${s}`.replaceAll('{guild}', guild.name).replaceAll('{members}', guild.memberCount.toString());
    };

    const sentEmbed = new CustomEmbed(data.message, getParsedString);
    if (embed)
      await channel.send({
        embeds: [sentEmbed],
        content: getParsedString(data.message.content) ?? '',
      });
    if (!embed && (getParsedString(data.message.content) ?? '** **') !== '')
      await channel.send({
        content: getParsedString(data.message.content) ?? '** **',
      });
  },
};
