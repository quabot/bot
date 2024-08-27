import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, Events, type GuildMember } from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import { getServerConfig } from '@configs/serverConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { drawWelcomeCard } from '@functions/cards';
import { MemberParser } from '@classes/parsers';

export default {
  event: Events.GuildMemberAdd,
  name: 'welcomeDM',

  async execute({ client, color }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    const custom = await getServerConfig(client, member.guild.id);
    if (!config) return;
    if (!config.joinDM) return;

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + member.guild.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    color = custom?.color ?? color;

    const parser = new MemberParser({ member, color });

    switch (config.joinDMType) {
      case 'embed': {
        const embed = new CustomEmbed(config.dm, parser);
        await member.send({
          embeds: [embed],
          content: parser.parse(config.dm.content),
          components: [sentFrom],
        }).catch(() => null);

        break;
      }

      case 'text': {
        if (config.dm.content === '') return;
        await member.send({ content: parser.parse(config.dm.content), components: [sentFrom] }).catch(() => null);

        break;
      }

      case 'card': {
        const card = await drawWelcomeCard(member, color, config.dmCard);
        await member.send({ files: [new AttachmentBuilder(card)], components: [sentFrom] }).catch(() => null);

        break;
      }
    }
  },
};
