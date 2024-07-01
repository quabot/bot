import { type Message, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getLevelConfig } from '@configs/levelConfig';
import { AttachmentBuilder } from 'discord.js';
import { getLevel } from '@configs/level';
const cooldowns = new Map();
import { CustomEmbed } from '@constants/customEmbed';
import { getServerConfig } from '@configs/serverConfig';
import Vote from '@schemas/Vote';
import { drawLevelCard } from '@functions/cards';
import type { EventArgs } from '@typings/functionArgs';
import { hasRolePerms, hasSendPerms } from '@functions/discord';
import { LevelParser, RewardLevelParser } from '@classes/parsers';

export default {
  event: 'messageCreate',
  name: 'levels',

  async execute({ client }: EventArgs, message: Message) {
    if (!message.guild || !message.channel || !message.member) return;
    if (message.channel.isDMBased()) return;
    if (message.author.bot) return;

    const guild = message.guild!;
    const msgChannel = message.channel!;
    const member = message.member!;

    if (!cooldowns.has(message.author)) cooldowns.set(message.author, new Collection());
    const current_time = Date.now();
    const time_stamps = cooldowns.get(message.author);
    const cooldown_amount = 30000;

    let no = false;
    if (time_stamps.has(message.author.id)) {
      const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;
      if (current_time < expiration_time) return (no = true);
    }
    if (no) return;

    time_stamps.set(message.author.id, current_time);
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

    const config = await getLevelConfig(guild.id, client);
    if (!config) return;
    if (!config.enabled) return;
    if (config.excludedChannels!.includes(msgChannel.id)) return;

    const levelDB = await getLevel(guild.id, message.author.id);

    for (let i = 0; i < config.excludedRoles!.length; i++) {
      const role = config.excludedRoles![i];
      if (member.roles.cache.has(role)) return;
    }

    const configColor = await getServerConfig(client, guild.id);
    const color = configColor?.color ?? '#416683';
    if (!color) return;

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (!levelDB) return;

    let xp = levelDB.xp;
    let level = levelDB.level;

    const formula = (lvl: number) => 120 * lvl ** 2 + 100;
    const reqXp = formula(level);

    let rndXp = Math.floor(Math.random() * 5);
    if (message.content.length > 200) rndXp += 1;
    rndXp = rndXp * config.xpMultiplier ?? 1;

    const vote = await Vote.findOne({ userId: message.author.id })
      .clone()
      .catch(() => {});

    if (!vote) {
      new Vote({
        userId: message.author.id,
        lastVote: '0',
      }).save();
    }
    if (vote) {
      if (parseInt(vote.lastVote) + 43200000 > new Date().getTime()) rndXp = rndXp * 1.5;
    }

    const parserOptions = { member, color, xp, level, channel: msgChannel };

    if (xp + rndXp >= reqXp) {
      levelDB.xp += rndXp;
      levelDB.level += 1;
      await levelDB.save();

      xp = xp += rndXp;
      level = level += 1;

      const parser = new LevelParser(parserOptions);

      if (config.channel !== 'none') {
        const channel = config.channel === 'current' ? msgChannel : guild.channels.cache.get(`${config.channel}`);
        if (!channel?.isTextBased() || channel.isDMBased()) return;
        if (!hasSendPerms(channel)) return;

        const embed = new CustomEmbed(config.message, parser);

        if (config.messageType === 'embed')
          await channel
            .send({
              embeds: [embed],
              content: `${parser.parse(config.message.content)}`,
            })
            .catch(() => {});
        if (config.messageType === 'text')
          await channel.send({ content: `${parser.parse(config.message.content)}` }).catch(() => {});
        if (config.messageType === 'card') {
          const card = await drawLevelCard(member, level, xp, formula(level), config.levelCard);
          if (!card) return channel.send('Internal error with card');

          const attachment = new AttachmentBuilder(card, {
            name: 'level_card.png',
          });

          if (!config.cardMention) await channel.send({ files: [attachment] });
          if (config.cardMention)
            await channel
              .send({
                files: [attachment],
                content: `${message.author}`,
              })
              .catch(() => {});
        }
      }

      if (config.dmEnabled) {
        const embed = new CustomEmbed(config.dmMessage, parser);

        if (config.dmType === 'embed')
          await member
            .send({
              embeds: [embed],
              content: `${parser.parse(config.dmMessage.content)}`,
              components: [sentFrom],
            })
            .catch(() => {});
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
              await member
                .send({
                  files: [attachment],
                  content: `${message.author}`,
                })
                .catch(() => {});
          }
        }
      }

      const nextCheck = config.rewards!.filter(i => i.level === level) ?? [];
      nextCheck.forEach(async check => {
        const parser = new RewardLevelParser({ ...parserOptions, reward: check });

        if (config.rewardsMode === 'replace') {
          if (levelDB.role !== 'none') {
            const role = guild.roles.cache.get(levelDB.role);
            if (hasRolePerms(role)) await member.roles.remove(role!).catch(() => {});
          }

          const role = guild.roles.cache.get(check.role);
          if (hasRolePerms(role)) await member.roles.add(role!).catch(() => {});
          levelDB.role = check.role;
          await levelDB.save();
        }

        if (config.rewardsMode === 'stack') {
          const role = guild.roles.cache.get(check.role);
          if (hasRolePerms(role)) await member.roles.add(role!).catch(() => {});
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
