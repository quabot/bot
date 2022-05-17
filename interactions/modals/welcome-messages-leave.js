const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "welcome-message-leave",
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

        let leaveMessage = msgNew;
        leaveMessage = leaveMessage.replace("{user}", `${interaction.user}`);
        leaveMessage = leaveMessage.replace("{username}", `${interaction.user.username}`);
        leaveMessage = leaveMessage.replace("{discriminator}", `${interaction.user.discriminator}`);
        leaveMessage = leaveMessage.replace("{guildname}", `${interaction.guild.name}`);
        leaveMessage = leaveMessage.replace("{guild}", `${interaction.guild.name}`);
        leaveMessage = leaveMessage.replace("{members}", `${interaction.guild.memberCount}`);
        leaveMessage = leaveMessage.replace("{membercount}", `${interaction.guild.memberCount}`);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Changed the leave message to:\n${msgNew}`)
            ], ephemeral: true
        }).catch((err => { }));

        if (guildDatabase.welcomeEmbed === "true") {
            interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`RED`)
                        .setTimestamp()
                        .setTitle('Member left!')
                        .setAuthor(`${interaction.user.tag} left!`, interaction.user.avatarURL())
                        .setFooter("Example Message")
                        .setDescription(`${leaveMessage}`)
                ]
            }).catch((err => { }));
        } else {
            interaction.channel.send(`Example Message:\n${leaveMessage}`).catch((err => { }));
        }
    }
}