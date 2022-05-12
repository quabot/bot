const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "welcome-message-leave",
    permission: "ADMINISTRATOR",
    async execute(modal, client, color) {
        let msgNew = modal.getTextInputValue('message');
        
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

        await modal.deferReply({ ephemeral: true });

        if (!guildDatabase) return modal.followUp({
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
        leaveMessage = leaveMessage.replace("{user}", `${modal.user}`);
        leaveMessage = leaveMessage.replace("{username}", `${modal.user.username}`);
        leaveMessage = leaveMessage.replace("{discriminator}", `${modal.user.discriminator}`);
        leaveMessage = leaveMessage.replace("{guildname}", `${modal.guild.name}`);
        leaveMessage = leaveMessage.replace("{guild}", `${modal.guild.name}`);
        leaveMessage = leaveMessage.replace("{members}", `${modal.guild.memberCount}`);
        leaveMessage = leaveMessage.replace("{membercount}", `${modal.guild.memberCount}`);

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Changed the leave message to:\n${msgNew}`)
            ], ephemeral: true
        }).catch((err => { }));

        if (guildDatabase.welcomeEmbed === "true") {
            modal.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`RED`)
                        .setTimestamp()
                        .setTitle('Member left!')
                        .setAuthor(`${modal.user.tag} left!`, modal.user.avatarURL())
                        .setFooter("Example Message")
                        .setDescription(`${leaveMessage}`)
                ]
            }).catch((err => { }));
        } else {
            modal.channel.send(`Example Message:\n${leaveMessage}`).catch((err => { }));
        }
    }
}