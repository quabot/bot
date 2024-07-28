import { Client } from '@classes/discord';
import { StarMessagesParser } from '@classes/parsers';
import { getStarMessagesConfig } from '@configs/getStarMessagesConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import StarMessage from '@schemas/StarMessage';
import type { CommandArgs } from '@typings/functionArgs';
import { PermissionFlagsBits } from 'discord.js';

export default {
  parent: 'star-messages',
  name: 'add',

  async execute({ interaction, color }: CommandArgs, client: Client) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getStarMessagesConfig(interaction.guildId ?? "", client);
    if (!config) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('This server does not have the star messages module config!'),
      ],
    });

    if (!config.enabled) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('The star messages module is not enabled in this server!'),
      ],
    });

    const starMessagesChannel = interaction.guild?.channels.cache.get(config.channel) as any;
    if (!starMessagesChannel) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('Could not find the star messages channel!'),
      ],
    });

    // check perms (min Manage Messages)
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('You do not have the required permissions to use this command!'),
      ],
    });

    const messageUrl = interaction.options.getString('message-url', true);
    if (!messageUrl) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('You need to provide a message URL!'),
      ],
    });

    if (!interaction.channel) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('This command can only be used in a guild!'),
      ],
    });

    if (!interaction.channel.isTextBased()) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('This command can only be used in text channels!'),
      ],
    });

    const ids = messageUrl.match(/\d+/g);
    if (!ids) return;

    const channel = interaction.guild?.channels.cache.get(ids[1]);
    if (!channel) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('Could not find the channel!'),
      ],
    });
    if (!channel.isTextBased()) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('The channel is not a text channel!'),
      ],
    });

    await channel.messages.fetch(ids[2]).then(async (message) => {
      if (!message) return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Could not find the message!'),
        ],
      });

      const previous = await StarMessage.findOne({ messageId: message.id, guildId: message.guild.id });
      if (previous) return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('This message is already in the star channel!'),
        ],
      });


      const member = interaction.guild?.members.cache.get(message.author.id);
      if (!member) return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Could not find the member!'),
        ],
      });

      const reactionUsers = await message.reactions.cache.get('⭐')?.users.fetch();

      const parser = new StarMessagesParser({ channel: starMessagesChannel, emoji: config.emoji, member, color, count: reactionUsers ? reactionUsers.size : 0, message });

      const customMessage = new CustomEmbed(config.message, parser);

      const newMsg = await starMessagesChannel.send({
        embeds: [customMessage],
        content: parser.parse(config.message.content),
      });
      await newMsg.react(config.emoji);

      if (config.notifyUser) {
        await message.reply({
          embeds: [
            new Embed(color)
              .setDescription('Your message has been added to the star channel! Go check it out here: ' + starMessagesChannel.toString())
          ]
        });
      }

      await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Message added to the starboard!'),
        ],
      });

      new StarMessage({
        messageId: message.id,
        starboardMessageId: newMsg.id,
        starboardId: starMessagesChannel.id,
        stars: reactionUsers ? reactionUsers.size : 0,
        channelId: message.channel.id,
        userId: member.id,
        guildId: message.guild.id,
        date: new Date().getTime(),
      }).save();

    }).catch(async () => {
      await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Could not find the message!'),
        ],
      });
    });
  },
};
