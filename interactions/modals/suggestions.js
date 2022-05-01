const { MessageEmbed, GuildAuditLogs } = require("discord.js");

module.exports = {
    id: "afk-set",
    async execute(modal, client, color) {
        const newStatus = modal.getTextInputValue('suggestion');

        await modal.deferReply({ ephemeral: true });

        const Guild = require('../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: modal.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: modal.guild.id,
                    guildName: modal.guild.name,
                    logChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    logEnabled: true,
                    levelEnabled: false,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                    roleEnabled: false,
                    mainRole: "Member",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        modal.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(err => console.log(err));

        if (guildDatabase.suggestEnabled === false) return modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Suggestions are disabled in this server!`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(err => console.log(err));

        const channel = modal.guild.channels.cache.get(guildDatabase.suggestChannelID);
        if (!channel) return modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription("No suggestions channel setup!")
                    .setColor(color)
            ], ephemeral: true
        }).catch(err => console.log(err));

        modal.channel.send("a")

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Changed your afk message to: **e**`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(err => console.log(err));
    }
}