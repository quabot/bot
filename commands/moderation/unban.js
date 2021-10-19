const discord = require('discord.js');
const mongoose = require('mongoose');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const { errorMain, notBanned, banNoUserFound, banImpossible, addedDatabase, banNoPermsUser, unbanNoUser, banNoTime, muteNoManageRoles, muteNoPermsUser, muteNoTime, muteNoUser, banNoPermsBot } = require('../../files/embeds');


module.exports = {
    name: "unban",
    description: "This command allows you to unban a previously banned user from the guild your in.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "userid",
            description: "The userID you wish to unban.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

        const member = interaction.options.getString('userid');

        if (!member) return interaction.reply({ embeds: [unbanNoUser] });
        let bannedMember;
        try {
            bannedMember = await client.users.cache.get(member);
        } catch (e) {
            if (!bannedMember) return interaction.reply({ embeds: [unbanNoUser] });
        }

        try {
            await interaction.guild.bans.fetch(bannedMember);
        } catch (e) {
            interaction.reply({ embeds: [notBanned] });
            return;
        }

        try {
            interaction.guild.members.unban(member)
            const embed1 = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setDescription(`:white_check_mark: <@${member}> has been unbanned.`)
            interaction.reply({ embeds: [embed1] })
        } catch (e) {
            console.log(e.message)
        }

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: interaction.guild.id,
                    guildName: interaction.guild.name,
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

        const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.UNBAN_COLOR)
                    .setTitle('User Unban')
                    .addField('Username', `<@${member}>`)
                    .addField('User ID', `${member}`)
                    .addField('Unbanned by', `${interaction.user}`)
                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}
