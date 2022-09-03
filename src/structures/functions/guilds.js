const { EmbedBuilder, Colors } = require('discord.js');
const { getModerationConfig } = require('./config');

async function tempUnban(client, document, color) {
    const guild = client.guilds.cache.get(`${document.guildId}`);
    if (!guild) return;
    const channel = guild.channels.cache.get(`${document.channelId}`);


    let member = await guild.bans.fetch(document.userId).catch(err => { return; });

    guild.members.unban(document.userId).catch(err => {
        if (err.code !== 50035) return;
    });


    const TempBan = require('../schemas/TempbanSchema');
    await TempBan.findOneAndDelete({
        guildId: document.guildId,
        userId: document.userId,
        banId: document.banId,
    });


    if (channel) channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(color)
                .setTitle("Member Unbanned!")
                .addFields(
                    { name: "User", value: `<@${document.userId}>`, inline: true },
                    { name: "Unbanned After", value: `${document.banDuration}`, inline: true },
                    { name: "Ban-Id", value: `${document.banId}`, inline: true },
                )
                .setTimestamp()
        ]
    }).catch(() => null);


    const moderationConfig = await getModerationConfig(client, document.guildId);
    const logChannel = guild.channels.cache.get(`${moderationConfig.channelId}`);
    if (logChannel) logChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(color)
                .setTitle("Member Auto-Unbanned")
                .addFields(
                    { name: "User", value: `<@${document.userId}>`, inline: true },
                    { name: "Unbanned After", value: `${document.banDuration}`, inline: true },
                    { name: "Ban-Id", value: `${document.banId}`, inline: true },
                )
                .setTimestamp()
        ]
    }).catch(() => null);
}

module.exports = { tempUnban };