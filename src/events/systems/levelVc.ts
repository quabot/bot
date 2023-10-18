import { Events, VoiceState, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import { getLevelConfig } from '@configs/levelConfig';
import { getLevel } from '@configs/level';
import { getServerConfig } from '@configs/serverConfig';
import Vote from '@schemas/Vote';
import { CustomEmbed } from '@constants/customEmbed';
import { drawCard } from '@functions/levelCard';

module.exports = {
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

    const levelDB = await getLevel(newState.guild.id, member.id, client);
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

            const sentFrom = new ActionRowBuilder().addComponents(
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

            const vote = await Vote.findOne({ userId: member.id }, (err, c) => {
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

            if (xp + rndXp >= reqXp) {
              levelDB.xp += rndXp;
              levelDB.level += 1;
              await levelDB.save();

              xp = xp += rndXp;
              level = level += 1;

              const parse = (s: string) => {
                return s
                  .replaceAll('{server.name}', `${newState.guild.name}`)
                  .replaceAll('{server}', `${newState.guild.name}` ?? '')
                  .replaceAll('{server.id}', `${newState.guild.id}` ?? '')
                  .replaceAll('{server.icon_url}', `${newState.guild.iconURL()}` ?? '')
                  .replaceAll('{server.icon}', `${newState.guild.icon}` ?? '')
                  .replaceAll('{icon}', `${newState.guild.iconURL()}` ?? '')
                  .replaceAll('{server.owner}', `<@${newState.guild.ownerId}>` ?? '')
                  .replaceAll('{icon}', `${newState.guild.iconURL()}` ?? '')
                  .replaceAll('{id}', `${member.id}` ?? '')
                  .replaceAll('{server.owner_id}', `${newState.guild.ownerId}` ?? '')
                  .replaceAll('{server.members}', `${newState.guild.memberCount}` ?? '')
                  .replaceAll('{members}', `${newState.guild.memberCount}` ?? '')
                  .replaceAll('{user}', `${member}` ?? '')
                  .replaceAll('{username}', `${member.user.username}` ?? '')
                  .replaceAll('{user.name}', `${member.user.username}` ?? '')
                  .replaceAll('{user.username}', `${member.user.username}` ?? '')
                  .replaceAll('{user.tag}', `${member.user.tag}` ?? '')
                  .replaceAll('{tag}', `${member.user.tag}` ?? '')
                  .replaceAll('{user.discriminator}', `${member.user.discriminator}` ?? '')
                  .replaceAll('{user.displayname}', `${member.user.displayName}` ?? '')
                  .replaceAll('{user.id}', `${member.user.id}` ?? '')
                  .replaceAll('{user.avatar_url}', `${member.user.avatarURL()}` ?? '')
                  .replaceAll('{user.avatar}', `${member.user.avatar}` ?? '')
                  .replaceAll('{avatar}', `${member.user.avatarURL()}` ?? '')
                  .replaceAll('{user.created_at}', `${member.user.createdAt}` ?? '')
                  .replaceAll('{user.joined_at}', `${member.joinedAt}` ?? '')
                  .replaceAll('{channel}', `${newState.channel}` ?? '')
                  .replaceAll('{channel.name}', `${newState.channel?.name}` ?? '')
                  .replaceAll('{channel.id}', `${newState.channel?.id}` ?? '')
                  .replaceAll('{level}', `${level}` ?? '')
                  .replaceAll('{xp}', `${xp}` ?? '')
                  .replaceAll('{required_xp}', `${formula(level)}` ?? '')
                  .replaceAll('{color}', `${color}` ?? '');
              };

              if (config.channel !== 'none') {
                const channel =
                  config.channel === 'current'
                    ? newState.channel
                    : newState.guild.channels.cache.get(`${config.channel}`);
                if (!channel) return;

                const embed = new CustomEmbed(config.message, parse);

                if (config.messageType === 'embed')
                  await channel.send({
                    embeds: [embed],
                    content: `${parse(config.message.content)}`,
                  });
                if (config.messageType === 'text')
                  await channel.send({
                    content: `${parse(config.messageText)}`,
                  });
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
                      content: `${member}`,
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
                    await member.send(
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
                        content: `${member}`,
                      });
                  }
                }
              }

              const nextCheck = config.rewards!.filter(i => i.level === level);

              nextCheck.forEach(async check => {
                const parseCheck = (s: string) => {
                  return s
                    .replaceAll('{server.name}', `${newState.guild.name}`)
                    .replaceAll('{server}', `${newState.guild.name}` ?? '')
                    .replaceAll('{server.id}', `${newState.guild.id}` ?? '')
                    .replaceAll('{server.icon_url}', `${newState.guild.iconURL()}` ?? '')
                    .replaceAll('{server.icon}', `${newState.guild.icon}` ?? '')
                    .replaceAll('{icon}', `${newState.guild.iconURL()}` ?? '')
                    .replaceAll('{server.owner}', `<@${newState.guild.ownerId}>` ?? '')
                    .replaceAll('{icon}', `${newState.guild.iconURL()}` ?? '')
                    .replaceAll('{id}', `${member.id}` ?? '')
                    .replaceAll('{server.owner_id}', `${newState.guild.ownerId}` ?? '')
                    .replaceAll('{server.members}', `${newState.guild.memberCount}` ?? '')
                    .replaceAll('{members}', `${newState.guild.memberCount}` ?? '')
                    .replaceAll('{user}', `${member}` ?? '')
                    .replaceAll('{username}', `${member.user.username}` ?? '')
                    .replaceAll('{user.name}', `${member.user.username}` ?? '')
                    .replaceAll('{user.username}', `${member.user.username}` ?? '')
                    .replaceAll('{user.tag}', `${member.user.tag}` ?? '')
                    .replaceAll('{tag}', `${member.user.tag}` ?? '')
                    .replaceAll('{user.discriminator}', `${member.user.discriminator}` ?? '')
                    .replaceAll('{user.displayname}', `${member.user.displayName}` ?? '')
                    .replaceAll('{user.id}', `${member.user.id}` ?? '')
                    .replaceAll('{user.avatar_url}', `${member.user.avatarURL()}` ?? '')
                    .replaceAll('{user.avatar}', `${member.user.avatar}` ?? '')
                    .replaceAll('{avatar}', `${member.user.avatarURL()}` ?? '')
                    .replaceAll('{user.created_at}', `${member.user.createdAt}` ?? '')
                    .replaceAll('{user.joined_at}', `${member.joinedAt}` ?? '')
                    .replaceAll('{channel}', `${newState.channel}` ?? '')
                    .replaceAll('{channel.name}', `${newState.channel?.name}` ?? '')
                    .replaceAll('{channel.id}', `${newState.channel?.id}` ?? '')
                    .replaceAll('{level}', `${level}` ?? '')
                    .replaceAll('{xp}', `${xp}` ?? '')
                    .replaceAll('{required_xp}', `${formula(level)}` ?? '')
                    .replaceAll('{color}', `${color}` ?? '')
                    .replaceAll('{role}', `<@&${check.role}>` ?? '')
                    .replaceAll('{reward}', `<@&${check.role}>` ?? '')
                    .replaceAll('{required_level}', `${check.level}` ?? '')
                    .replaceAll('{reward.level}', `${check.level}` ?? '')
                    .replaceAll('{reward.role}', `<@&${check.role}>` ?? '');
                };

                if (config.rewardsMode === 'replace') {
                  if (levelDB.role !== 'none') {
                    const role = newState.guild.roles.cache.get(levelDB.role);
                    if (role) await member.roles.remove(role);
                  }

                  const role = newState.guild.roles.cache.get(check.role);
                  if (role) await member.roles.add(role);
                  levelDB.role = check.role;
                  await levelDB.save();
                }

                if (config.rewardsMode === 'stack') {
                  const role = newState.guild.roles.cache.get(check.role);
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
          }
          loop();
        }, 60000);
      })();
    }
  },
};
