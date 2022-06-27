const { MessageEmbed } = require('discord.js');
const { meme } = require('memejs');

module.exports = {
    name: "meme",
    command: "reddit",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("<a:loading:647604616858566656>")
                    .setColor(color)
            ]
        }).catch((err => { }));

        meme('meme', function (err, data) {

            if (!data) return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`<:error:990996645913194517> | Couldn't find any memes today!`)
                        .setColor(color)
                ]
            }).catch((err => { }));

            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**${data.title}**`)
                        .setImage(`${data.url}`)
                        .setColor(color)
                ]
            }).catch((err => { }));

        });

    }
}