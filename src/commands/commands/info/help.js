const {
    Interaction,
    EmbedBuilder,
    Client,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder,
    SlashCommandBuilder,
} = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of all the bot commands.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const funList = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/commands/fun/*.js`))
            .map(file => {
                const item = require(file);
                return `**/${item.data.name}** - ${item.data.description}`;
            })
            .join('\n');
        const funEmbed = new EmbedBuilder()
            .setTitle(`Fun Commands`)
            .setDescription(
                `Play games, get memes and much more.
            ${funList}`
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const infoList = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/commands/info/*.js`))
            .map(file => {
                const item = require(file);
                return `**/${item.data.name}** - ${item.data.description}`;
            })
            .join('\n');
        const infoEmbed = new EmbedBuilder()
            .setTitle(`Info Commands`)
            .setDescription(
                `Get QuaBot's ping, the membercount and much more.
                ${infoList}`
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const managementList = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/commands/management/*.js`))
            .map(file => {
                const item = require(file);
                return `**/${item.data.name}** - ${item.data.description}`;
            })
            .join('\n');
        const managementEmbed = new EmbedBuilder()
            .setTitle(`Management Commands`)
            .setDescription(
                `Purge a channel, create a poll and so much more.
                    ${managementList}`
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const miscList = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/commands/misc/*.js`))
            .map(file => {
                const item = require(file);
                return `**/${item.data.name}** - ${item.data.description}`;
            })
            .join('\n');
        const miscEmbed = new EmbedBuilder()
            .setTitle(`Misc Commands`)
            .setDescription(
                `See an avatar, translate a text and so much more.
                        ${miscList}`
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const moderationList = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/commands/moderation/*.js`))
            .map(file => {
                const item = require(file);
                return `**/${item.data.name}** - ${item.data.description}`;
            })
            .join('\n');
        const moderationEmbed = new EmbedBuilder()
            .setTitle(`Moderation Commands`)
            .setDescription(
                `Ban a member, warn them and so much more.
                            ${moderationList}`
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const modulesList = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/commands/modules/*.js`))
            .map(file => {
                const item = require(file);
                return `**/${item.data.name}** - ${item.data.description}`;
            })
            .join('\n');
        const modulesEmbed = new EmbedBuilder()
            .setTitle(`Module Commands`)
            .setDescription(
                `Create a ticket, leave a suggestion and so much more.
                                ${modulesList}`
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const helpEmbeds = [funEmbed, infoEmbed, managementEmbed, miscEmbed, moderationEmbed, modulesEmbed];

        const helpComponents = [
            new ButtonBuilder().setCustomId('previous-help').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
            new ButtonBuilder().setCustomId('next-help').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
        ];

        const helpButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('previous-help').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
            new ButtonBuilder().setCustomId('next-help').setStyle(ButtonStyle.Secondary).setEmoji('▶️')
        );

        let page = 0;

        const currentPage = await interaction
            .editReply({
                embeds: [helpEmbeds[page].setFooter({ text: `Page ${page + 1} / ${helpEmbeds.length}` })],
                components: [helpButtons],
                fetchReply: true,
            })
            .catch(e => {});

        const filter = i => i.customId === 'previous-help' || i.customId === 'next-help';

        const collector = await currentPage.createMessageComponentCollector({
            filter,
            time: 40000,
        });

        collector.on('collect', async i => {
            switch (i.customId) {
                case 'previous-help':
                    page = page > 0 ? --page : helpEmbeds.length - 1;
                    break;
                case 'next-help':
                    page = page + 1 < helpEmbeds.length ? ++page : 0;
                    break;
            }
            await i.deferUpdate();
            await i
                .editReply({
                    embeds: [helpEmbeds[page].setFooter({ text: `Page ${page + 1} / ${helpEmbeds.length}` })],
                    components: [helpButtons],
                })
                .catch(e => {});
            collector.resetTimer();
        });

        collector.on('end', (_, reason) => {
            if (reason !== 'messageDelete') {
                const disabledRow = new ActionRowBuilder().addComponents(
                    helpComponents[0].setDisabled(true),
                    helpComponents[1].setDisabled(true)
                );
                currentPage
                    .edit({
                        embeds: [helpEmbeds[page].setFooter({ text: `Page ${page + 1} / ${helpEmbeds.length}` })],
                        components: [disabledRow],
                    })
                    .catch(e => {});
            }
        });
    },
};
