const discord = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../models/user');
const colors = require('../../files/colors.json');
const {errorMain, addedDatabase, PunsishmentsOthers} = require('../../files/embeds');

module.exports = {
    name: "punishments",
    description: "View your punishments/anyone's punishments.",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "A user to get the punishments from.",
            type: "USER",
            required: true,
        }
    ],
    async execute(client, interaction) {

        let member = interaction.options.getMember('user');

        const punishments = User.findOne({
            guildID: interaction.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!user) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 0
                });

                await newUser.save()
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
            }
        });

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`Punishments for ${member.tag}`)
            .addField("Mute count", `${punishments.muteCount}`)
            .addField("Warn count", `${punishments.warnCount}`)
            .addField("Kick count", `${punishments.kickCount}`)
            .addField("Ban count", `${punishments.banCount}`)
        interaction.reply({embeds: [embed]});
    }
}

