const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain, addedDatabase } = require('../../files/embeds.js');
const { buttonsLevels, buttonsLogs, buttonsRole, buttonsMusic, buttonsSwear, buttonsReport, buttonsSuggest, buttonsPoll, buttonsTicket, buttonsWelcome } = require('../../files/interactions/toggleConfig');
const { noPermission } = require('../../files/embeds/toggleConfig');

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

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "levels_toggle") {
                    const levels = new MessageEmbed()
                        .setTitle("Toggle Levels")
                        .setDescription("Use the buttons to enable/disable the levels system.")
                        .addField("Current value", `${guildDatabase.levelEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [levels], components: [buttonsLevels] })
                }

                if (interaction.values[0] === "swear_toggle") {
                    const swear = new MessageEmbed()
                        .setTitle("Toggle Swear Filter")
                        .setDescription("Use the buttons to enable/disable the swear filter.")
                        .addField("Current value", `${guildDatabase.swearEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [swear], components: [buttonsSwear] })
                }

                if (interaction.values[0] === "log_toggle") {
                    const logs = new MessageEmbed()
                        .setTitle("Toggle Logs")
                        .setDescription("Use the buttons to enable/disable guild events logging.")
                        .addField("Current value", `${guildDatabase.logEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [logs], components: [buttonsLogs] })
                }

                if (interaction.values[0] === "role_toggle") {
                    const role = new MessageEmbed()
                        .setTitle("Toggle Join Roles")
                        .setDescription("Use the buttons to enable/disable join roles.")
                        .addField("Current value", `${guildDatabase.roleEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [role], components: [buttonsRole] })
                }

                if (interaction.values[0] === "music_toggle") {
                    const music = new MessageEmbed()
                        .setTitle("Toggle Music")
                        .setDescription("Use the buttons to enable/disable all music commands.")
                        .addField("Current value", `${guildDatabase.musicEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [music], components: [buttonsMusic] });
                }

                if (interaction.values[0] === "report_toggle") {
                    const reports = new MessageEmbed()
                        .setTitle("Toggle Reports")
                        .setDescription("Use the buttons to enable/disable reports for this guild.")
                        .addField("Current value", `${guildDatabase.reportEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");
                        
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [reports], components: [buttonsReport] });
                }

                if (interaction.values[0] === "suggest_toggle") {
                    const suggest = new MessageEmbed()
                        .setTitle("Toggle Suggestions")
                        .setDescription("Use the buttons to enable/disable suggestions for this guild.")
                        .addField("Current value", `${guildDatabase.suggestEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [suggest], components: [buttonsSuggest] });
                }

                if (interaction.values[0] === "tickets_toggle") {
                    const ticket = new MessageEmbed()
                        .setTitle("Toggle Tickets")
                        .setDescription("Use the buttons to enable/disable tickets for this guild.")
                        .addField("Current value", `${guildDatabase.ticketEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [ticket], components: [buttonsTicket] });
                }

                if (interaction.values[0] === "welcome_toggle") {
                    const welcome = new MessageEmbed()
                        .setTitle("Toggle Welcome Messages")
                        .setDescription("Use the buttons to enable/disable welcome messages for this guild.")
                        .addField("Current value", `${guildDatabase.welcomeEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [welcome], components: [buttonsWelcome] });
                }

                if (interaction.values[0] === "poll_toggle") {
                    const poll = new MessageEmbed()
                        .setTitle("Toggle Polls")
                        .setDescription("Use the buttons to enable/disable polls for this guild.")
                        .addField("Current value", `${guildDatabase.pollsEnabled}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ ephemeral: true, embeds: [poll], components: [buttonsPoll] });
                }
            }



        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}