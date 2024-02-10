import { getTicketConfig } from '@configs/ticketConfig';
import Ticket from '@schemas/Ticket';
import { Embed } from '@constants/embed';
import { getIdConfig } from '@configs/idConfig';
import type { CommandArgs } from '@typings/functionArgs';
import { checkUserPerms } from '@functions/ticket';
import {
  ChannelType,
  type GuildTextBasedChannel,
  type PrivateThreadChannel,
  type PublicThreadChannel,
} from 'discord.js';
import { hasSendPerms } from '@functions/discord';
import { CustomEmbed } from '@constants/customEmbed';
import { TicketParser } from '@classes/parsers';

export default {
  parent: 'ticket',
  name: 'add',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });
    const user = interaction.options.getUser('user');

    const config = await getTicketConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!);

    if (!config || !ids)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Tickets are disabled in this server.')],
      });

    const ticket = await Ticket.findOne({
      channelId: interaction.channelId,
    });
    if (!ticket)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This is not a valid ticket.')],
      });

    if (!user) return;

    const valid = checkUserPerms(ticket, interaction.user, interaction.member);
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to add users to the ticket.')],
      });

    const array = ticket.users!;
    array.push(user.id);

    await ticket.updateOne({
      users: array,
    });

    const interChannel = interaction.channel as GuildTextBasedChannel | null;

    if (interChannel?.type === ChannelType.PrivateThread || interChannel?.type === ChannelType.PublicThread)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This command can't be used in threads.")],
      });

    const channel = interChannel as Exclude<GuildTextBasedChannel, PrivateThreadChannel | PublicThreadChannel>;

    await channel?.permissionOverwrites.edit(user, {
      ViewChannel: true,
      SendMessages: true,
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Added ${user} to the ticket.`)],
    });

    const {
      dmMessages: { add },
    } = config;
    if (add.enabled) {
      const parser = new TicketParser({
        member: interaction.guild!.members.cache.get(user!.id)!,
        color,
        channel,
        ticket,
      });
      const owner = client.users.cache.get(ticket.owner);

      await owner
        ?.send(
          add.type === 'embed'
            ? { embeds: [new CustomEmbed(add.message, parser)] }
            : { content: parser.parse(add.message.content) },
        )
        .catch(() => null);
    }

    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!config.logEnabled || !logChannel?.isTextBased() || !config.logActions.includes('add')) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log, I don't have the `SendMessages` permission.")],
        ephemeral: true,
      });

    await logChannel.send({
      embeds: [
        new Embed(color)
          .setTitle('User Added To Ticket')
          .addFields(
            {
              name: 'Ticket Owner',
              value: `<@${ticket.owner}>`,
              inline: true,
            },
            {
              name: 'Channel',
              value: `${interaction.channel}`,
              inline: true,
            },
            {
              name: 'User Added',
              value: `${user}`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${ticket.id}` }),
      ],
    });
  },
};
