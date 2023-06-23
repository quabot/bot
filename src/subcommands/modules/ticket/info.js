const {
    ChatInputCommandInteraction,
    Client,
    ColorResolvable,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const { getTicketConfig } = require('../../../utils/configs/ticketConfig');
const Ticket = require('../../../structures/schemas/Ticket');
const { Embed } = require('../../../utils/constants/embed');
const { getIdConfig } = require('../../../utils/configs/idConfig');

module.exports = {
    parent: 'ticket',
    name: 'info',
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {ColorResolvable} color
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: false });

        const config = await getTicketConfig(client, interaction.guildId);
        const ids = await getIdConfig(interaction.guildId);

        if (!config || !ids) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Tickets are disabled in this server.')
            ]
        });

        const ticket = await Ticket.findOne({
            channelId: interaction.channelId
        });
        if (!ticket) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('This is not a valid ticket.')
            ]
        });
        
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setTitle(`🎫 Ticket ${ticket.id}`)
                    .setDescription(`
                    **💻 Channel:** ${interaction.channel}
                    **📝 Created by**: <@${ticket.owner}>
                    **👥 Users:** ${ticket.users.forEach(u => `<@${u}>`) ?? 'No users have been added'}
                    **🙋‍♂️ Claimed by:** ${ticket.staff === 'none' ? 'Unclaimed' : `<@${ticket.staff}>`}
                    **🔒 Closed:** ${ticket.closed ? 'Yes' : 'No'}
                    **❓ Topic:** ${ticket.topic ?? 'No topic given'}
                    `)
            ]
        })
    }
};
