const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { banNoUser, banImpossible } = require('../../embeds/moderation');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "unban",
    description: "Unban a user.",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "userid",
            description: "User-ID to unban",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {
            const userid = interaction.options.getString('userid');

            let member = await interaction.guild.bans.fetch(userid).catch(err => {
                const noUnbanUser = new MessageEmbed()
                    .setDescription(`That user doesn't exist/isn't banned!`)
                    .setColor(COLOR_MAIN)
                interaction.reply({ embeds: [noUnbanUser] }).catch(err => console.log("Error!"));
                return;
            });

            const userUnbanned = new MessageEmbed()
                .setTitle(":white_check_mark: User Unbanned")
                .setDescription(`<@${userid}> was unbanned.`)
                .setColor(COLOR_MAIN)
                .setFooter(`User-ID: ${userid}`);
            interaction.guild.members.unban(userid).catch(err => console.log("Error!"));

            interaction.reply({ embeds: [userUnbanned] }).catch(err => console.log("Error!"));

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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.logEnabled) {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID)
                if (!logChannel) return;

                const embed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle('🔨 User Unbanned')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Unbanned by', `${interaction.user}`)
                    .addField('Reason', `${reason}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed], split: true }).catch(err => console.log("Error!"));
            } else {
                return;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: ban`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}