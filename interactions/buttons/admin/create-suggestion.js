const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Modal, TextInputComponent, Message } = require('discord.js');

module.exports = {
    id: "create-suggestion",
    async execute(interaction, client, color) {

        const Guild = require('../../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    ticketCategory: "none",
                    ticketClosedCategory: "none",
                    ticketEnabled: true,
                    ticketStaffPing: true,
                    ticketTopicButton: true,
                    ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                    afkStatusAllowed: "true",
                    musicEnabled: "true",
                    musicOneChannelEnabled: "false",
                    musicChannelID: "none",
                    suggestChannelID: "none",
                    logSuggestChannelID: "none",
                    logPollChannelID: "none",
                    afkEnabled: true,
                    welcomeChannelID: "none",
                    leaveChannelID: "none",
                    levelChannelID: "none",
                    punishmentChannelID: "none",
                    pollID: 0,
                    logEnabled: true,
                    modEnabled: true,
                    levelEnabled: false,
                    welcomeEmbed: true,
                    pollEnabled: true,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                    leaveEnabled: true,
                    roleEnabled: false,
                    mainRole: "none",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                    levelCard: false,
                    levelEmbed: true,
                    levelMessage: "{user} just leveled up to level **{level}**!",
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        if (guildDatabase.suggestEnabled === "false") return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Suggestions are disabled in this server! Ask an admin to enable them with [the dashboard](https://dashboard.quabot.net).`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        console.log(guildDatabase)

        const channel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
        if (!channel) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("No suggestions channel setup! Configure this with [the dashboard](https://dashboard.quabot.net).")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const modal = new Modal()
            .setCustomId('suggestion')
            .setTitle('Leave a suggestion')
            .addComponents(
                new MessageActionRow()
                    .addComponents(
                        new TextInputComponent()
                            .setCustomId('suggestion-box')
                            .setLabel('Your suggestion')
                            .setStyle('PARAGRAPH')
                            .setMinLength(1)
                            .setMaxLength(300)
                            .setPlaceholder('More voice channels!')
                            .setRequired(true)
                    )
            );

        await interaction.showModal(modal);

    }
}