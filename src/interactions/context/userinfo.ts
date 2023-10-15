import { ApplicationCommandType, ContextMenuCommandBuilder, Collection } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ContextArgs } from '@typings/functionArgs';
import { getRoleIds } from '@functions/discord';

const houses = new Collection<string, string>();
houses.set('HypeSquadOnlineHouse1', '<:QBravery:1011633937296138341> Bravery');
houses.set('HypeSquadOnlineHouse2', '<:QBrilliance:1011633938441195572> Brilliance');
houses.set('HypeSquadOnlineHouse3', '<:QBalance:1011633936088182834> Balance');

module.exports = {
  data: new ContextMenuCommandBuilder().setName('Userinfo').setType(ApplicationCommandType.User).setDMPermission(false),

  async execute({ interaction, color }: ContextArgs) {
    await interaction.deferReply();

    const member = interaction.targetMember;
    const user = interaction.targetUser;

    const badges: string[] = [];
    user.flags?.toArray().forEach(flag => {
      badges.push(houses.get(flag)!);
    });

    const description = [
      `**• User**: ${user}`,
      `**• Displayname**: ${user.globalName ?? 'Unknown'}`,
      `**• Username**: @${user.username}`,
      `**• ID**: ${user.id}`,
      `**• Roles**: ${
        getRoleIds(member)
          .filter(r => r !== interaction.guildId)
          .join(' ') ?? 'None'
      }`,
      `**• Joined Discord**: <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
      `**• House**: ${badges.join(' ')}`,
    ];

    if (member && 'joinedTimestamp' in member) {
      description.splice(5, 0, `**• Joined Server**: <t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:R>`);
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Info')
          .setThumbnail(user.displayAvatarURL())
          .setDescription(description.join('\n')),
      ],
    });
  },
};
