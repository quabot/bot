import { AttachmentBuilder, Events, type GuildMember } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { CustomEmbed } from '@constants/customEmbed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { drawWelcomeCard } from '@functions/cards';
import { MemberParser } from '@classes/parsers';

export default {
  event: Events.GuildMemberAdd,
  name: 'welcomeMessage',

  async execute({ client, color }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    const custom = await getServerConfig(client, member.guild.id);
    if (!config) return;
    if (!config.joinEnabled) return;

    const channel = member.guild.channels.cache.get(config.joinChannel);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    color = custom?.color ?? color;

    const parser = new MemberParser({ member, color });

    switch (config.joinType) {
      case 'embed': {
        const embed = new CustomEmbed(config.joinMessage, parser);
        await channel.send({
          embeds: [embed],
          content: parser.parse(config.joinMessage.content),
        });

        break;
      }

      case 'text': {
        if (config.joinMessage.content === '') return;
        await channel.send({ content: parser.parse(config.joinMessage.content) });

        break;
      }

      case 'card': {
        const card = await drawWelcomeCard(member, color, config.joinCard);
        await channel.send({ files: [new AttachmentBuilder(card)] });

        break;
      }
    }
  },
};
