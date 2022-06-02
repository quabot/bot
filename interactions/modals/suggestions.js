const { MessageEmbed, GuildAuditLogs } = require("discord.js");

module.exports = {
    id: "suggestion",
    async execute(interaction, client, color) {
        const suggestion = interaction.fields.getTextInputValue('suggestion-box');

        await interaction.deferReply({ ephemeral: true });

        const Guild = require('../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
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
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        if (guildDatabase.suggestEnabled === false) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Suggestions are disabled in this server!`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        const channel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription("No suggestions channel setup!")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))

        const msg = await channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("New Suggestion!")
                    .setTimestamp()
                    .addFields(
                        { name: "Suggestion", value: `${suggestion}` },
                        { name: "Suggested by", value: `${interaction.user}` }
                    )
                    .setFooter({ text: "Vote with the 🟢 and 🔴 below this message!" })
                    .setColor(color)
            ]
        }).catch(err => {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`I don't have the required permissions to send messages in that channel.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }))
        });

        msg.react("🟢");
        msg.react("🔴");

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Successfully left your suggestion. You can view it in ${channel}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))
    }
}