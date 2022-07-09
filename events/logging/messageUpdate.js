const { MessageEmbed, Message } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: newMessage.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: newMessage.guild.id,
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

        if (!newMessage.author) return;
        if (newMessage.author.bot) return;
        if (!logDatabase) return;
        if (logDatabase.logEnabled === false) return;

        const channel = oldMessage.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;


        if (!logDatabase.enabledEvents.includes("messageUpdate")) return;


        const embed = new MessageEmbed()
            .setDescription(`**Message Edited**\n${newMessage.channel}`)
            .setColor(await getColor(newMessage.guild.id));

        let Oldcontent = String(oldMessage.content);
        let Newcontent = String(newMessage.content);

        if (Oldcontent.length > 1020) return;
        if (Newcontent.length > 1020) return;

        if (Oldcontent.content === null || Oldcontent.content === '' && oldMessage.attachments === null && oldMessage.attachments === null) { return } else {
            if (Newcontent.content !== null || Newcontent.content !== '') {
                if (Oldcontent === 'null' || Oldcontent === '') return;
                if (Newcontent === Oldcontent) return;
                embed.addField("Old Content", `${Oldcontent}`)
            }
        };


        if (Newcontent.content === null || Newcontent.content === '' && newMessage.attachments === null && oldMessage.attachments === null) { return } else {
            if (Newcontent.content !== null || Newcontent.content !== '') {
                if (Newcontent === 'null' || Newcontent === '') return;
                if (Newcontent === Oldcontent) return;
                embed.addField("New Content", `${Newcontent}`)
            }
        };

        if (newMessage.author === null || newMessage.author === '' || newMessage.author.avatar === null) { } else {
            embed.setFooter({ text: `User: ${newMessage.author.tag}`, iconURL: `${newMessage.author.avatarURL({ dynamic: true })}` })
        }

        if (oldMessage.attachments !== null) {
            oldMessage.attachments.map(getUrls);
            function getUrls(item) {
                embed.addField(`**Attachments:**`, `${[item.url].join(" ")}`)
            }
        }

        channel.send({ embeds: [embed] }).catch((err => console.log(err)));

    }
}