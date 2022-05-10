const { MessageEmbed, GuildAuditLogs } = require("discord.js");

module.exports = {
    id: "suggestion",
    async execute(modal, client, color) {
        const suggestion = modal.getTextInputValue('suggestion-box');

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

        const msg = await channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("New Suggestion!")
                    .setTimestamp()
                    .addFields(
                        { name: "Suggestion", value: `${suggestion}`},
                        { name: "Suggested by", value: `${modal.user}` }
                    )
                    .setFooter({ text: "Vote with the 🔴 and 🟢 below this message!"})
                    .setColor(color)
            ]
        });
        msg.react("🔴");
        msg.react("🟢");

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Successfully left your suggestion. You can view it in ${channel}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(err => console.log(err));
    }
}