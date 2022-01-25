const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { noPermission } = require('../../files/embeds/config')
const { errorMain, addedDatabase } = require('../../files/embeds.js');
const { disabled } = require('../../files/interactions/config');
const { swearEnabled, swearDisabled, channelLevelDisabled, welcomeDisabled, welcomeEnabled, pollsDisabled, pollEnabled, levelEnabled, levelDisabled, logEnabled, logDisabled, roleEnabled, roleDisabled, ticketDisabled, ticketEnabled, musicDisabled, musicEnabled, reportEnabled, reportDisabled, suggestDisabled, suggestEnabled } = require('../../files/embeds/toggleConfig');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: true,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted',
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            swearEnabled: false,
transcriptChannelID: "none"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (interaction.isButton()) {
                if (interaction.customId === "enableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        levelEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [levelEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        levelEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [levelDisabled], components: [disabled] });
                }
                
                if (interaction.customId === "enableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        logEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [logEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        logEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [logDisabled], components: [disabled] });
                }

                if (interaction.customId === "enableRole") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.update({ ephemeral: true, embeds: [roleEnabled], components: [disabled] });
                    await guildDatabase.updateOne({
                        roleEnabled: true
                    });
                }

                if (interaction.customId === "disableRole") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.update({ ephemeral: true, embeds: [roleDisabled], components: [disabled] });
                    await guildDatabase.updateOne({
                        roleEnabled: false
                    });
                }

                if (interaction.customId === "enableMusic") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        musicEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [musicEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableMusic") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        musicEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [musicDisabled], components: [disabled] });
                }

                if (interaction.customId === "enableReport") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        reportEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [reportEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableReport") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        reportEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [reportDisabled], components: [disabled] });
                }

                if (interaction.customId === "enableSuggest") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        suggestEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [suggestEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableSuggest") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        suggestEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [suggestDisabled], components: [disabled] });
                }

                if (interaction.customId === "enableTicket") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        ticketEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [ticketEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableTicket") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        ticketEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [ticketDisabled], components: [disabled] });
                }

                if (interaction.customId === "enablePoll") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        pollsEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [pollEnabled], components: [disabled] });
                }

                if (interaction.customId === "disablePoll") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        pollsEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [pollsDisabled], components: [disabled] });
                }

                if (interaction.customId === "enableWelcome") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        welcomeEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [welcomeEnabled], components: [disabled] });
                }

                if (interaction.customId === "disableWelcome") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        welcomeEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [welcomeDisabled], components: [disabled] });
                }

                if (interaction.customId === "disableSwear") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        swearEnabled: false,
transcriptChannelID: "none",
                    });
                    interaction.update({ ephemeral: true, embeds: [swearDisabled], components: [disabled] });
                }

                if (interaction.customId === "enableSwear") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    await guildDatabase.updateOne({
                        swearEnabled: true,
                    });
                    interaction.update({ ephemeral: true, embeds: [swearEnabled], components: [disabled] });
                }

                if (interaction.isButton()) {
                    if (interaction.customId === "disablelevel") {
                        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                        interaction.update({ ephemeral: true, embeds: [channelLevelDisabled] });
                        await guildDatabase.updateOne({
                            levelChannelID: "none"
                        });
    
                    }
                }
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}