const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "emojiCreate",
    async execute(emoji, client, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: emoji.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: emoji.guild.id,
                        guildName: emoji.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
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
            const channel = emoji.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: emoji.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: emoji.guild.id,
                        emojiCreateDelete: true,
                        emojiUpdate: true,
                        guildBanAdd: true,
                        guildBanRemove: true,
                        roleAddRemove: true,
                        nickChange: true,
                        boost: true,
                        guildUpdate: true,
                        inviteCreateDelete: true,
                        messageDelete: true,
                        
                        messageUpdate: true,
                        roleCreateDelete: true,
                        roleUpdate: true,
                        stickerCreateDelete: true,
                        stickerUpdate: true,
                        threadCreateDelete: true,
                        voiceMove: false,
                        voiceJoinLeave: false,
                    });
                    newLog.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!logDatabase) return;

            if (logDatabase.emojiCreateDelete === false) return;

            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("Emoji Created!")
                        .addField('Emoji Name', `${emoji.name}`)
                        .setFooter(`ID: ${emoji.id}`, `${emoji.url}`)
                ]
            });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}