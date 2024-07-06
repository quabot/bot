import { EmbedBuilder, Guild } from 'discord.js';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'guildAdd',
  name: 'guildAddUsageLogs',
  async execute({ client }: EventArgs, addedGuild: Guild) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return;
    const channel = guild?.channels.cache.get('1195016205212323871');
    if (!channel?.isTextBased()) return;

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setDescription(`Added to **${addedGuild.name}** *(${addedGuild.id})*`)
          .setColor('Green'),
      ],
    });
  },
};
