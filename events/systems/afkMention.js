const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageCreate",
    async execute(message, client, color) {
        try {

            if (!message.guild) return;
            
            let member = message.mentions.users.first();

            if (!member) return

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: message.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: message.guild.id,
                        guildName: message.guild.name,
                        logChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                    modEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        roleEnabled: false,
                        mainRole: "none",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            const User = require('../../structures/schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: member.id,
                guildId: message.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: member.id,
                        guildId: message.guild.id,
                        guildName: message.guild.name,
                        banCount: 0,
                        kickCount: 0,
                        timeoutCount: 0,
                        warnCount: 0,
                        updateNotify: true,
                        lastNotify: "none",
                        afk: false,
                        afkMessage: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!userDatabase) return;

            if (userDatabase.afk) {

                message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`${member} is currently afk!\n**${userDatabase.afkMessage}**`)
                            .setColor(color)
                    ], ephemeral: true, allowedMentions: { repliedUser: false }
                }).catch(( err => { } ))
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}