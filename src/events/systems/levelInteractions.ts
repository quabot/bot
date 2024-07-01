import {
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  type Interaction,
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
import { drawLevelCard } from '@functions/cards';
import { hasAnyRole, hasRolePerms, hasSendPerms } from '@functions/discord';
import { LevelParser, RewardLevelParser } from '@classes/parsers';

export default {
  event: Events.InteractionCreate,
  name: 'levelInteractions',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.guild || !interaction.channel || !interaction.member || !('joinedTimestamp' in interaction.member))
      return;
    if (interaction.channel.isDMBased()) return;
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

    let { xp } = levelDB;
    let { level } = levelDB;

    const formula = (lvl: number) => 120 * lvl ** 2 + 100;
    const reqXp = formula(level);

    let rndXp = Math.floor(Math.random() * 3);
    rndXp = rndXp * config.commandXpMultiplier ?? 1;

    const vote = await Vote.findOne({ userId: interaction.user.id })
      .clone()
      .catch(() => {});
    if (!vote) {
      new Vote({
        userId: interaction.user.id,
        lastVote: '0',
      }).save();
    }
    if (vote) {
      if (parseInt(vote.lastVote) + 43200000 > new Date().getTime()) rndXp = rndXp * 1.5;
    }

    const parserOptions = { member, color, xp, level, channel: interChannel };

    if (xp + rndXp >= reqXp) {
      levelDB.xp += rndXp;
      levelDB.level += 1;
      await levelDB.save();

      xp = xp += rndXp;
      level = level += 1;

      const parser = new LevelParser(parserOptions);

      if (config.channel !== 'none') {
        const channel = config.channel === 'current' ? interChannel : guild.channels.cache.get(`${config.channel}`);
        if (!channel?.isTextBased() || channel.isDMBased()) return;
        if (!hasSendPerms(channel)) return;

        const embed = new CustomEmbed(config.message, parser);

        if (config.messageType === 'embed')
          await channel.send({
            embeds: [embed],
            content: `${parser.parse(config.message.content)}`,
          });
        if (config.messageType === 'text') await channel.send({ content: `${parser.parse(config.message.content)}` });
        if (config.messageType === 'card') {
          const card = await drawLevelCard(member, level, xp, formula(level), config.levelCard);
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
        const embed = new CustomEmbed(config.dmMessage, parser);

        if (config.dmType === 'embed')
          await member.send({
            embeds: [embed],
            content: `${parser.parse(config.dmMessage.content)}`,
            components: [sentFrom],
          });
        if (config.dmType === 'text')
          await member.send({
            content: `${parser.parse(config.dmMessage.content)}`,
          });
        if (config.dmType === 'card') {
          const card = await drawLevelCard(member, level, xp, formula(level), config.levelCard);
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
        const parser = new RewardLevelParser({ ...parserOptions, reward: check });

        if (config.rewardsMode === 'replace') {
          if (levelDB.role !== 'none') {
            const role = guild.roles.cache.get(levelDB.role);
            if (hasRolePerms(role)) await member.roles.remove(role!);
          }

          const role = guild.roles.cache.get(check.role);
          if (hasRolePerms(role)) await member.roles.add(role!);
          levelDB.role = check.role;
          await levelDB.save();
        }

        if (config.rewardsMode === 'stack') {
          const role = guild.roles.cache.get(check.role);
          if (hasRolePerms(role)) await member.roles.add(role!);
          levelDB.role = check.role;
          await levelDB.save();
        }

        if (config.rewardDm === false) return;

        if (config.rewardDmType === 'embed')
          await member.send({
            embeds: [new CustomEmbed(config.rewardDmMessage, parser)],
            content: `${parser.parse(config.rewardDmMessage.content)}`,
            components: [sentFrom],
          });
        if (config.rewardDmType === 'text')
          await member.send({
            content: `${parser.parse(config.rewardDmMessage.content)}`,
            components: [sentFrom],
          });
      });
    } else {
      levelDB.xp += rndXp;
      await levelDB.save();
    }
  },
};
