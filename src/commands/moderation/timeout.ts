import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
  APIEmbedField,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import { randomUUID } from 'crypto';
import { CustomEmbed } from '@constants/customEmbed';
import ms from 'ms';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { TimedModerationParser } from '@classes/parsers';
import { checkModerationRules } from '@functions/moderation-rules';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user.')
    .addUserOption(option => option.setName('user').setDescription('The user you wish to timeout.').setRequired(true))
    .addStringOption(option =>
      option.setName('duration').setDescription('How long should the user be timed out.').setRequired(true),
    )
    .addStringOption(option => option.setName('reason').setDescription('The reason for timing out the user.'))
    .addBooleanOption(option => option.setName('private').setDescription('Should the message be visible to you only?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    console.log(interaction)
    const ephemeral = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
    const duration = interaction.options.getString('duration', true).slice(0, 800);
    const user = interaction.options.getUser('user', true);
    const member = (interaction.guild ?? (await client.guilds.fetch(interaction.guildId!))).members.cache.get(user.id)!;
    if (!user) return await interaction.editReply({ embeds: [new Embed(color).setDescription('User not found.')] });
    if (!member) return await interaction.editReply({ embeds: [new Embed(color).setDescription('User not found.')] });

    await getUser(interaction.guildId!, member.id);

    if (!ms(duration))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'Please enter a valid duration. This could be "1d" for 1 day, "1w" for 1 week or "1hour" for 1 hour.',
          ),
        ],
      });

    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot timeout yourself.')],
      });

    if (!((interaction.member?.roles as any) instanceof GuildMemberRoleManager)) return;

    if (member.roles.highest.rawPosition > (interaction.member!.roles as GuildMemberRoleManager).highest.rawPosition)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot timeout a user with roles higher than your own.')],
      });

    const userDatabase = await getUser(interaction.guildId!, member.id);
    if (!userDatabase)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    let timeout = true;
    await member.timeout(ms(duration), reason).catch(async () => {
      timeout = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to timeout the user.')],
      });
    });

    if (!timeout) return;

    userDatabase.timeouts += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId: member.id,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: 'timeout',
      id,
      reason,
      duration,
      active: false,
    });
    await NewPunishment.save();

    const fields: APIEmbedField[] = [
      {
        name: 'Account Created',
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    ];

    if (member.joinedTimestamp !== null) {
      fields.splice(0, 0, {
        name: 'Joined Server',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      });
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Timed Out')
          .setDescription(`**User:** ${member} (@${user.username})\n**Reason:** ${reason}`)
          .addFields(fields).setFooter({ text: `ID: ${id}` })
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel(`Sent from server: ${interaction.guild?.name ?? 'Unknown'}`.substring(0, 80))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.timeoutDM && member) {
      const parser = new TimedModerationParser({ member, reason, interaction, color, id, duration });

      await member
        .send({
          embeds: [new CustomEmbed(config.timeoutDMMessage, parser)],
          components: [sentFrom],
          content: parser.parse(config.timeoutDMMessage.content),
        })
        .catch(() => {});
    }

    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel?.isTextBased()) return;
      if (!hasSendPerms(channel)) {
        return await interaction.followUp({
          embeds: [
            new Embed(color).setTitle(
              "Didn't send the log message, because I don't have the `SendMessage` permission.",
            ),
          ],
          ephemeral: true,
        });
      }

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
        {
          name: 'Timed Out By',
          value: `${interaction.user}`,
          inline: true,
        },
        {
          name: 'Timed Out In',
          value: `${interaction.channel}`,
          inline: true,
        },
        {
          name: 'User Total Timeouts',
          value: `${userDatabase.timeouts}`,
          inline: true,
        },
        {
          name: 'Account Created',
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: 'Reason', value: `${reason}` },
      ];

      if (member.joinedTimestamp !== null) {
        fields.splice(4, 0, {
          name: 'Joined Server',
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        });
      }

      await channel.send({
        embeds: [new Embed(color).setTitle('Member Timed Out').addFields(fields).setFooter({ text: `ID: ${id}` })],
      });
    }

    const appealChannel = interaction.guild?.channels.cache.get(config.appealChannelId);
    if (appealChannel && config.appealEnabled && config.appealTypes.includes('timeout')) {
      const appealButton = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder().setCustomId('punishment-appeal').setLabel('Click to appeal').setStyle(ButtonStyle.Primary),
      );

      await member
        .send({
          embeds: [
            new Embed(color)
              .setDescription(
                'Appeal your punishment by clicking on the button below. A staff member will review your appeal.',
              )
              .setFooter({ text: `${id}` }),
          ],
          components: [appealButton],
        })
        .catch(() => {});
    }

    await checkModerationRules(client, interaction.guildId!, member.id, 'timeout');
  },
};
