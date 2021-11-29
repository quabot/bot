const discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

const { errorMain, unmuteNoUser, unmuteUserNoPerms, unmuteBotNoRoles, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "unmute",
    description: "Unmute a user",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "User to unmute",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction) {


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
                    mainRole: "Member",
                    mutedRole: "Muted"
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
                return interaction.channel.send({ embeds: [addedDatabase] });
            }
        });

        let mutedRoleName = guildDatabase.mutedRole;
        let mainRoleName = guildDatabase.mainRole;

        const target = interaction.options.getMember('user');

        if(!target) return interaction.reply({ embeds: [unmuteNoUser] });

        let mainRole = interaction.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
        let muteRole = interaction.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

        let memberTarget = interaction.guild.members.cache.get(target.id);

        memberTarget.roles.add(mainRole.id);
        memberTarget.roles.remove(muteRole.id);
        const mutedUser = new discord.MessageEmbed()
        .setTitle(':white_check_mark: User Unmuted!')
            .setDescription(`<@${memberTarget.user.id}> has been unmuted`)
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [mutedUser] });

        if (guildDatabase.logEnabled === "true") {
            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!logChannel) return;
            const embed = new discord.MessageEmbed()
                .setColor(colors.UNMUTE_COLOR)
                .setTitle('User Unmuted')
                .addField('Username', `${target}`)
                .addField('User ID', `${target.id}`)
                .addField('Unmuted by', `${interaction.user}`)
            logChannel.send({ embeds: [embed] });
        } else {
            return;
        }
    }
}