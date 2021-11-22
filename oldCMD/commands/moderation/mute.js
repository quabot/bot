const discord = require('discord.js');
const mongoose = require('mongoose');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const User = require('../../models/user');

const {errorMain, addedDatabase, muteNoUser, muteNoRoleManage, muteNoPermsUser} = require('../../files/embeds');

module.exports = {
    name: "mute",
    description: "By using this command you will be able to mute any user in your guild.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "The user to mute.",
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
        const member = interaction.options.getMember('user');

        if(!target) return interaction.reply({ embeds: [muteNoUser]});

        let mainRole = interaction.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
        let muteRole = interaction.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

        let memberTarget = interaction.guild.members.cache.get(target.id);

        memberTarget.roles.remove(mainRole.id);
        memberTarget.roles.add(muteRole.id);
        const mutedUser = new discord.MessageEmbed()
            .setTitle("Succesfull mute! :white_check_mark:")
            .setDescription(`<@${memberTarget.user.id}> has been muted`)
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [mutedUser]});

        User.findOne({
            guildID: interaction.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!user) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id,
                    userID: member.id,
                    muteCount: 1,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 0
                });

                await newUser.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            } else {
                User.updateOne({
                    warnCount: User.warnCount + 1
                })
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            };
        });

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.MUTE_COLOR)
                .setTitle('User Muted')
                .addField('Username', `${target}`)
                .addField('User ID', `${target.id}`)
                .addField('Muted by', `${interaction.user}`)
            logChannel.send({ embeds: [embed]});
        } else {
            return;
        }
    }
}