const discord = require('discord.js');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const User = require('../../models/guild');
const mongoose = require('mongoose');

const {errorMain, addedDatabase, banNoPermsBot, banNoPermsUser, banNoUser, banImpossible} = require('../../files/embeds');

module.exports = {
    name: "ban",
    description: "This command allows you to permanently ban a user from the guild your in.",
    permission: "BAN_MEMBERS",
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

        if (!member) return interaction.reply({embeds: [banNoUser]});
        if (reasonRaw) reason = reasonRaw;
;
        const userBanned = new discord.MessageEmbed()
            .setTitle(":white_check_mark: User Banned")
            .setDescription(`${member} was banned.\n**Reason:** ${reason}`)
            .setColor(colors.COLOR)

        member.ban({ reason: reason }).catch(err => {
            interaction.reply({embeds: [banImpossible]});
            let reason = ":x: Ban failed.";
            return;
        }); 
        interaction.reply({embeds: [userBanned], split: true}).catch(err => console.log("There was an error! The reason probably exceeded the 1024 character limit."));        ;
        
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
                    kickCount: 0,
                    banCount: 1
                });

                await newUser.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
            } else {
                User.updateOne({
                    warnCount: User.warnCount + 1
                })
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
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
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
        
                return interaction.reply({ embeds: [addedDatabase] });
            }
        });

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.BAN_COLOR)
                .setTitle('User Banned')
                .addField('Username', `${member.user.username}`)
                .addField('User ID', `${member.id}`)
                .addField('Banned by', `${interaction.user}`)
                .addField('Reason', `${reason}`);
            logChannel.send({ embeds: [embed], split: true }).catch(err => logChannel.send("There was an error! The reason probably exceeded the 1024 character limit."));            ;
        } else {
            return;
        }

    }
}