const { COLOR } = require('../../../structures/settings.json');
module.exports = {
    id: "notifRead",
    async execute(interaction, color) {
       
        const GlobalUser = require('../../../structures/schemas/GlobalUser');
        const userDatabase = await GlobalUser.findOne({
            userId: interaction.user.id,
        }, (err, user) => {
            if (err) console.error(err);
            if (!user) {
                const newUser = new GlobalUser({
                    userId: interaction.user.id,
                    updateNotify: true,
                    lastNotify: "none",
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
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
        }).catch(( err => { } ))

        await userDatabase.updateOne({
            notifOpened: true,
        });

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Marked as read.\n**TIP:** You can disable update notifications with \`/user settings\``)
                    .setColor(COLOR)
            ], ephemeral: true
        }).catch(( err => { } ))
    }
}