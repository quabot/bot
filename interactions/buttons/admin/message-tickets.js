const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    id: "message-tickets",
    permission: PermissionFlagsBits.Administrator,
    async execute(interaction, client, color) {

        const TicketConfig = require('../../../structures/schemas/TicketConfigSchema');
        const ticketConfigDatabase = await TicketConfig.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newTicketConfig = new TicketConfig({
                    guildId: interaction.guild.id,
                    ticketCategory: "none",
                    ticketClosedCategory: "none",
                    ticketEnabled: true,
                    ticketStaffPing: true,
                    ticketTopicButton: true,
                    ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                })
                newTicketConfig.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new EmbedBuilder().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { });


        if (!ticketConfigDatabase) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`We added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (ticketConfigDatabase.ticketEnabled === false) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`The tickets module is disabled in this server.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));


        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("You can dismiss this message.")
            ], ephemeral: true
        }).catch((err => { }));

        interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Create ticket")
                    .setDescription("Click on the button below this message to create a ticket.")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("create-ticket")
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("🎫 Ticket")
                    )
            ]
        }).catch((err => { }));

    }
}
