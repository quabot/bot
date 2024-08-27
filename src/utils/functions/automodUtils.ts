import { Client } from '@classes/discord';
import { getModerationConfig } from '@configs/moderationConfig';
import { getServerConfig } from '@configs/serverConfig';
import { getUser } from '@configs/user';
import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, GuildMember, GuildMemberRoleManager } from 'discord.js';
import ms from 'ms';
import { randomUUID } from 'crypto';
import Punishment from '@schemas/Punishment';
import { Embed } from '@constants/embed';
import { hasSendPerms } from './discord';
import { ModerationParser, TimedModerationParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';
import { checkModerationRules } from './moderation-rules';
import { tempUnban } from './unban';

export const actionAutomod = async (client: Client, member: GuildMember, action: string, duration: string, reason: string) => {
  const guild = client.guilds.cache.get(member.guild.id);
  if (!guild) return;
  const user = member.user;
  if (!member) return;
  if (!user) return;

  const config = await getModerationConfig(client, member.guild.id);
  if (!config) return;

  await getUser(member.guild.id, member.id);

  if (!((member?.roles as any) instanceof GuildMemberRoleManager)) return;

  const serverConfig = await getServerConfig(client, member.guild.id);
  if (!serverConfig) return;
  const color = serverConfig.color ?? '#416683';

  const userDatabase = await getUser(member.guild.id!, member.id);
  if (!userDatabase) return;

  if (action === 'timeout') {
		if (!ms(duration)) return;
    let timeout = true;
    await member.timeout(ms(duration), reason).catch(async () => {
      timeout = false;
    });

    if (!timeout) return;

    userDatabase.timeouts += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: member.guild.id,
      userId: member.id,

      channelId: 'none',
      moderatorId: '995243562134409296',
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

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.timeoutDM && member) {
      await member
        .send({
          embeds: [
            new Embed(color)
              .setTitle('You were timed out!')
              .setDescription(
                `**Reason:** ${reason}\n**Duration:** ${duration}\n-# This action was performed automatically, your recent message was flagged by our automated moderation system.`,
              )
              .setFooter({ text: `ID: ${id}` }),
          ],
          components: [sentFrom],
        })
        .catch(() => {});
    }

    if (config.channel) {
      const channel = guild?.channels.cache.get(config.channelId);
      if (!channel?.isTextBased()) return;
      if (!hasSendPerms(channel)) return;

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
        {
          name: 'Timed Out By',
          value: `Automated`,
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

    const appealChannel = guild?.channels.cache.get(config.appealChannelId);
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
  } else if (action === 'kick') {
    //* Kick the user and return if it fails.
    let kick = true;
    await member.kick(reason).catch(async () => {
      kick = false;
    });

    if (!kick) return;

    //* Update the database.
    userDatabase.kicks += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: member.guild.id,
      userId: member.id,

      channelId: 'none',
      moderatorId: '995243562134409296',
      time: new Date().getTime(),

      type: 'kick',
      id,
      reason,
      duration: 'none',
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

    //* Send the DM to the user.
    const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel(`Sent from server: ${guild?.name ?? 'Unknown'}`.substring(0, 80))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.kickDM && member) {
      const parser = new ModerationParser({ member, reason, interaction: { user: client.user }, color, id });

      await member
        .send({
          embeds: [new CustomEmbed(config.kickDMMessage, parser)],
          components: [sentFrom],
          content: parser.parse(config.kickDMMessage.content),
        })
        .catch(() => {});
    }

    //* Send the log to the log channel.
    if (config.channel) {
      const channel = guild?.channels.cache.get(config.channelId);
      if (!channel?.isTextBased()) return;
      if (!hasSendPerms(channel)) return;

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
        { name: 'Kicked By', value: `Automated`, inline: true },
        {
          name: 'User Total Kicks',
          value: `${userDatabase.kicks}`,
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
        embeds: [new Embed(color).setTitle('Member Kicked').setFields(fields)],
      });
    }

    await checkModerationRules(client, member.guild.id!, member.id, 'kick');
  } else if (action === 'warn') {
    userDatabase.warns += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: member.guild.id,
      userId: member.id,

      channelId: 'none',
      moderatorId: '995243562134409296',
      time: new Date().getTime(),

      type: 'warn',
      id,
      reason,
      duration: 'none',
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

    if (config.warnDM && member) {
      const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('sentFrom')
          .setLabel('Sent from server: ' + guild?.name ?? 'Unknown')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );

      const parser = new ModerationParser({ member, reason, interaction: { user: client.user }, color, id });

      await user
        .send({
          embeds: [new CustomEmbed(config.warnDMMessage, parser)],
          components: [sentFrom],
          content: parser.parse(config.warnDMMessage.content),
        })
        .catch(() => {});
    }

    if (config.channel) {
      const channel = guild?.channels.cache.get(config.channelId);
      if (!channel?.isTextBased()) return;
      if (!hasSendPerms(channel)) return;

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
        { name: 'Warned By', value: `Automated`, inline: true },
        {
          name: 'User Total Warns',
          value: `${userDatabase.warns}`,
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
        embeds: [new Embed(color).setTitle('Member Warned').addFields(fields).setFooter({ text: `ID: ${id}` })],
      });
    }

    await checkModerationRules(client, member.guild.id!, member.id, 'warn');
  } else if (action === 'ban') {
    if (duration === 'permanent') {
      //* Try to ban the user and return if it fails.
      let ban = true;
      await guild?.members.ban(user ?? member.id, { reason }).catch(() => {
        ban = false;
      });

      if (!ban) return;

      //* Update the databases
      userDatabase.bans += 1;
      await userDatabase.save();

      const id = randomUUID();

      const NewPunishment = new Punishment({
        guildId: member.guild.id,
        userId: member.id,
        channelId: 'none',
        moderatorId: '995243562134409296',
        time: new Date().getTime(),
        type: 'ban',
        id,
        reason,
        duration: 'none',
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

      if (member?.joinedTimestamp != null) {
        fields.splice(0, 0, {
          name: 'Joined Server',
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        });
      }

      //* Send the ban message to the user.
      const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('sentFrom')
          .setLabel(`Sent from server: ${guild?.name ?? 'Unknown'}`.substring(0, 80))
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );

      if (config.banDM && member) {
        const parser = new ModerationParser({ member, reason, interaction: { user: client.user }, color, id });

        await member
          ?.send({
            embeds: [new CustomEmbed(config.banDMMessage, parser)],
            content: parser.parse(config.banDMMessage.content),
            components: [sentFrom],
          })
          .catch(() => {});
      }

      //* Send the log message.
      if (config.channel) {
        const channel = guild?.channels.cache.get(config.channelId);
        if (!channel?.isTextBased()) return;
        if (!hasSendPerms(channel)) return;

        const fields = [
          {
            name: 'User',
            value: `${member} (@${user.username})`,
            inline: true,
          },
          { name: 'Banned By', value: `Automated`, inline: true },
          {
            name: 'User Total Bans',
            value: `${userDatabase.bans}`,
            inline: true,
          },
          {
            name: 'Account Created',
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          { name: 'Reason', value: `${reason}` },
        ];

        if (member?.joinedTimestamp != null) {
          fields.splice(4, 0, {
            name: 'Joined Server',
            value: `<t:${Math.floor(member?.joinedTimestamp / 1000)}:R>`,
            inline: true,
          });
        }

        await channel.send({
          embeds: [new Embed(color).setTitle('Member Banned').setFields(fields)],
        });
      }

      const appealChannel = guild?.channels.cache.get(config.appealChannelId);
      if (appealChannel && config.appealEnabled && config.appealTypes.includes('ban') && member) {
        const appealButton = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('punishment-appeal')
            .setLabel('Click to appeal')
            .setStyle(ButtonStyle.Primary),
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
    } else {
			if (!ms(duration)) return;
      let ban = true;
      await member.ban({ reason }).catch(() => {
        ban = false;
      });

      if (!ban) return;

      userDatabase.tempbans += 1;
      await userDatabase.save();

      const id = randomUUID();

      const NewPunishment = new Punishment({
        guildId: member.guild.id,
        userId: member.id,
        channelId: 'none',
        moderatorId: '995243562134409296',
        time: new Date().getTime(),
        type: 'tempban',
        id,
        reason,
        duration,
        active: true,
      });
      await NewPunishment.save();

      setTimeout(async () => {
        await tempUnban(client, NewPunishment);
      }, ms(duration));

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
      const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('sentFrom')
          .setLabel(`Sent from server: ${guild?.name ?? 'Unknown'}`.substring(0, 80))
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );

      if (config.tempbanDM && member) {
        const parser = new TimedModerationParser({
          member,
          reason,
          interaction: { user: client.user },
          color,
          id,
          duration,
        });

        await member
          .send({
            embeds: [new CustomEmbed(config.tempbanDMMessage, parser)],
            components: [sentFrom],
            content: parser.parse(config.tempbanDMMessage.content),
          })
          .catch(() => {});
      }

      if (config.channel) {
        const channel = guild?.channels.cache.get(config.channelId);
        if (!channel?.isTextBased()) return;
        if (!hasSendPerms(channel)) return;

        const fields = [
          {
            name: 'User',
            value: `${member} (@${user.username})`,
            inline: true,
          },
          { name: 'Banned By', value: `Automated`, inline: true },
          {
            name: 'User Total Tempbans',
            value: `${userDatabase.tempbans}`,
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
          embeds: [new Embed(color).setTitle('Member Temporarily Banned').addFields(fields).setFooter({ text: `ID: ${id}` })],
        });
      }

      const appealChannel = guild?.channels.cache.get(config.appealChannelId);
      if (appealChannel && config.appealEnabled && config.appealTypes.includes('tempban') && member) {
        const appealButton = new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('punishment-appeal')
            .setLabel('Click to appeal')
            .setStyle(ButtonStyle.Primary),
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
    }
    await checkModerationRules(client, member.guild.id!, member.id, 'ban');
  }
  await checkModerationRules(client, member.guild.id!, member.id, action);
};
