import { Client } from '@classes/discord';
import { getStarMessagesConfig } from '@configs/getStarMessagesConfig';
import { Embed } from '@constants/embed';
import StarMessage from '@schemas/StarMessage';
import type { CommandArgs } from '@typings/functionArgs';
import { PermissionFlagsBits } from 'discord.js';

export default {
  parent: 'star-messages',
  name: 'remove',

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

      const starMessage = await StarMessage.findOne({ starboardMessageId: message.id, guildId: interaction.guildId });
      if (!starMessage) return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('This message is not in the star channel!'),
        ],
      });
      
      await StarMessage.deleteOne({ starboardMessageId: message.id, guildId: interaction.guildId });

      await message.delete().catch(() => { });

      await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Message removed from the star channel!'),
        ],
      });

    }).catch(async () => {
      await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Could not find the message!'),
        ],
      });
    });
  },
};
