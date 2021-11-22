const discord = require('discord.js');
const ms = require('ms');
const mongoose = require('mongoose');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const User = require('../../models/user');
const colors = require('../../files/colors.json');
const { errorMain, banImpossible, addedDatabase, banNoPermsUser, banNoUser, banNoTime, muteNoManageRoles, muteNoPermsUser, muteNoTime, muteNoUser } = require('../../files/embeds');

module.exports = {
    name: "tempmute",
    description: "This command allows you to temporarily mute a user on the guild you're in.",
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
        {
            name: "time",
            description: "The time to mute the user.",
            type: "STRING",
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

        let mutedRoleName = settings.mutedRoleName;
        let mainRoleName = settings.mainRoleName;

        const target = interaction.options.getMember('user');
        const member = interaction.options.getMember('user');

        if (!target) return interaction.reply({ embeds: [muteNoUser] });

        let mainRole = interaction.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
        let muteRole = interaction.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

        let memberTarget = interaction.guild.members.cache.get(target.id);

        const time = interaction.options.getString('time');

        if (!time) return interaction.reply({ embeds: [muteNoTime] });

        if (ms(time)) {
            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            const mutedUser4 = new discord.MessageEmbed()
                .setTitle(":white_check_mark: User tempmuted!")
                .setDescription(`<@${memberTarget.user.id}> has been tempmuted for ${time}`)
                .setColor(colors.COLOR);
            interaction.reply({ embeds: [mutedUser4] });
            setTimeout(function () {
                memberTarget.roles.add(mainRole.id);
                memberTarget.roles.remove(muteRole.id);
                const mutedUser23 = new discord.MessageEmbed()
                    .setTitle(":white_check_mark: User auto-unmuted")
                    .setDescription(`<@${memberTarget.user.id}> has been unmuted after ${time}!`)
                    .setColor(colors.COLOR);
                interaction.channel.send({ embeds: [mutedUser23] });
            }, ms(time));
        } else {
            return interaction.reply({ embeds: { muteNoTime } });
        }

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
                    .catch(err => console.error(err));
            } else {
                user.updateOne({
                    muteCount: user.muteCount + 1
                })
                    .catch(err => console.error(err));
            };
        });

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.MUTE_COLOR)
                .setTitle('User Tempmuted')
                .addField('User', `${target.tag}`)
                .addField('User ID', `${target.id}`)
                .addField('Muted by', `${interaction.user}`)
                .addField('Time', `${time}`)
            logChannel.send({ embeds: [embed] });
        } else {
            return;
        }
    }
}