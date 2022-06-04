const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "level-message-change",
    permission: "ADMINISTRATOR",
    async execute(interaction, client, color) {
        let msgNew = interaction.fields.getTextInputValue('message');

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
                        logSuggestChannelID: "none",
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

        await interaction.deferReply({ ephemeral: true });

        if (!guildDatabase) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Added this server to the database, please run that command again.`)
            ], ephemeral: true
        }).catch((err => { }));

        await guildDatabase.updateOne({
            leaveMessage: msgNew
        });

        let levelMessage = msgNew;
        levelMessage = levelMessage.replace("{user}", `${interaction.user}`);
        levelMessage = levelMessage.replace("{username}", `${interaction.user.username}`);
        levelMessage = levelMessage.replace("{discriminator}", `${interaction.user.discriminator}`);
        levelMessage = levelMessage.replace("{level}", `3`);
        levelMessage = levelMessage.replace("{xp}", `0`);
        levelMessage = levelMessage.replace("{guild}", `${interaction.guild.name}`);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Changed the level-up message to:\n${levelMessage}`)
            ], ephemeral: true
        }).catch((err => { }));

        interaction.channel.send(`${levelMessage}`).catch((err => { }));
    }
}