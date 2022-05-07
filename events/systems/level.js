const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageCreate",
    async execute(message, client, color) {
        try {

            // DM & Bot checks
            if (!message.guild) return;
            if (message.author.bot) return;

            // Find the guild's database
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
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        levelEnabled: false,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        roleEnabled: false,
                        mainRole: "Member",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: reqString,
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (guildDatabase.levelEnabled === "false") return;

            const channel = message.guild.channels.cache.get(`${guildDatabase.levelChannelID}`);

            const Level = require('../../structures/schemas/levelSchema');
            const levelDatabase = await Level.findOne({
                userId: message.author.id,
                guildId: message.guild.id,
            }, (err, level) => {
                if (err) console.error(err);
                if (!level) {
                    const newLevel = new Level({
                        userId: `${message.author.id}`,
                        guildId: `${message.guild.id}`,
                        xp: 0,
                        level: 0,
                        role: "0",
                    });
                    newLevel.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!levelDatabase) return;

            var level = levelDatabase.level;
            var xp = levelDatabase.xp;
            var role = levelDatabase.role;

            var reqXp = 1//level * 300 + 100;
            var randXp = Math.floor(Math.random() * 30 + 1);

            if (xp + randXp >= reqXp) {
                levelDatabase.xp = 0;
                levelDatabase.level += 1;
                levelDatabase.save();
                // check card
                // embed toggle
                // custom message
                if (channel) {
                    // if embed
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`${message.author} just leveled up to level **${levelDatabase.level}**, and has **${levelDatabase.xp}** XP!`)
                                .setAuthor(`${message.author.tag} is now level ${levelDatabase.level}!`, message.author.avatarURL())
                                .setThumbnail(message.author.avatarURL())
                        ]
                    });
                    // else message
                } else {
                    // if embed
                    message.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`You just leveled up to level **${levelDatabase.level}**, and have **${levelDatabase.xp}** XP!`)
                        ], allowedMentions: { repliedUser: false }
                    });
                    // else message
                }
            } else {
                levelDatabase.xp += randXp;
                levelDatabase.save();
            }

            // check role (needs config first)

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}