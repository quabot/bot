const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const Ticket = require('../../../structures/schemas/TicketSchema');
const { getTicketConfig } = require('../../../structures/functions/config');

module.exports = {
    id: "delete-ticket",
    /**
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    async execute(client, interaction, color) {

        const ticketConfig = await getTicketConfig(client, interaction.guildId);
        await interaction.deferReply().catch((err => { }));


        if (!ticketConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new database record. Please click that button again.")]
        }).catch((err => { }));

        if (ticketConfig.ticketEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Tickets are disabled in this server.")]
        }).catch((err => { }));

        const ticketFound = await Ticket.findOne({
            channelId: interaction.message.channel.id,
        }).clone().catch(function (err) { });

        if (!ticketFound) return interaction.editReply({
            embeds: [await generateEmbed(color, "You are not inside of an existing ticket.")]
        }).catch((err => { }));;

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (ticketFound.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;

        if (!valid) return interaction.editReply({
            embeds: [await generateEmbed(color, "You cannot manage this ticket. You must be added first.")]
        }).catch((err => { }));


        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.editReply({
            embeds: [await generateEmbed(color, "Couldn't find the ticket channel; this shouldn't be possible. Please make a new ticket or [contact our support](https://discord.quabot.net).")]
        }).catch((err => { }));

        const msg = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Are you sure you want to delete this ticket?")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('cancel-ticket')
                            .setLabel('🚫 Cancel')
                            .setStyle(ButtonStyle.Danger)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm-ticket')
                            .setLabel('✅ Confirm')
                            .setStyle(ButtonStyle.Success)
                    )
            ], fetchReply: true
        }).catch((err => { }));

        if (!msg) return;
        const collectorRepeat = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

        collectorRepeat.on('collect', async interaction => {
            if (interaction.customId === "cancel-ticket") {

                interaction.message.edit({
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('cancel-ticket')
                                .setLabel('🚫 Cancel')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('confirm-ticket')
                                .setLabel('✅ Confirm')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true)
                        )
                    ]
                })
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription("Cancelled the ticket deletion.")
                    ]
                }).catch((err => { }));

                return;

            }
            if (interaction.customId === "confirm-ticket") {

                const discordTranscripts = require('discord-html-transcripts');
                const attachment = await discordTranscripts.createTranscript(channel, {
                    limit: -1,
                    minify: true,
                    saveImages: false,
                    useCND: true
                });


                await Ticket.findOneAndDelete({
                    channelId: interaction.message.channel.id,
                }).clone().catch(function (err) { });

                channel.delete();

                const logChannel = interaction.guild.channels.cache.get(`${ticketConfig.ticketChannelID}`);
                if (!logChannel) return;
                if (ticketConfigDatabase.ticketLogs === false) return;
                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Ticket Deleted")
                    .setDescription("Ticket transcript added as attachment.")
                    .addFields(
                        { name: "User", value: `${interaction.user}`, inline: true },
                        { name: "Channel", value: `#${interaction.channel.name}`, inline: true }
                    );

                logChannel.send({ embeds: [embed], files: [attachment] }).catch((err => { }));

            }
        });
    }
}
