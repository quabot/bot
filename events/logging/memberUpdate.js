const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember, client, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMember.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMember.guild.id,
                        guildName: oldMember.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
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
            const channel = oldMember.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: oldMember.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: oldMember.guild.id,
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

            if (logDatabase.enabled.includes("roleAddRemove")) {
                if (oldMember._roles !== newMember._roles) {
                    if (oldMember.nickname === newMember.nickname) {
                        if (oldMember._roles > newMember._roles) {
                            channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle('Role(s) Removed')
                                        .addField("User", `${newMember}`)
                                        .setDescription(`<@&${oldMember._roles.filter(n => !newMember._roles.includes(n)).join('>\n<@&')}>`)
                                        .setColor(color)
                                        .setFooter(`User ID: ${newMember.id}`)

                                ]
                            }).catch((err => { }));
                        }
                        if (oldMember._roles < newMember._roles) {
                            channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle('Role(s) Given')
                                        .addField("User", `${newMember}`)
                                        .setDescription(`<@&${newMember._roles.filter(n => !oldMember._roles.includes(n)).join('>\n<@&')}>`)
                                        .setColor(color)
                                        .setFooter(`User ID: ${newMember.id}`)
                                ]
                            }).catch((err => { }));
                        }
                    }
                }
            }

            if (logDatabase.enabled.includes("nickChange")) {
                if (oldMember._roles === newMember._roles) {
                    if (oldMember.nickname !== newMember.nickname) {
                        let oldNick = oldMember.nickname;
                        let newNick = newMember.nickname;
                        if (oldNick === null) oldNick = "none";
                        if (newNick === null) newNick = "none";

                        channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("Nickname changed")
                                    .addField("Old Nickname", `${oldNick}`)
                                    .addField("New Nickname", `${newNick}`)
                                    .addField("User", `${newMember}`)
                                    .setFooter({ text: `User-ID: ${newMember.user.id}` })
                                    .setColor(color)
                            ]
                        }).catch((err => { }));
                    }
                }
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}