import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import ms from 'ms';
import { getIdConfig } from '@configs/idConfig';
import { getPollConfig } from '@configs/pollConfig';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';

export default {
  parent: 'poll',
  name: 'create',

  async execute({ client, interaction, color }: CommandArgs) {
    const config = await getPollConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!);
    if (!config || !ids)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Polls are not enabled in this server.')],
      });

    const channel = interaction.options.getChannel('channel');
    let choices = interaction.options.getNumber('choices', true);
    const duration = interaction.options.getString('duration');
    const role = interaction.options.getRole('role-mention') ?? null;

    if (!channel || !choices || !duration)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please enter all the required fields.')],
      });

    if (channel.type !== ChannelType.GuildAnnouncement && channel.type !== ChannelType.GuildText)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please create the poll in either a text or announcement channel.')],
      });

    if (choices < 2) choices = 2;
    if (choices > 5) choices = 5;

    if (!ms(duration))
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please enter a valid duration. Eg. 1h, 5m, 1d etc.')],
      });
    //*                 d    h    m    s    ms
    if (ms(duration) > 24 * 24 * 60 * 60 * 1000)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please enter a value that is below 24 days.')],
      });

    const message = await interaction.reply({
      embeds: [
        new Embed(color)
          .setDescription(
            'Click the blue button below this message to enter the details for the poll. When entered, click the gray button to enter the choices.',
          )
          .addFields(
            { name: 'Channel', value: `${channel}`, inline: true },
            { name: 'Duration', value: `${duration}`, inline: true },
            { name: 'Choices', value: `${choices}`, inline: true },
            { name: 'Role', value: `${role ? role : 'None'}`, inline: true },
          ),
      ],
      ephemeral: true,
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              style: ButtonStyle.Primary,
              label: 'Enter Details',
              customId: 'details-poll',
            }),
            new ButtonBuilder({
              style: ButtonStyle.Secondary,
              label: 'Enter Choices',
              customId: 'choices-poll',
            }),
            new ButtonBuilder({
              style: ButtonStyle.Success,
              label: 'Create Poll',
              customId: 'create-poll',
            }),
            new ButtonBuilder({
              style: ButtonStyle.Danger,
              label: 'Cancel',
              customId: 'cancel-poll',
            }),
          ],
        }),
      ],
      fetchReply: true,
    });

    if (!message)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(`I do not have the required permissions to send messages in ${channel}.`),
        ],
      });

    ids.pollId = (ids.pollId ?? 0) + 1;
    ids.save();

    client.cache.set(`polldata-${message.id}`, {
      channel: channel.id,
      role: role?.toString() ?? null,
      duration,
      choices,
    });
  },
};
