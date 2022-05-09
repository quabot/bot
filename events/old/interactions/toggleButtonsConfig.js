const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { noPermission } = require('../../embeds/config');
const { error, added } = require('../../embeds/general.js');
const { disabled } = require('../../interactions/config');
const { swearEnabled, swearDisabled, channelLevelDisabled, welcomeDisabled, welcomeEnabled, pollsDisabled, pollEnabled, levelEnabled, levelDisabled, logEnabled, logDisabled, roleEnabled, roleDisabled, ticketDisabled, ticketEnabled, musicDisabled, musicEnabled, reportEnabled, reportDisabled, suggestDisabled, suggestEnabled } = require('../../embeds/toggleConfig');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });


            if (interaction.isButton()) {
                if (interaction.customId === "enableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    await guildDatabase.updateOne({
                        levelEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [levelEnabled], components: [disabled] }).catch(err => console.log(err));
                }

                if (interaction.customId === "disableLevel") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    await guildDatabase.updateOne({
                        levelEnabled: false,
                        pollEnabled: true,
                    });
                    interaction.update({ ephemeral: true, embeds: [levelDisabled], components: [disabled] }).catch(err => console.log(err));
                }

                if (interaction.customId === "enableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    await guildDatabase.updateOne({
                        logEnabled: true
                    });
                    interaction.update({ ephemeral: true, embeds: [logEnabled], components: [disabled] }).catch(err => console.log(err));
                }

                if (interaction.customId === "disableLogs") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    await guildDatabase.updateOne({
                        logEnabled: false,
                    });
                    interaction.update({ ephemeral: true, embeds: [logDisabled], components: [disabled] }).catch(err => console.log(err));
                }

                if (interaction.customId === "enableRole") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    interaction.update({ ephemeral: true, embeds: [roleEnabled], components: [disabled] }).catch(err => console.log(err));
                    await guildDatabase.updateOne({
                        roleEnabled: true
                    });
                }

                if (interaction.customId === "disableRole") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    interaction.update({ ephemeral: true, embeds: [roleDisabled], components: [disabled] }).catch(err => console.log(err));
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
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
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
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log(err));
            return;
        }
    }
}