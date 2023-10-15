import { Collection } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { getRoleIds } from '@functions/discord';

const houses = new Collection<string, string>();
houses.set('HypeSquadOnlineHouse1', '<:QBravery:1011633937296138341> Bravery');
houses.set('HypeSquadOnlineHouse2', '<:QBrilliance:1011633938441195572> Brilliance');
houses.set('HypeSquadOnlineHouse3', '<:QBalance:1011633936088182834> Balance');

export default {
  parent: 'info',
  name: 'user',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const member = interaction.options.getMember('user') ?? interaction.member;
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
