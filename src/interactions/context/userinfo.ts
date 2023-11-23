import { ApplicationCommandType, ContextMenuCommandBuilder, Collection } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ContextArgs } from '@typings/functionArgs';
import { getRoleIds } from '@functions/discord';

const houses = new Collection<string, string>();
houses.set('HypeSquadOnlineHouse1', '<:bravery:1142386790897041460> Bravery');
houses.set('HypeSquadOnlineHouse2', '<:brilliance:1142386793816264714> Brilliance');
houses.set('HypeSquadOnlineHouse3', '<:balance:1142386789529686090> Balance');

export default {
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
          .map(id => `<@&${id}>`)
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
