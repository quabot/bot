const { ChatInputCommandInteraction, Client, ColorResolvable, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors } = require('discord.js');
const { getIdConfig } = require('../../../utils/configs/idConfig');
const { getReactionConfig } = require('../../../utils/configs/reactionConfig');
const { Embed } = require('../../../utils/constants/embed');
const Reaction = require('../../../structures/schemas/ReactionRole');

module.exports = {
    parent: 'reactionroles',
    name: 'list',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const config = await getReactionConfig(client, interaction.guildId);
        const ids = await getIdConfig(interaction.guildId);
        if (!config || !ids) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use. Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Reaction roles are not enabled in this server.')
            ]
        });


        const messageId = interaction.options.getString('message-id');
        const role = interaction.options.getRole('role');
        const channel = interaction.options.getChannel('channel');

        let found = await Reaction.find({
            guildId: interaction.guild.id,
        });

        if (messageId && !role && !channel)
            found = await Reaction.find({ guildId: interaction.guild.id, messageId });
        if (messageId && role && !channel)
            found = await Reaction.find({ guildId: interaction.guild.id, messageId, roleId: role.id });
        if (messageId && !role && channel)
            found = await Reaction.find({
                guildId: interaction.guild.id,
                messageId,
                channelId: channel.id,
            });

        if (role && !msg_id && !channel)
            found = await Reaction.find({ guildId: interaction.guild.id, roleId: role.id });
        if (role && msg_id && !channel)
            found = await Reaction.find({ guildId: interaction.guild.id, roleId: role.id, messageId: msg_id });
        if (role && !msg_id && channel)
            found = await Reaction.find({ guildId: interaction.guild.id, roleId: role.id, channelId: channel.id });

        if (channel && !messageId && !role)
            found = await Reaction.find({ guildId: interaction.guild.id, channelId: channel.id });
        if (channel && messageId && !role)
            found = await Reaction.find({
                guildId: interaction.guild.id,
                channelId: channel.id,
                messageId,
            });
        if (channel && !messageId && role)
            found = await Reaction.find({ guildId: interaction.guild.id, channelId: channel.id, roleId: role.id });

        if (role && msg_id && channel)
            found = await Reaction.find({
                guildId: interaction.guild.id,
                roleId: role.id,
                messageId,
                channelId: channel.id,
            });

        if (found.length === 0) return await interaction.editReply({
            embeds: [
                new Embed(color)
                .setDescription('Couldn\'t find any reaction roles with those criteria.')
            ]
        });

        const backId = 'backRR';
        const forwardId = 'forwardRR';
        const backButton = new ButtonBuilder({
            style: 'SECONDARY',
            label: 'Back',
            emoji: '⬅️',
            customId: backId,
        });
        const forwardButton = new ButtonBuilder({
            style: 'SECONDARY',
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId,
        });

        const makeEmbed = async start => {
            const current = found.slice(start, start + 3);

            return new EmbedBuilder({
                title: `Reaction roles ${start + 1}-${start + current.length}/${found.length}`,
                color: Colors.Green,
                fields: await Promise.all(
                    current.map(async item => ({
                        name: `Emoji: ${item.emoji} - Mode: ${item.type}`,
                        value: `Role: <@&${item.roleId}> - [Jump to message](https://discord.com/channels/${interaction.guild.id}/${item.channelId}/${item.messageId})`,
                    }))
                ),
            });
        };

        const canFit = found.length <= 3;
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            fetchReply: true,
            components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
        });
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0;
        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 3) : (currentIndex += 3);
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 3 < found.length ? [forwardButton] : []),
                        ],
                    }),
                ],
            });
        });
    }
};
