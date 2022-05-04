const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');
const { reportDis, reportNoChannel, reportNoReport } = require('../../embeds/support');

module.exports = {
    name: "report",
    description: "Report a user",
    options: [
        {
            name: "report",
            description: "Your Report",
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
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
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


            if (guildDatabase.reportEnabled === "false") return interaction.reply({ embeds: [reportDis] }).catch(err => console.log(err));

            const reportsChannel = interaction.guild.channels.cache.get(guildDatabase.reportChannelID);
            if (!reportsChannel) return interaction.reply({ embeds: [reportNoChannel] }).catch(err => console.log(err));

            const content = interaction.options.getString('report');
            if (!content) return interaction.reply({ embeds: [reportNoReport] }).catch(err => console.log(err));

            const reportSucces = new MessageEmbed().setDescription(":white_check_mark: Succesfully sent your report!").addField("Report", `${content}`).setColor(COLOR_MAIN);
            interaction.reply({ ephemeral: true, embeds: [reportSucces] }).catch(err => console.log(err));

            const embed = new MessageEmbed()
                .setColor(COLOR_MAIN)
                .setTitle("New Report")
                .addField("Reported By:", `${interaction.user}`, true)
                .addField("Report", `${content}`)
                
                .setFooter(`${interaction.guild.name}`)
            reportsChannel.send({ embeds: [embed] }).catch(err => console.log(err));

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}