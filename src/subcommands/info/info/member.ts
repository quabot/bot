import { GuildMember } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { getRoleIds } from '@functions/discord';

export default {
  parent: 'info',
  name: 'member',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const rawMember = interaction.options.getMember('user') ?? interaction.member!;

    if ('nick' in rawMember)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Sorry, Discord didn't give the member to us in the right way. Please try again.`,
          ),
        ],
      });

    const member = rawMember as GuildMember;
    const { user } = member;

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('Server Member Info').setThumbnail(user.displayAvatarURL()).setDescription(`
                - **User**: ${user}\n- **Nickname**: ${member.nickname ?? 'None'}\n- **Roles**: ${
                  getRoleIds(member)
                    .filter(r => r !== interaction.guildId)
                    .map(r => `<@&${r}>`)
                    .join(' ') ?? 'None'
                }\n- **Joined Server**: <t:${Math.floor(
                  (member.joinedTimestamp ?? 0) / 1000,
                )}:R>\n- **Boosting Since**: ${
                  member.premiumSinceTimestamp
                    ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
                    : 'Not boosting'
                }\n- **Deafened**: ${member.voice.deaf ? 'Yes' : 'No'}\n- **Muted**: ${
                  member.voice.mute ? 'Yes' : 'No'}\n- **Voice Channel**: ${
                  member.voice.channel ? member.voice.channel : 'Not in a voice channel'}
                `),
      ],
    });
  },
};
