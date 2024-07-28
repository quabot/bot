import {
  type User,
  type MessageReaction,
} from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import { getStarMessagesConfig } from '@configs/getStarMessagesConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { StarMessagesParser } from '@classes/parsers';
import { Embed } from '@constants/embed';
import StarMessage from '@schemas/StarMessage';
import { getServerConfig } from '@configs/serverConfig';

export default {
  event: 'messageReactionAdd',
  name: 'starMessages',

  async execute({ client }: EventArgs, reaction: MessageReaction, user: User) {
    if (!reaction.message.guild?.id) return;
    if (user.bot) return;
    if (!reaction.message.author) return;
    if (reaction.message.author.bot) return;

    const config = await getStarMessagesConfig(reaction.message.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;

    if (reaction.emoji.name !== config.emoji) return;
    const reactionUsers = await reaction.users.fetch();
    
    if (reactionUsers.size < config.minStars) return;
    if (config.ignoredChannels.includes(reaction.message.channel.id)) return;

    const starboardChannel = reaction.message.guild.channels.cache.get(config.channel);
    if (!starboardChannel) return;
    if (!starboardChannel.isTextBased()) return

    const member = reaction.message.guild.members.cache.get(user.id);
    if (!member) return;

    const reactionMessage = await reaction.message.fetch();
    if (!reactionMessage) return;

    const serverConfig = await getServerConfig(client, reaction.message.guild.id);
    const color = serverConfig ? serverConfig.color : '#416683';
    const parser = new StarMessagesParser({ channel: starboardChannel, emoji: config.emoji, member, color, count: reactionUsers.size, message: reactionMessage });

    const message = new CustomEmbed(config.message, parser);

    if (await StarMessage.findOne({ messageId: reaction.message.id })) return;

    const newMsg = await starboardChannel.send({
      embeds: [message],
      content: parser.parse(config.message.content),
    });
    await newMsg.react(config.emoji);

    if (config.notifyUser) {
      await reaction.message.reply({
        embeds: [
          new Embed('#416683')
          .setDescription('Your message has received enough stars to be featured in the star channel! Go check it out here: ' + starboardChannel.toString())
        ]
      });
    }

    new StarMessage({
      messageId: reaction.message.id,
      starboardMessageId: newMsg.id,
      starboardId: starboardChannel.id,
      stars: reactionUsers.size,
      channelId: reaction.message.channel.id,
      userId: user.id,
      guildId: reaction.message.guild.id,
      date: new Date().getTime(),
    }).save();
  },
};
