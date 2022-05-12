const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "afk-set",
    async execute(modal, client, color) {
        const newStatus = modal.getTextInputValue('afk-status');

        const User = require('../../structures/schemas/UserSchema');
        const userDatabase = await User.findOne({
            userId: modal.user.id,
            guildId: modal.guild.id,
        }, (err, user) => {
            if (err) console.error(err);
            if (!user) {
                const newUser = new User({
                    userId: modal.user.id,
                    guildId: modal.guild.id,
                    guildName: modal.guild.name,
                    banCount: 0,
                    kickCount: 0,
                    timeoutCount: 0,
                    warnCount: 0,
                    updateNotify: false,
                    notifOpened: false,
                    lastNotify: "none",
                    afk: false,
                    afkMessage: "none",
                    bio: "none",
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        modal.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        await modal.deferReply({ ephemeral: true });

        if (!userDatabase) return modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We added you to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ))

        await userDatabase.updateOne({
            afkMessage: `${newStatus}`
        });

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Changed your afk message to: **${newStatus}**`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ))
    }
}