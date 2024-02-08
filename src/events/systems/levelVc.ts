import { Events, VoiceState, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import { getLevelConfig } from '@configs/levelConfig';
import { getLevel } from '@configs/level';
import { getServerConfig } from '@configs/serverConfig';
import Vote from '@schemas/Vote';
import { CustomEmbed } from '@constants/customEmbed';
import { drawLevelCard } from '@functions/cards';
import type { CallbackError } from 'mongoose';
import type { MongooseReturn } from '@typings/mongoose';
import type { IVote } from '@typings/schemas';
import { hasRolePerms, hasSendPerms } from '@functions/discord';
import { LevelParser, RewardLevelParser } from '@classes/parsers';

export default {
  event: Events.VoiceStateUpdate,
  name: 'voiceJoinLeave',

  async execute({ client }: EventArgs, oldState: VoiceState, newState: VoiceState) {
    if (!newState.member) return;
    const member = newState.member!;

    if (member.user.bot) return;

    const config = await getLevelConfig(newState.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.voiceXp) if (newState.channelId && config.excludedChannels?.includes(newState.channelId)) return;

    for (let i = 0; i < config.excludedRoles!.length; i++) {
      const role = config.excludedRoles![i];
      if (member.roles.cache.has(role)) return;
    }

    if (oldState.channelId && newState.channelId) return;

    const levelDB = await getLevel(newState.guild.id, member.id);
    if (!levelDB) return;

    if (!oldState.channelId) {
      // !map of users in loop rn
      (function loop() {
        setTimeout(async function () {
          if (member.voice.channelId === null) {
            return;
          }

          if (member.voice.selfMute) {
            // console.log('muted');
          } else if (member.voice.selfDeaf) {
            // console.log('deafened');
          } else if (member.voice.deaf) {
            // console.log('server deafened');
          } else if (member.voice.channel?.members.size === 1) {
            // console.log('only 1 user')
          } else {
            const configColor = await getServerConfig(client, newState.guild.id);
            const color = configColor?.color ?? '#416683';
            if (!color) return;

            const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setCustomId('sentFrom')
                .setLabel('Sent from server: ' + newState.guild.name ?? 'Unknown')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            );

            if (!levelDB) return;

            let xp = levelDB.xp;
            let level = levelDB.level;

            const formula = (lvl: number) => 120 * lvl ** 2 + 100;
            const reqXp = formula(level);

            let rndXp = Math.floor(Math.random() * 3);
            rndXp = rndXp * config.voiceXpMultiplier ?? 1;

            const vote = await Vote.findOne({ userId: member.id }, (err: CallbackError, c: MongooseReturn<IVote>) => {
              if (err) console.log(err);
              if (!c)
                new Vote({
                  userId: member.id,
                  lastVote: '0',
                }).save();
            })
              .clone()
              .catch(() => {});
            if (vote) {
              if (parseInt(vote.lastVote) + 43200000 > new Date().getTime()) rndXp = rndXp * 1.5;
            }

            const parserOptions = { member, color, xp, level, channel: newState.channel! };

            if (xp + rndXp >= reqXp) {
              levelDB.xp += rndXp;
              levelDB.level += 1;
              await levelDB.save();

              xp = xp += rndXp;
              level = level += 1;

              const parser = new LevelParser(parserOptions);

              if (config.channel !== 'none') {
                const channel =
                  config.channel === 'current'
                    ? newState.channel
                    : newState.guild.channels.cache.get(`${config.channel}`);
                if (!channel?.isTextBased()) return;
                if (!hasSendPerms(channel)) return;

                const embed = new CustomEmbed(config.message, parser);

                if (config.messageType === 'embed')
                  await channel.send({
                    embeds: [embed],
                    content: `${parser.parse(config.message.content)}`,
                  });
                if (config.messageType === 'text')
                  await channel.send({
                    content: `${parser.parse(config.messageText)}`,
                  });
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
                      content: `${member}`,
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
                    content: `${parser.parse(config.dmMessageText)}`,
                  });
                if (config.dmType === 'card') {
                  const card = await drawLevelCard(member, level, xp, formula(level), config.levelCard);
                  if (!card)
                    await member.send(
                      'You leveled up! Sorry, we tried to send a card to the configured channel, but there was an error. Sorry for the inconvenience! All level rewards have been given.',
                    );

                  if (card) {
                    const attachment = new AttachmentBuilder(card, {
                      name: 'level_card.png',
                    });

                    if (!config.cardMention) await member.send({ files: [attachment] });
                    if (config.cardMention)
                      await member.send({
                        files: [attachment],
                        content: `${member}`,
                      });
                  }
                }
              }

              const nextCheck = config.rewards!.filter(i => i.level === level);

              nextCheck.forEach(async check => {
                const parser = new RewardLevelParser({ ...parserOptions, reward: check });

                if (config.rewardsMode === 'replace') {
                  if (levelDB.role !== 'none') {
                    const role = newState.guild.roles.cache.get(levelDB.role);
                    if (hasRolePerms(role)) await member.roles.remove(role!);
                  }

                  const role = newState.guild.roles.cache.get(check.role);
                  if (hasRolePerms(role)) await member.roles.add(role!);
                  levelDB.role = check.role;
                  await levelDB.save();
                }

                if (config.rewardsMode === 'stack') {
                  const role = newState.guild.roles.cache.get(check.role);
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
                    content: `${parser.parse(config.rewardDmMessageText)}`,
                    components: [sentFrom],
                  });
              });
            } else {
              levelDB.xp += rndXp;
              await levelDB.save();
            }
          }
          loop();
        }, 60000);
      })();
    }
  },
};
