const { COLOR } = require('../../../structures/settings.json');
module.exports = {
    id: "notifRead",
    async execute(interaction, color) {
        const User = require('../../../structures/schemas/UserSchema');
        const userDatabase = await User.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        }, (err, user) => {
            if (err) console.error(err);
            if (!user) {
                const newUser = new User({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    banCount: 0,
                    kickCount: 0,
                    timeoutCount: 0,
                    warnCount: 0,
                    updateNotify: false,
                    notifOpened: false,
                        lastNotify: "none",
                    afk: false,
                    afkMessage: "none",
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        const { MessageEmbed } = require("discord.js");
        if (!userDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We added you to the database! Please click that button again.`)
                    .setColor(COLOR)
            ], ephemeral: true
        }).catch(err => console.log(err));

        await userDatabase.updateOne({
            notifOpened: true,
        });

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Marked as read.\n**TIP:** You can disable update notifications with \`/user settings\``)
                    .setColor(COLOR)
            ], ephemeral: true
        }).catch(err => console.log(err));
    }
}