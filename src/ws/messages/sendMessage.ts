import { CustomEmbed } from '@constants/customEmbed';
import { hasSendPerms } from '@functions/discord';
import type { WsEventArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';

//* QuaBot Dashboard Message Sender Handler.
export default {
  code: 'message-guild',
  async execute({ client, data }: WsEventArgs) {
    //* Get the guild and channel.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    const embed = data.embed;
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
    if (!hasSendPerms(channel)) return;

    //@ts-ignore
    const testMessage = (msg: any): msg is CustomEmbed => { return true; }
    if (!testMessage(embed)) return;

    //* Send the message.
    const getParsedString = (s: string) => {
      return `${s}`.replaceAll('{server.name}', guild.name)
        .replaceAll('{server.id}', guild.id)
        .replaceAll('{server.members}', guild.memberCount.toString())
        .replaceAll('{server.owner}', `${guild.ownerId}`)
        .replaceAll("{server.channels}", guild.channels.cache.size.toString())
        .replaceAll('{server.owner}', guild.ownerId)
        .replaceAll('{server.icon}', guild.icon ?? '').replaceAll('{server.iconUrl}', guild.iconURL() ?? '');
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
