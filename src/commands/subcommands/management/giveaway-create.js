const {
    Interaction,
    Client,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
} = require('discord.js');
const { checkChannel } = require('../../../structures/functions/channel');
const { getGiveawayConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Giveaway = require('../../../structures/schemas/GiveawaySchema');
const ms = require('ms');
const { endGiveaway } = require('../../../structures/functions/guilds');

module.exports = {
    name: 'create',
    command: 'giveaway',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        const channel = interaction.options.getChannel('channel');
        let prize = interaction.options.getString('prize').slice(0, 256);
        const winners = interaction.options.getInteger('winners');
        const duration = interaction.options.getString('duration');

        await interaction.deferReply({ ephemeral: true });

        const giveawayConfig = await getGiveawayConfig(client, interaction.guildId);
        const giveawayId = giveawayConfig ? giveawayConfig.giveawayID + 1 : 1;

        if (checkChannel(channel.type) === false)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'Please enter a valid channel.')],
                })
                .catch(e => {});

        if (winners > 25 || winners < 1)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'Please enter between 1-25 winners.')],
                })
                .catch(e => {});

        if (!ms(duration))
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'Please enter a valid duration. (1h, 30min, 10s)')],
                })
                .catch(e => {});

        const endTimestamp = Math.round((new Date().getTime() + ms(duration)) / 1000);
        const msg = await channel
            .send({
                content: '**:tada: GIVEAWAY :tada:**',
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription(
                            `React with :tada: to participate!\nTime remaining: <t:${endTimestamp}:R>\nWinners: **${winners}**\nHosted by: ${interaction.user}`
                        )
                        .setTitle(`${prize}`)
                        .setTimestamp()
                        .setFooter({ text: `ID: ${giveawayId}` }),
                ],
                fetchReply: true,
            })
            .catch(e => {});
        if (!msg) return;

        msg.react('🎉');

        const newGiveaway = new Giveaway({
            guildId: interaction.guildId,
            giveawayID: giveawayId,
            winners: winners,
            prize: prize,
            msgId: msg.id,
            channelId: channel.id,
            hostId: interaction.user.id,
            endTimestampRaw: new Date().getTime() + ms(duration),
            ended: false,
        });
        newGiveaway.save();

        if (giveawayConfig) {
            giveawayConfig.giveawayID = giveawayId;
            giveawayConfig.save();
        }

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle('Created a new giveaway')
                        .setDescription(
                            `The giveaway ends in <t:${endTimestamp}:R> and is hosted in ${channel}. [Jump to Message](${msg.url})`
                        ),
                ],
            })
            .catch(e => {});

        setTimeout(async () => {
            await endGiveaway(client, newGiveaway, color);
        }, ms(duration));
    },
};
