import {
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  type Interaction,
  ChannelType,
  type GuildMember,
} from 'discord.js';
import { getLevelConfig } from '@configs/levelConfig';
import { AttachmentBuilder } from 'discord.js';
import { getLevel } from '@configs/level';
const cooldowns = new Map();
import { CustomEmbed } from '@constants/customEmbed';
import { getServerConfig } from '@configs/serverConfig';
import type { EventArgs } from '@typings/functionArgs';
import Vote from '@schemas/Vote';
import { drawCard } from '@functions/levelCard';
import { hasAnyRole, hasSendPerms } from '@functions/discord';
import type { CallbackError } from 'mongoose';
import type { MongooseReturn } from '@typings/mongoose';
import type { IVote } from '@typings/schemas';

export default {
  event: Events.InteractionCreate,
  name: 'levelInteractions',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.guild || !interaction.channel || !interaction.member || !('joinedTimestamp' in interaction.member))
      return;
    if (interaction.user.bot) return;

    const guild = interaction.guild!;
    const interChannel = interaction.channel!;
    const member = interaction.member as GuildMember;

    if (!cooldowns.has(interaction.user)) cooldowns.set(interaction.user, new Collection());
    const current_time = Date.now();
    const time_stamps = cooldowns.get(interaction.user);
    const cooldown_amount = 20000;

    let no = false;
    if (time_stamps.has(interaction.user.id)) {
      const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;
      if (current_time < expiration_time) return (no = true);
    }
    if (no) return;

    time_stamps.set(interaction.user.id, current_time);
    setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);

    const config = await getLevelConfig(guild.id, client);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.commandXp) return;
    if (config.excludedChannels!.includes(interChannel.id)) return;

    const levelDB = await getLevel(guild.id!, interaction.user.id);

    if (hasAnyRole(member, config.excludedRoles!)) return;

    const configColor = await getServerConfig(client, guild.id);
    const color = configColor?.color ?? '#416683';
    if (!color) return;

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + guild.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (!levelDB) return;

    let xp = levelDB.xp;
    let level = levelDB.level;

    const formula = (lvl: number) => 120 * lvl ** 2 + 100;
    const reqXp = formula(level);

    let rndXp = Math.floor(Math.random() * 3);
    rndXp = rndXp * config.commandXpMultiplier ?? 1;

    const vote = await Vote.findOne({ userId: interaction.user.id }, (err: CallbackError, c: MongooseReturn<IVote>) => {
      if (err) console.log(err);
      if (!c)
        new Vote({
          userId: interaction.user.id,
          lastVote: '0',
        }).save();
    })
      .clone()
      .catch(() => {});
    if (vote) {
      if (parseInt(vote.lastVote) + 43200000 > new Date().getTime()) rndXp = rndXp * 1.5;
    }

    if (xp + rndXp >= reqXp) {
      levelDB.xp += rndXp;
      levelDB.level += 1;
      await levelDB.save();

      xp = xp += rndXp;
      level = level += 1;

      const parse = (s: string) => {
        return s
          .replaceAll('{server.name}', `${guild.name}`)
          .replaceAll('{server}', `${guild.name}` ?? '')
          .replaceAll('{server.id}', `${guild.id}` ?? '')
          .replaceAll('{server.icon_url}', `${guild.iconURL()}` ?? '')
          .replaceAll('{server.icon}', `${guild.icon}` ?? '')
          .replaceAll('{icon}', `${guild.iconURL()}` ?? '')
          .replaceAll('{server.owner}', `<@${guild.ownerId}>` ?? '')
          .replaceAll('{icon}', `${guild.iconURL()}` ?? '')
          .replaceAll('{id}', `${interaction.user.id}` ?? '')
          .replaceAll('{server.owner_id}', `${guild.ownerId}` ?? '')
          .replaceAll('{server.members}', `${guild.memberCount}` ?? '')
          .replaceAll('{members}', `${guild.memberCount}` ?? '')
          .replaceAll('{user}', `${interaction.user}` ?? '')
          .replaceAll('{username}', `${interaction.user.username}` ?? '')
          .replaceAll('{user.name}', `${interaction.user.username}` ?? '')
          .replaceAll('{user.username}', `${interaction.user.username}` ?? '')
          .replaceAll('{user.tag}', `${interaction.user.tag}` ?? '')
          .replaceAll('{tag}', `${interaction.user.tag}` ?? '')
          .replaceAll('{user.discriminator}', `${interaction.user.discriminator}` ?? '')
          .replaceAll('{user.displayname}', `${interaction.user.displayName}` ?? '')
          .replaceAll('{user.id}', `${interaction.user.id}` ?? '')
          .replaceAll('{user.avatar_url}', `${interaction.user.avatarURL()}` ?? '')
          .replaceAll('{user.avatar}', `${interaction.user.avatar}` ?? '')
          .replaceAll('{avatar}', `${interaction.user.avatarURL()}` ?? '')
          .replaceAll('{user.created_at}', `${interaction.user.createdAt}` ?? '')
          .replaceAll('{user.joined_at}', `${member.joinedAt}` ?? '')
          .replaceAll('{channel}', `${interChannel}` ?? '')
          .replaceAll('{channel.name}', 'name' in interChannel ? `${interChannel.name}` : '')
          .replaceAll('{channel.id}', `${interChannel.id}` ?? '')
          .replaceAll('{level}', `${level}` ?? '')
          .replaceAll('{xp}', `${xp}` ?? '')
          .replaceAll('{required_xp}', `${formula(level)}` ?? '')
          .replaceAll('{color}', `${color}` ?? '');
      };

      if (config.channel !== 'none') {
        const channel = config.channel === 'current' ? interChannel : guild.channels.cache.get(`${config.channel}`);
        if (
          !channel ||
          channel.type === ChannelType.GuildCategory ||
          channel.type === ChannelType.GuildForum ||
          channel.type === ChannelType.DM
        )
          return;
        if (!hasSendPerms(channel)) return;

        const embed = new CustomEmbed(config.message, parse);

        if (config.messageType === 'embed')
          await channel.send({
            embeds: [embed],
            content: `${parse(config.message.content)}`,
          });
        if (config.messageType === 'text') await channel.send({ content: `${parse(config.messageText)}` });
        if (config.messageType === 'card') {
          const card = await drawCard(member, level, xp, formula(level), config.levelCard);
          if (!card) return channel.send('Internal error with card');

          const attachment = new AttachmentBuilder(card, {
            name: 'level_card.png',
          });

          if (!config.cardMention) await channel.send({ files: [attachment] });
          if (config.cardMention)
            await channel.send({
              files: [attachment],
              content: `${interaction.user}`,
            });
        }
      }

      if (config.dmEnabled) {
        const embed = new CustomEmbed(config.dmMessage, parse);

        if (config.dmType === 'embed')
          await member.send({
            embeds: [embed],
            content: `${parse(config.dmMessage.content)}`,
            components: [sentFrom],
          });
        if (config.dmType === 'text')
          await member.send({
            content: `${parse(config.dmMessageText)}`,
          });
        if (config.dmType === 'card') {
          const card = await drawCard(member, level, xp, formula(level), config.levelCard);
          if (!card)
            return member.send(
              'You leveled up! Sorry, we tried to send a card to the configured channel, but there was an error. Sorry for the inconvinience! All level rewards have been given.',
            );

          if (card) {
            const attachment = new AttachmentBuilder(card, {
              name: 'level_card.png',
            });

            if (!config.cardMention) await member.send({ files: [attachment] });
            if (config.cardMention)
              await member.send({
                files: [attachment],
                content: `${interaction.user}`,
              });
          }
        }
      }

      const nextCheck = config.rewards!.filter(i => i.level === level) ?? [];
      nextCheck.forEach(async check => {
        const parseCheck = (s: string) =>
          s
            .replaceAll('{server.name}', `${guild.name}`)
            .replaceAll('{server}', `${guild.name}` ?? '')
            .replaceAll('{server.id}', `${guild.id}` ?? '')
            .replaceAll('{server.icon_url}', `${guild.iconURL()}` ?? '')
            .replaceAll('{server.icon}', `${guild.icon}` ?? '')
            .replaceAll('{icon}', `${guild.iconURL()}` ?? '')
            .replaceAll('{server.owner}', `<@${guild.ownerId}>` ?? '')
            .replaceAll('{icon}', `${guild.iconURL()}` ?? '')
            .replaceAll('{id}', `${interaction.user.id}` ?? '')
            .replaceAll('{server.owner_id}', `${guild.ownerId}` ?? '')
            .replaceAll('{server.members}', `${guild.memberCount}` ?? '')
            .replaceAll('{members}', `${guild.memberCount}` ?? '')
            .replaceAll('{user}', `${interaction.user}` ?? '')
            .replaceAll('{username}', `${interaction.user.username}` ?? '')
            .replaceAll('{user.name}', `${interaction.user.username}` ?? '')
            .replaceAll('{user.username}', `${interaction.user.username}` ?? '')
            .replaceAll('{user.tag}', `${interaction.user.tag}` ?? '')
            .replaceAll('{tag}', `${interaction.user.tag}` ?? '')
            .replaceAll('{user.discriminator}', `${interaction.user.discriminator}` ?? '')
            .replaceAll('{user.displayname}', `${interaction.user.displayName}` ?? '')
            .replaceAll('{user.id}', `${interaction.user.id}` ?? '')
            .replaceAll('{user.avatar_url}', `${interaction.user.avatarURL()}` ?? '')
            .replaceAll('{user.avatar}', `${interaction.user.avatar}` ?? '')
            .replaceAll('{avatar}', `${interaction.user.avatarURL()}` ?? '')
            .replaceAll('{user.created_at}', `${interaction.user.createdAt}` ?? '')
            .replaceAll('{user.joined_at}', `${member.joinedAt}` ?? '')
            .replaceAll('{channel}', `${interChannel}` ?? '')
            .replaceAll('{channel.name}', 'name' in interChannel ? `${interChannel.name}` : '')
            .replaceAll('{channel.id}', `${interChannel.id}` ?? '')
            .replaceAll('{level}', `${level}` ?? '')
            .replaceAll('{xp}', `${xp}` ?? '')
            .replaceAll('{required_xp}', `${formula(level)}` ?? '')
            .replaceAll('{color}', `${color}` ?? '')
            .replaceAll('{role}', `<@&${check.role}>` ?? '')
            .replaceAll('{reward}', `<@&${check.role}>` ?? '')
            .replaceAll('{required_level}', `${check.level}` ?? '')
            .replaceAll('{reward.level}', `${check.level}` ?? '')
            .replaceAll('{reward.role}', `<@&${check.role}>` ?? '');

        if (config.rewardsMode === 'replace') {
          if (levelDB.role !== 'none') {
            const role = guild.roles.cache.get(levelDB.role);
            if (role) await member.roles.remove(role);
          }

          const role = guild.roles.cache.get(check.role);
          if (role) await member.roles.add(role);
          levelDB.role = check.role;
          await levelDB.save();
        }

        if (config.rewardsMode === 'stack') {
          const role = guild.roles.cache.get(check.role);
          if (role) await member.roles.add(role);
          levelDB.role = check.role;
          await levelDB.save();
        }

        if (config.rewardDm === false) return;

        if (config.rewardDmType === 'embed')
          await member.send({
            embeds: [new CustomEmbed(config.rewardDmMessage, parseCheck)],
            content: `${parseCheck(config.rewardDmMessage.content)}`,
            components: [sentFrom],
          });
        if (config.rewardDmType === 'text')
          await member.send({
            content: `${parseCheck(config.rewardDmMessageText)}`,
            components: [sentFrom],
          });
      });
    } else {
      levelDB.xp += rndXp;
      await levelDB.save();
    }
  },
};
