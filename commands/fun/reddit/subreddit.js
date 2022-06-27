const { MessageEmbed } = require('discord.js');
const { meme } = require('memejs');

module.exports = {
    name: "subreddit",
    command: "reddit",
    async execute(client, interaction, color) {

        const subreddit = interaction.options.getString("reddit");

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("<a:loading:647604616858566656>")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        meme(`${subreddit}`, function (err, data) {

            if (!data) return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Couldn't find anything on that sub!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**${data.title}**`)
                        .setImage(`${data.url}`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

        });

    }
}