const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const User = require('../../models/guild');
const {errorMain, addedDatabase, kickNoPermsClient, kickNoUser, kickNoPermsUser, kickImpossible} = require('../../files/embeds');


module.exports = {
    name: "kick",
    description: "This command allows you to kick a user from the guild your in.",
    permission: "KICK_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "A user to ban",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "A reason to ban the user (optional)",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {

        const member = interaction.options.getMember('user');
        const reasonRaw = interaction.options.getString('reason');
        let reason = "No reason specified.";

        if (!member) return interaction.reply({embeds: [kickNoUser]});
        if (reasonRaw) reason = reasonRaw;

        const userKicked = new discord.MessageEmbed()
            .setTitle("User Kicked")
            .setDescription(`${member} was kicked.\n**Reason:** ${reason}`)
            .setColor(colors.KICK_COLOR)

        member.kick(reason).catch(err => interaction.channel.send({ embeds: [kickImpossible] }));
        interaction.reply({ embeds: [userKicked]}).catch(err => interaction.followUp("There was an error! The your reason for kick probably exceeded the 1024 character limit."))
        
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
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 1,
                    banCount: 0
                });

                await newUser.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            } else {
                User.updateOne({
                    warnCount: User.kickCount + 1
                })
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            };
        });

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

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.KICK_COLOR)
                .setTitle('User Kicked')
                .addField('Username', `${member.user.username}`)
                .addField('User ID', `${member.id}`)
                .addField('Kicked by', `${interaction.user}`)
                .addField('Reason', `${reason}`);
            logChannel.send({ embeds: [embed], split: true }).catch(err => logChannel.send("There was an error! The reason for kicking probably exceeded the 1024 character limit."));
        } else {
            return;
        }

    }
}