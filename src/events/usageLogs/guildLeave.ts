import { EmbedBuilder, Guild } from 'discord.js';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'guildDelete',
  name: 'guildRemoveUsageLogs',
  async execute({ client }: EventArgs, leftGuild: Guild) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return;
    const channel = guild?.channels.cache.get('1195016205212323871');
    if (!channel?.isTextBased()) return;
    if (!leftGuild.name) return;

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setDescription(`Left **${leftGuild.name}** *(${leftGuild.id})*`)
          .setColor('Red'),
      ],
    });
  },
};
