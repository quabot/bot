const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const config = require('../../files/config.json');

const { errorMain, unmuteNoUser, unmuteUserNoPerms, unmuteBotNoRoles, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "unmute",
    description: "By using this command you will be able to unmute any user in your guild.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "The user to unmute.",
            type: "USER",
            required: true,
        },
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

        let mutedRoleName = settings.mutedRoleName;
        let mainRoleName = settings.mainRoleName;

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

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
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