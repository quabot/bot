import { Collection, GuildMember } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { getRoleIds } from '@functions/discord';

const houses = new Collection<string, string>();
houses.set('HypeSquadOnlineHouse1', '<:bravery:1142386790897041460> Bravery');
houses.set('HypeSquadOnlineHouse2', '<:brilliance:1142386793816264714> Brilliance');
houses.set('HypeSquadOnlineHouse3', '<:balance:1142386789529686090> Balance');

export default {
  parent: 'info',
  name: 'user',

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

    const badges: string[] = [];
    user.flags?.toArray().forEach(flag => {
      badges.push(houses.get(flag) ?? '');
    });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('User Info').setThumbnail(user.displayAvatarURL()).setDescription(`
                - **User**: ${user}\n- **Displayname**: ${user.globalName ?? 'None'}\n- **Username**: @${
                  user.username
                }\n- **Nickname**: ${member.nickname ?? 'None'}\n- **ID**: ${user.id}\n- **Roles**: ${
                  getRoleIds(member)
                    .filter(r => r !== interaction.guildId)
                    .map(r => `<@&${r}>`)
                    .join(' ') ?? 'None'
                }\n- **Joined Server**: <t:${Math.floor(
                  (member.joinedTimestamp ?? 0) / 1000,
                )}:R>\n- **Joined Discord**: <t:${Math.floor(
                  user.createdTimestamp / 1000,
                )}:R>\n- **House**: ${badges.join(' ')} ${badges.length === 0 ? 'None' : ''}
                `),
      ],
    });
  },
};
