const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { kickImpossible, kickNoUser } = require('../../embeds/moderation');
const { COLOR_MAIN } = require('../../files/colors.json');

const unable = new MessageEmbed()
    .setDescription(`Could not send a DM to that user.`)
    .setColor(COLOR_MAIN);

module.exports = {
    name: "warn",
    description: "Warn a user.",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "user",
            description: "User to warn",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Reason for warning",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {


            let reason = "No reason specified";

            const reasonRaw = interaction.options.getString('reason');
            if (reasonRaw) reason = reasonRaw;

            const member = interaction.options.getMember('user');

            if (!member)
                return interaction.reply({ content: kickNoUser }).catch(err => console.log(err));

            if (interaction.member.roles.highest.position < member.roles.highest.position)
                return interaction.reply({ embeds: [kickImpossible] }).catch(err => console.log(err));

            const rRaw = interaction.options.getString('reason');
            if (rRaw.length > 1) reason = rRaw;
            
            const User = require('../../schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        typeScore: 0,
                        kickCount: 0,
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 0,
                        afk: false,
                        afkStatus: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            const warnedEmbed = new MessageEmbed()
                .setDescription(`${member} was warned\nReason: **${reason}**`)
                .setFooter(`Warn-ID: ${userDatabase.warnCount + 1}`)
                .setColor(COLOR_MAIN);
            interaction.reply({ embeds: [warnedEmbed] }).catch(err => console.log(err));
            const youWereWarned = new MessageEmbed()
                .setDescription(`You were warned on one of your servers, **${interaction.guild.name}**.`)
                .addField("Warned By", `${interaction.user}`)
                .addField("Reason", `${reason}`)
                .setFooter(`Warn-ID: ${userDatabase.warnCount + 1}`)
                .setColor(COLOR_MAIN);
            member.send({ embeds: [youWereWarned] }).catch(e => {
                interaction.channel.send({ embeds: [unable] }).catch(err => console.log(err));
            });


            await userDatabase.updateOne({
                warnCount: userDatabase.warnCount + 1
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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Warns = require('../../schemas/WarnSchema');
            const newWarns = new Warns({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                warnReason: reason,
                warnTime: new Date().getTime(),
                warnId: userDatabase.warnCount + 1,
                warnedBy: interaction.user.id,
                warnChannel: interaction.channel.id,
                active: true,
            });
            newWarns.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [error] });
                });

            if (!guildDatabase) return;
            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
            if (guildDatabase.logEnabled === "true") {
                if (!logChannel) {
                    return
                } else {
                    const embed = new MessageEmbed()
                        .setColor(`ORANGE`)
                        .setTitle('User Warned')
                        .addField('Username', `${member.user.username}`)
                        .addField('User ID', `${member.id}`)
                        .addField('Warned by', `${interaction.user}`)
                        .addField('Reason', `${reason}`);

                    return logChannel.send({ embeds: [embed] }).catch(err => console.log(err));
                };
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: warn`)] }).catch(err => console.log(err));;
            return;
        }
    }
}