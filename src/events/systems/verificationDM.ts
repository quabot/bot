import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, type GuildMember } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { CustomEmbed } from '@constants/customEmbed';
import type { EventArgs } from '@typings/functionArgs';
import { MemberParser } from '@classes/parsers';
import { getVerificationConfig } from '@configs/verificationConfig';

export default {
  event: Events.GuildMemberAdd,
  name: 'verificationDM',

  async execute({ client, color }: EventArgs, member: GuildMember) {
    const config = await getVerificationConfig(member.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.dm) return;

    const custom = await getServerConfig(client, member.guild.id);
    color = custom?.color ?? color;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('verification').setLabel('✅ Verify').setStyle(ButtonStyle.Secondary),
    );
    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + member.guild.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    await member.send({
      embeds: [
        new CustomEmbed(config.dmMessage, new MemberParser({ member, color })).setFooter({ text: `${config.guildId}` }),
      ],
      components: [row, sentFrom],
    }).catch(() => null);
  },
};
