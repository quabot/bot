const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "welcome-message-join",
    permission: "ADMINISTRATOR",
    async execute(modal, client, color) {
        const msgNew = modal.getTextInputValue('message');
        
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
                    punishmentChannelID: "none",
                    pollID: 0,
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

        await modal.deferReply({ ephemeral: true });

        if (!guildDatabase) return modal.followUp({
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
        joinMessage = joinMessage.replace("{user}", `${modal.user}`);
        joinMessage = joinMessage.replace("{username}", `${modal.user.username}`);
        joinMessage = joinMessage.replace("{discriminator}", `${modal.user.discriminator}`);
        joinMessage = joinMessage.replace("{guildname}", `${modal.guild.name}`);
        joinMessage = joinMessage.replace("{guild}", `${modal.guild.name}`);
        joinMessage = joinMessage.replace("{members}", `${modal.guild.memberCount}`);
        joinMessage = joinMessage.replace("{membercount}", `${modal.guild.memberCount}`);

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Changed the join message to:\n${msgNew}`)
            ], ephemeral: true
        }).catch((err => { }));

        if (guildDatabase.welcomeEmbed === "true") {
            modal.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`GREEN`)
                        .setTimestamp()
                        .setTitle('Member joined!')
                        .setAuthor(`${modal.user.tag} just joined!`, modal.user.avatarURL())
                        .setFooter("Example Message")
                        .setDescription(`${joinMessage}`)
                ]
            }).catch((err => { }));
        } else {
            modal.channel.send(`Example Message:\n${joinMessage}`).catch((err => { }));
        }
    }
}