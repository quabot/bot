const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "welcome-message-join",
    permission: "ADMINISTRATOR",
    async execute(interaction, client, color) {
        const msgNew = interaction.fields.getTextInputValue('message');
        
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
            joinMessage: msgNew
        });

        let joinMessage = msgNew;
        joinMessage = joinMessage.replace("{user}", `${interaction.user}`);
        joinMessage = joinMessage.replace("{username}", `${interaction.user.username}`);
        joinMessage = joinMessage.replace("{discriminator}", `${interaction.user.discriminator}`);
        joinMessage = joinMessage.replace("{guildname}", `${interaction.guild.name}`);
        joinMessage = joinMessage.replace("{guild}", `${interaction.guild.name}`);
        joinMessage = joinMessage.replace("{members}", `${interaction.guild.memberCount}`);
        joinMessage = joinMessage.replace("{membercount}", `${interaction.guild.memberCount}`);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Changed the join message to:\n${msgNew}`)
            ], ephemeral: true
        }).catch((err => { }));

        if (guildDatabase.welcomeEmbed === "true") {
            interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`GREEN`)
                        .setTimestamp()
                        .setTitle('Member joined!')
                        .setAuthor(`${interaction.user.tag} just joined!`, interaction.user.avatarURL())
                        .setFooter("Example Message")
                        .setDescription(`${joinMessage}`)
                ]
            }).catch((err => { }));
        } else {
            interaction.channel.send(`Example Message:\n${joinMessage}`).catch((err => { }));
        }
    }
}