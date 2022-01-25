const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { reportNoChannel, reportSucces, reportNoContent, reportsDisabled, errorMain, addedDatabase, reportNoUser, reportNoSelf } = require('../../files/embeds');

module.exports = {
    name: "report",
    description: "Report a user",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to report",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for reporting",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {
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
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Closed Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        swearEnabled: false,
transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });
            if (guildDatabase.reportEnabled === "false") return interaction.reply({ embeds: [reportsDisabled] });
            const reportsChannel = interaction.guild.channels.cache.get(guildDatabase.reportChannelID);
            if (!reportsChannel) return interaction.reply({ embeds: [reportNoChannel] });

            const user = interaction.options.getMember('user');
            if (!user) return interaction.reply({ embeds: [reportNoUser] })
            if (user.id === interaction.user.id) return interaction.reply({ embeds: [reportNoSelf] });

            const content = interaction.options.getString('reason');
            if (!content) return interaction.reply({ embeds: [reportNoContent] });

            interaction.reply({ ephemeral: true, embeds: [reportSucces] });

            const embed = new discord.MessageEmbed()
                .setColor(colors.REPORT_COLOR)
                .setTitle("New User Report")
                .addField("User:", `${user}`, true)
                .addField("Reported By:", `${interaction.user}`, true)
                .addField("Reason for reporting:", `${content}`)
                .setTimestamp()
                .setFooter(`${interaction.guild.name}`)
            reportsChannel.send({ embeds: [embed] });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new discord.MessageEmbed()
                    .setColor(colors.REPORT_COLOR)
                    .setTitle('User Reported')
                    .addField('User', `${user}`)
                    .addField('Reported By', `${interaction.user}`)
                    .addField('Reason', `${content}`)
                logChannel.send({ embeds: [embed] });
            } else {
                return;
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
        
    }
}