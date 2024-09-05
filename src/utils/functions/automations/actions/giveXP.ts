import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, Message, TextChannel } from 'discord.js';
import { IAutomationAction } from '@typings/schemas';
import { getLevelConfig } from '@configs/levelConfig';
import { getLevel } from '@configs/level';
import { getServerConfig } from '@configs/serverConfig';
import { LevelParser, RewardLevelParser } from '@classes/parsers';
import { hasRolePerms, hasSendPerms } from '@functions/discord';
import { CustomEmbed } from '@constants/customEmbed';
import { drawLevelCard } from '@functions/cards';

export const giveXPAutomation = async (message: Message | null, client: Client, action: IAutomationAction) => {
  if (!message) return;
  if (!message.guild) return;
  if (message.author.bot) return;

  const aConfig = await getAutomationConfig(message.guild.id, client);
  if (!aConfig) return;
  if (!aConfig.enabled) return;

  if (!action.xp) return;

  const guild = message.guild;
  const msgChannel = message.channel;
  const member = message.member;
  if (!member) return;


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

  const rndXp = action.xp;

  if (xp + rndXp >= reqXp) {
    levelDB.xp += rndXp;
    levelDB.level += 1;
    await levelDB.save().catch(() => null);

    xp = xp += rndXp;
    level = level += 1;

    const parserOptions = { member, color, xp, level, channel: msgChannel as TextChannel };
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

        if (config.levelupCardContent === '') await channel.send({ files: [attachment] });
        if (config.levelupCardContent !== '')
          await channel
            .send({
              files: [attachment],
              content: `${parser.parse(config.levelupCardContent)}`,
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

          if (config.levelupCardContent === '') await member.send({ files: [attachment] });
          if (config.levelupCardContent !== '')
            await member
              .send({
                files: [attachment],
                content: `${parser.parse(config.levelupCardContent)}`,
              })
              .catch(() => {});
        }
      }
    }

    const nextCheck = config.rewards!.filter(i => i.level === level) ?? [];
    nextCheck.forEach(async check => {
      const parser = new RewardLevelParser({ ...parserOptions, reward: check });

      if (config.rewardsMode === 'replace') {
        const roles = config.rewards!.map(i => i.role);
        roles.forEach(async role => {
          if (guild.roles.cache.has(role)) {
            if (config.rewards?.find(r => r.role === role)?.level !== level) {
              const r = guild.roles.cache.get(role);
              if (hasRolePerms(r)) await member.roles.remove(r!).catch(() => {});
            }
          }
        });

        const role = guild.roles.cache.get(check.role);
        if (hasRolePerms(role)) await member.roles.add(role!).catch(() => {});
        levelDB.role = check.role;
        await levelDB.save().catch(() => null);
      }

      if (config.rewardsMode === 'stack') {
        const role = guild.roles.cache.get(check.role);
        if (hasRolePerms(role)) await member.roles.add(role!).catch(() => {});
        levelDB.role = check.role;
        await levelDB.save().catch(() => null);
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
    await levelDB.save().catch(() => null);
  }
};
