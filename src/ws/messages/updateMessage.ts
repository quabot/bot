import { CustomEmbed } from '@constants/customEmbed';
import type { WsEventArgs } from '@typings/functionArgs';
import Server from '@schemas/Server';
import { ChannelType } from 'discord.js';
import { hasSendPerms } from '@functions/discord';

//* QuaBot Staff Update Message Sender.
export default {
  code: 'update-message',
  async execute({ client, data }: WsEventArgs) {
    //* Get the message and prepare for CE.
    const message = data.message;
    if (!message) return;

    const getParsedString = (s: string) => s;

    //* Send the embed to all servers.
    const sentEmbed = new CustomEmbed(message, getParsedString);

    client.guilds.cache.forEach(async guild => {
      const config = await Server.findOne({ guildId: guild.id });
      if (!config) return;

      const channel = guild.channels.cache.get(config.updatesChannel);
      if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
      if (!hasSendPerms(channel)) return;

      channel.send({ embeds: [sentEmbed] }).catch(() => {});
      console.log(`'Sent the update message to ${guild.name} (${guild.id})`);
    });
  },
};
