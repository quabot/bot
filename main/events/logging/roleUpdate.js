const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "roleUpdate",
    async execute(oldRole, newRole, client, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: newRole.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: newRole.guild.id,
                        guildName: newRole.guild.name,
                        logChannelID: "none",
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        ticketStaffPing: true,
                        ticketTopicButton: true,
                        ticketSupport: "none",
                        ticketId: 1,
                        ticketLogs: true,
                        ticketChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        leaveChannelID: "none",
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
                        membersChannel: "none",
                        membersMessage: "Members: {count}",
                        memberEnabled: true
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === false) return;

            const channel = newRole.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: newRole.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: newRole.guild.id,
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

            console.log("TESt")
            let description = `**Role Edited**\n${newRole}`;
            if (oldRole.mentionable !== newRole.mentionable) description = `${description}\n\n**Mentionable**\n\`${oldRole.mentionable ? "Yes" : "No"}\` -> \`${newRole.mentionable ? "Yes" : "No"}\``;
            if (oldRole.name !== newRole.name) description = `${description}\n\n**Name:**\n\`${oldRole.name}\` -> \`${newRole.name}\``;
            if (oldRole.hoist !== newRole.hoist) description = `${description}\n\n**Seperated in sidebar**\n\`${oldRole.hoist ? "Yes" : "No"}\` -> \`${newRole.hoist ? "Yes" : "No"}\``;
            if (oldRole.position !== newRole.position) return;
            if (oldRole.icon !== newRole.icon) return;
            if (oldRole.managed !== newRole.managed) return;

            console.log("TESt")
            const embed = new MessageEmbed()
                .setColor(`${newRole.hexColor}`)
                .setDescription(`${description}`)
                .setTimestamp()
                .setFooter({ text: `${newRole.name}` });

            let oldPerms = oldRole.permissions.toArray().join("\n");
            let oldPermsLength = String(oldPerms);
            let newPerms = newRole.permissions.toArray().join("\n");
            let newPermsLength = String(newPerms);
            if (oldPermsLength.length < 1024 && newPermsLength.length < 1024 && oldPerms !== newPerms) embed.addFields(
                { name: "Old Permissions", value: `\`${oldPerms}\``, inline: true },
                { name: "New Permissions", value: `\`${newPerms}\``, inline: true }
            );

            console.log(description)
            if (logDatabase.enabled.includes("roleUpdate")) {
                channel.send({
                    embeds: [embed]
                }).catch((err => console.log(err)));
                console.log("TESt")
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
} 