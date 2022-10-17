const {
    Interaction,
    Client,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
} = require('discord.js');
const Giveaway = require('../../../structures/schemas/GiveawaySchema');
const { endGiveaway } = require('../../../structures/functions/guilds');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: 'end',
    command: 'giveaway',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        const id = interaction.options.getInteger('id');

        await interaction.deferReply({ ephemeral: true });

        const giveaway = await Giveaway.findOne({
            guildId: interaction.guildId,
            giveawayID: id,
        });

        if (!giveaway)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, "Couldn't find that giveaway in our records!")],
                })
                .catch(e => {});

        if (giveaway.ended)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'That giveaway has ended already!')],
                })
                .catch(e => {});

        await endGiveaway(client, giveaway, color);

        interaction
            .editReply({
                embeds: [await generateEmbed(color, 'Ending the giveaway!')],
            })
            .catch(e => {});
    },
};
