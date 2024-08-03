import { Client } from '@classes/discord';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import ModerationRules from '@schemas/Moderation-Rules';
import Punishment from '@schemas/Punishment';
import { IModerationRules } from '@typings/schemas';
import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, GuildMemberRoleManager } from 'discord.js';
import ms from 'ms';
import { randomUUID } from 'crypto';
import { Embed } from '@constants/embed';
import { hasSendPerms } from './discord';
import { getServerConfig } from '@configs/serverConfig';
import { ModerationParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';

export const checkModerationRules = async (client: Client, guildId: string, userId: string, triggerType: string) => {
  const punishments = await Punishment.find({ guildId, userId });
  if (!punishments) return;

  const rules = await ModerationRules.find({ guildId });
  if (!rules) return;

  const banCount = punishments.filter(p => p.type === 'ban').length;
  const timeoutCount = punishments.filter(p => p.type === 'timeout').length;
  const kickCount = punishments.filter(p => p.type === 'kick').length;
  const warnCount = punishments.filter(p => p.type === 'warn').length;

  console.log('timeout' + warnCount);
  const triggeredRules: IModerationRules[] = [];
  rules.forEach(r => {
    if (r.trigger.type === 'ban' && banCount >= r.trigger.amount && triggerType === 'ban')
      return triggeredRules.push(r);
    if (r.trigger.type === 'timeout' && timeoutCount >= r.trigger.amount && triggerType === 'timeout')
      return triggeredRules.push(r);
    if (r.trigger.type === 'kick' && kickCount >= r.trigger.amount && triggerType === 'kick')
      return triggeredRules.push(r);
    if (r.trigger.type === 'warn' && warnCount >= r.trigger.amount && triggerType === 'warn')
      return triggeredRules.push(r);
  });

  triggeredRules.forEach(async rule => {
    if (!rule) return;
    let timeSince = new Date(Date.now() - ms(rule.trigger.time === 'none' ? '0s' : rule.trigger.time)).getTime();
    console.log(timeSince);
    if (rule.trigger.time === 'none') timeSince = 0;

    const punishments = await Punishment.find({ guildId, userId, type: rule.trigger.type, time: { $gte: timeSince } });
    if (punishments.length === rule.trigger.amount) {
      // handle timeout

      const reason = rule.action.reason;
      const duration = rule.action.duration;
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return;
      const member = await guild.members.fetch(userId);
      const user = guild.members.cache.get(userId)?.user;
      if (!member) return;
      if (!user) return;

      const config = await getModerationConfig(client, guildId!);
      if (!config) return;

      await getUser(guildId!, member.id);

      if (!ms(duration)) return;

      if (!((member?.roles as any) instanceof GuildMemberRoleManager)) return;

      const serverConfig = await getServerConfig(client, guildId);
      if (!serverConfig) return;
      const color = serverConfig.color ?? '#416683';

      const userDatabase = await getUser(guildId!, member.id);
      if (!userDatabase) return;

      if (rule.action.type === 'timeout') {
        let timeout = true;
        await member.timeout(ms(duration), reason).catch(async () => {
          timeout = false;
        });

        if (!timeout) return;

        userDatabase.timeouts += 1;
        await userDatabase.save();

        const id = randomUUID();

        const NewPunishment = new Punishment({
          guildId: guildId,
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
                    `**Reason:** ${reason}\n**Duration:** ${rule.action.duration}\n-# This action was performed automatically, because you had ${rule.trigger.amount} ${rule.trigger.type}.`,
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
            embeds: [new Embed(color).setTitle('Member Timed Out').addFields(fields)],
          });
        }

        const appealChannel = guild?.channels.cache.get(config.appealChannelId);
        if (appealChannel && config.appealEnabled && config.appealTypes.includes('timeout')) {
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
      } else if (rule.action.type === 'kick') {
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
          guildId: guildId,
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

        await checkModerationRules(client, guildId!, member.id, 'kick');
      } else if (rule.action.type === 'warn') {
        userDatabase.warns += 1;
        await userDatabase.save();

        const id = randomUUID();

        const NewPunishment = new Punishment({
          guildId: guildId,
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
          console.log(channel);
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
            embeds: [new Embed(color).setTitle('Member Warned').addFields(fields)],
          });
        }

        await checkModerationRules(client, guildId!, member.id, 'warn');
      } else if (rule.action.type === 'ban') {
        const duration = rule.action.duration ?? 'permanent';

        if (duration === 'permanent') {
          // ban regular
        } else {
          // ban  tempban
        }
      }
      await checkModerationRules(client, guildId!, member.id, rule.action.type);
    } else {
      return;
    }
  });
};
