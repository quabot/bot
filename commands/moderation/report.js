const discord = require('discord.js');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const { reportNoChannel, reportSucces, reportNoContent, reportsDisabled, errorMain, addedDatabase, reportNoUser, reportNoSelf } = require('../../files/embeds');

module.exports = {
    name: "report",
    description: "This command allows you to report a user.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "The user to report.",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "The reason for reporting that user.",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });
        
                newGuild.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
        
                return interaction.followUp({ embeds: [addedDatabase] });
            }
        });
        if (settings.reportEnabled === "false") return interaction.reply({ embeds: [reportsDisabled] });
        const reportsChannel = interaction.guild.channels.cache.get(settings.reportChannelID);
        if (!reportsChannel) return interaction.reply({ embeds: [reportNoChannel] });

        const user = interaction.options.getMember('user');
        if (!user) return interaction.reply({ embeds: [reportNoUser] })
        if (user.id === interaction.user.id) return interaction.reply({ embeds: [reportNoSelf] });

        const content = interaction.options.getString('reason');
        if (!content) return interaction.reply({ embeds: [reportNoContent] });

        interaction.reply({ embeds: [reportSucces] });

        const embed = new discord.MessageEmbed()
            .setColor(colors.REPORT_COLOR)
            .setTitle("New User Report")
            .addField("User:", `${user}`, true)
            .addField("Reported By:", `${interaction.user}`, true)
            .addField("Reason for reporting:", `${content}`)
            .setTimestamp()
            .setFooter(`${interaction.guild.name}`)
        reportsChannel.send({ embeds: [embed] });

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
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
    }
}