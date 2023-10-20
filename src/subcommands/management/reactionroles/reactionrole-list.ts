import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } from 'discord.js';
import { getIdConfig } from '@configs/idConfig';
import { getReactionConfig } from '@configs/reactionConfig';
import { Embed } from '@constants/embed';
import Reaction from '@schemas/ReactionRole';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'reactionroles',
  name: 'list',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    //? I think that 'guildId' is only undefined when it's in DM, and that's never the case
    const guildId = interaction.guildId!;

    const config = await getReactionConfig(client, guildId);
    const ids = await getIdConfig(guildId);
    if (!config || !ids)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Reaction roles are not enabled in this server.')],
      });

    const messageId = interaction.options.getString('message-id');
    const role = interaction.options.getRole('role');
    const channel = interaction.options.getChannel('channel');

    let found = await Reaction.find({
      guildId,
    });

    if (messageId && !role && !channel) found = await Reaction.find({ guildId, messageId });
    if (messageId && role && !channel)
      found = await Reaction.find({
        guildId,
        messageId,
        roleId: role.id,
      });
    if (messageId && !role && channel)
      found = await Reaction.find({
        guildId,
        messageId,
        channelId: channel.id,
      });

    if (role && !messageId && !channel)
      found = await Reaction.find({
        guildId,
        roleId: role.id,
      });
    if (role && messageId && !channel)
      found = await Reaction.find({
        guildId,
        roleId: role.id,
        messageId: messageId,
      });
    if (role && !messageId && channel)
      found = await Reaction.find({
        guildId,
        roleId: role.id,
        channelId: channel.id,
      });

    if (channel && !messageId && !role)
      found = await Reaction.find({
        guildId,
        channelId: channel.id,
      });
    if (channel && messageId && !role)
      found = await Reaction.find({
        guildId,
        channelId: channel.id,
        messageId,
      });
    if (channel && !messageId && role)
      found = await Reaction.find({
        guildId,
        channelId: channel.id,
        roleId: role.id,
      });

    if (role && messageId && channel)
      found = await Reaction.find({
        guildId,
        roleId: role.id,
        messageId,
        channelId: channel.id,
      });

    if (found.length === 0)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find any reaction roles with those criteria.")],
      });

    const backId = 'backRR';
    const forwardId = 'forwardRR';
    const backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Back',
      emoji: '⬅️',
      customId: backId,
    });
    const forwardButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Forward',
      emoji: '➡️',
      customId: forwardId,
    });

    const makeEmbed = async (start: number) => {
      const current = found.slice(start, start + 3);

      return new EmbedBuilder({
        title: `Reaction roles ${start + 1}-${start + current.length}/${found.length}`,
        color: Colors.Green,
        fields: await Promise.all(
          current.map(async item => ({
            name: `Emoji: ${item.emoji} - Mode: ${item.type}`,
            value: `Role: <@&${item.roleId}> - [Jump to message](https://discord.com/channels/${guildId}/${item.channelId}/${item.messageId})`,
          })),
        ),
      });
    };

    const canFit = found.length <= 3;
    const msg = await interaction.editReply({
      embeds: [await makeEmbed(0)],
      components: canFit ? [] : [new ActionRowBuilder<ButtonBuilder>({ components: [forwardButton] })],
    });
    if (canFit) return;

    const collector = msg.createMessageComponentCollector({
      filter: ({ user }) => user.id === user.id,
    });

    let currentIndex = 0;
    collector.on('collect', async a => {
      a.customId === backId ? (currentIndex -= 3) : (currentIndex += 3);
      await a.update({
        embeds: [await makeEmbed(currentIndex)],
        components: [
          new ActionRowBuilder<ButtonBuilder>({
            components: [
              ...(currentIndex ? [backButton] : []),
              ...(currentIndex + 3 < found.length ? [forwardButton] : []),
            ],
          }),
        ],
      });
    });
  },
};
