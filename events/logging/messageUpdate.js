const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client, color) {
        try {

            if (newMessage.author.bot) return;
            
            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMessage.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMessage.guild.id,
                        guildName: oldMessage.guild.name,
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
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === false) return;
            const channel = oldMessage.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: oldMessage.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: oldMessage.guild.id,
                        enabled: [
                            'emojiCreateDelete',
                            'emojiUpdate',
                            'guildBanAdd',
                            'guildBanRemove',
                            'roleAddRemove',
                            'nickChange',
                            'channelCreateDelete',
                            'channelUpdate',
                            'inviteCreateDelete',
                            'messageDelete',
                            'messageUpdate',
                            'roleCreateDelete',
                            'roleUpdate',
                            'stickerCreateDelete',
                            'stickerUpdate',
                            'threadCreateDelete',
                        ],
                        disabled: [
                            'voiceMove',
                            'voiceJoinLeave',
                        ]
                    });
                    newLog.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!logDatabase) return;

            if (!logDatabase.enabled.includes("messageUpdate")) return;

            const embed = new MessageEmbed()
                .setTitle("Message Edited!")
                .setFooter({ text: `ID: ${newMessage.id}` })
                .setColor(`YELLOW`);

            let Oldcontent = String(oldMessage.content);
            let Newcontent = String(newMessage.content);

            if (Oldcontent.length > 1020) Oldcontent = "Old content longer than max characters! [Working on a fix]";
            if (Newcontent.length > 1020) Newcontent = "Old content longer than max characters! [Working on a fix]";

            if (Oldcontent.content === null || Oldcontent.content === '') { } else {
                embed.addField("Old Content", `${Oldcontent} ** **`);
            }

            if (Newcontent.content === null || Newcontent.content === '') { } else {
                embed.addField("New Content", `${Newcontent} ** **`);
            }
            embed.addField("Channel", `${newMessage.channel} ** **`, true);
            if (newMessage.author === null || newMessage.author === '') { } else {
                embed.addField("Author", `${newMessage.author} ** **`, true);
            }

            channel.send({ embeds: [embed] });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}