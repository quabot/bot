const { EmbedBuilder, Message } = require('discord.js');

module.exports = {
    name: "roleUpdate",
    async execute(oldRole, newRole, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: newRole.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: newRole.guild.id,
                    logChannelId: "none",
                    logEnabled: true,
                    enabledEvents: [
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
                    disabledEvents: [
                        'voiceMove',
                        'voiceJoinLeave',
                    ]
                });
                newLog.save()
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).clone().catch(function (err) { });

        if (!logDatabase) return;
        if (logDatabase.logEnabled === false) return;

        const channel = newRole.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;

        if (!logDatabase) return;

        let description = `**Role Edited**\n${newRole}`;
        if (oldRole.mentionable !== newRole.mentionable) description = `${description}\n\n**Mentionable**\n\`${oldRole.mentionable ? "Yes" : "No"}\` -> \`${newRole.mentionable ? "Yes" : "No"}\``;
        if (oldRole.name !== newRole.name) description = `${description}\n\n**Name:**\n\`${oldRole.name}\` -> \`${newRole.name}\``;
        if (oldRole.hoist !== newRole.hoist) description = `${description}\n\n**Seperated in sidebar**\n\`${oldRole.hoist ? "Yes" : "No"}\` -> \`${newRole.hoist ? "Yes" : "No"}\``;
        if (oldRole.position !== newRole.position) return;
        if (oldRole.rawPosition !== newRole.rawPosition) return;
        if (oldRole.icon !== newRole.icon) return;
        if (oldRole.managed !== newRole.managed) return;

        const embed = new EmbedBuilder()
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

        if (logDatabase.enabledEvents.includes("roleUpdate")) {

            channel.send({
                embeds: [embed]
            }).catch((err => console.log(err)));
            
        }

    }
} 