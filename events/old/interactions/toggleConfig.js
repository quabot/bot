const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general.js');
const { buttonsLevels, buttonsLogs, buttonsRole, buttonsMusic, buttonsSwear, buttonsReport, buttonsSuggest, buttonsPoll, buttonsTicket, buttonsWelcome } = require('../../interactions/toggleConfig');
const { noPermission } = require('../../embeds/config');

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
                    modEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "none",
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
                            interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(( err => { } ))
                }
            }).clone().catch(function (err) { console.log(err) });

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "levels_toggle") {
                    const levels = new MessageEmbed()
                        .setTitle("Toggle Levels")
                        .setDescription("Use the buttons to enable/disable the levels system.")
                        .addField("Current value", `${guildDatabase.levelEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [levels], components: [buttonsLevels] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "swear_toggle") {
                    const swear = new MessageEmbed()
                        .setTitle("Toggle Swear Filter")
                        .setDescription("Use the buttons to enable/disable the swear filter.")
                        .addField("Current value", `${guildDatabase.swearEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [swear], components: [buttonsSwear] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "log_toggle") {
                    const logs = new MessageEmbed()
                        .setTitle("Toggle Logs")
                        .setDescription("Use the buttons to enable/disable guild events logging.")
                        .addField("Current value", `${guildDatabase.logEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [logs], components: [buttonsLogs] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "role_toggle") {
                    const role = new MessageEmbed()
                        .setTitle("Toggle Join Roles")
                        .setDescription("Use the buttons to enable/disable join roles.")
                        .addField("Current value", `${guildDatabase.roleEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [role], components: [buttonsRole] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "music_toggle") {
                    const music = new MessageEmbed()
                        .setTitle("Toggle Music")
                        .setDescription("Use the buttons to enable/disable all music commands.")
                        .addField("Current value", `${guildDatabase.musicEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [music], components: [buttonsMusic] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "report_toggle") {
                    const reports = new MessageEmbed()
                        .setTitle("Toggle Reports")
                        .setDescription("Use the buttons to enable/disable reports for this guild.")
                        .addField("Current value", `${guildDatabase.reportEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [reports], components: [buttonsReport] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "suggest_toggle") {
                    const suggest = new MessageEmbed()
                        .setTitle("Toggle Suggestions")
                        .setDescription("Use the buttons to enable/disable suggestions for this guild.")
                        .addField("Current value", `${guildDatabase.suggestEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [suggest], components: [buttonsSuggest] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "tickets_toggle") {
                    const ticket = new MessageEmbed()
                        .setTitle("Toggle Tickets")
                        .setDescription("Use the buttons to enable/disable tickets for this guild.")
                        .addField("Current value", `${guildDatabase.ticketEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [ticket], components: [buttonsTicket] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "welcome_toggle") {
                    const welcome = new MessageEmbed()
                        .setTitle("Toggle Welcome Messages")
                        .setDescription("Use the buttons to enable/disable welcome messages for this guild.")
                        .addField("Current value", `${guildDatabase.welcomeEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [welcome], components: [buttonsWelcome] }).catch(( err => { } ))
                }

                if (interaction.values[0] === "poll_toggle") {
                    const poll = new MessageEmbed()
                        .setTitle("Toggle Polls")
                        .setDescription("Use the buttons to enable/disable polls for this guild.")
                        .addField("Current value", `${guildDatabase.pollsEnabled}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(( err => { } ))
                    interaction.reply({ ephemeral: true, embeds: [poll], components: [buttonsPoll] }).catch(( err => { } ))
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(( err => { } ))
            return;
        }
    }
}