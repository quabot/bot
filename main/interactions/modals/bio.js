const { MessageEmbed } = require("discord.js");

module.exports = {
    id: "bio-set",
    async execute(interaction, client, color) {
        const newBio = interaction.fields.getTextInputValue('bio');

        const User = require('../../structures/schemas/UserSchema');
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
                    bio: "none",
                });
                newUser.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                    });
            }
        }).clone().catch(function (err) {  });

        await interaction.deferReply({ ephemeral: true });

        if (!userDatabase) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We added you to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ))

        await userDatabase.updateOne({
            bio: `${newBio}`
        });

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Changed your bio message to:\n${newBio}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ))
    }
}