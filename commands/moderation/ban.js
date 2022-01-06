const discord = require('discord.js');

const colors = require('../../files/colors.json');
const mongoose = require('mongoose');

const { errorMain, addedDatabase, banNoUser, banImpossible } = require('../../files/embeds');

module.exports = {
    name: "ban",
    description: "Ban a member.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "User to ban",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for ban",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction) {
        try {

            
            
            const member = interaction.options.getMember('user');
            const reasonRaw = interaction.options.getString('reason');
            let reason = "No reason specified.";

            if (!member) return interaction.reply({ embeds: [banNoUser] });
            if (reasonRaw) reason = reasonRaw;

            const userBanned = new discord.MessageEmbed()
                .setTitle(":white_check_mark: User Banned")
                .setDescription(`${member} was banned.\n**Reason:** ${reason}`)
                .setColor(colors.COLOR)

            member.ban({ reason: reason }).catch(err => {
                interaction.channel.send({ embeds: [banImpossible] });
                let reason = ":x: Ban failed.";
                return;
            });
            interaction.reply({ embeds: [userBanned], split: true }).catch(err => console.log("There was an error! The reason probably exceeded the 1024 character limit."));

            const User = require('../../schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: member.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: member.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        typeScore: 0,
                        kickCount: 1,
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 0,
                        afk: false,
                        afkStatus: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });
            await userDatabase.updateOne({
                banCount: userDatabase.banCount + 1
            });

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
                        roleEnabled: true,
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

            const Bans = require('../../schemas/BanSchema');
            const newBans = new Bans({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                banReason: reason,
                banTime: new Date(),
            });
            newBans.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [errorMain] });
                });


            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new discord.MessageEmbed()
                    .setColor(colors.BAN_COLOR)
                    .setTitle('User Banned')
                    .addField('Username', `${member.user.username}`)
                    .addField('User ID', `${member.id}`)
                    .addField('Banned by', `${interaction.user}`)
                    .addField('Reason', `${reason}`)
                    .setTimestamp()
                    .setFooter("This punishment was saved to the database.")
                logChannel.send({ embeds: [embed], split: true })
            } else {
                return;
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}