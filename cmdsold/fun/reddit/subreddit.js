const { EmbedBuilder } = require('discord.js');
const { meme } = require('memejs');

module.exports = {
    name: "subreddit",
    command: "reddit",
    async execute(client, interaction, color) {

        const subreddit = interaction.options.getString("reddit");

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("<a:loading:647604616858566656>")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        meme(`${subreddit}`, function (err, data) {

            if (!data) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<:error:990996645913194517> | Couldn't find anything on that subreddit!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${data.title}**`)
                        .setImage(`${data.url}`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

        });

    }
}