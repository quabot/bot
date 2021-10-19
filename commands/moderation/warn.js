const discord = require("discord.js");
const mongoose = require('mongoose');

const User = require('../../models/user');
const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const { errorMain, warnNoPerms, warnNoUserToWarn, warnNotHigherRole, addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "warn",
    description: "This command allows you to warn a user.",
    permission: "KICK_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "The user to warn.",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "The reason to warn the user.",
            type: "STRING",
            required: false,
        },
    ],
    async execute(client, interaction) {

        let reason = "No reason specified";

        const member = interaction.options.getMember('user');

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
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
        
                return interaction.reply({ embeds: [addedDatabase] });
            }
        });
        const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);

        if (!member)
            return interaction.reply({ embeds: [warnNoUserToWarn] });

        if (interaction.member.roles.highest.position < member.roles.highest.position)
            return interaction.reply({ embeds: [warnNotHigherRole] });

        User.findOne({
            guildID: interaction.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err)

                if (!user) {
                    const newUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        guildID: interaction.guild.id,
                        userID: member.id,
                        muteCount: 0,
                        warnCount: 0,
                        kickCount: 0,
                        banCount: 1
                    });

                    await newUser.save()
                        .catch(err => {
                            console.error(err);
                            interaction.followUp({ embeds: [errorMain] });
                        })
                } else {
                    User.updateOne({
                        warnCount: User.warnCount + 1
                    })
                        .catch(err => {
                            console.error(err);
                            interaction.followUp({ embeds: [errorMain] });
                        })
                };
        });

        const rRaw = interaction.options.getString('reason');
        if (rRaw.length > 1) reason = rRaw;

        const warnedEmbed = new discord.MessageEmbed()
            .setDescription(`${member} was warned\nReason: **${reason}**`)
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [warnedEmbed] });

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.WARN_COLOR)
                    .setTitle('User Warned')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Warned by', `${interaction.user}`)
                    .addField('Reason', `${reason}`);

                return logChannel.send({ embeds: [embed] });
            };
        }
    }
}