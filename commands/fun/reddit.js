const discord = require('discord.js');
const { meme } = require('memejs');

const colors = require('../../files/colors.json');
const { errorMain } = require('../../files/embeds');
const { NsfwReddits } = require('../../validation/nsfwreddits');

module.exports = {
    name: "reddit",
    description: "Get an image from any subreddit.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "subreddit",
            type: "STRING",
            description: "The subreddit to get the image from.",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {
            const reddit = interaction.options.getString("subreddit");
            if (reddit === "daftpunk") {
                const dpScan = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle(`Getting r/daftpunk images! <a:daftrave:928728239466238024>`)
                    .setTimestamp()
                interaction.reply({ embeds: [dpScan]});
                meme(`daftpunk`, function (err, data) {
                    if (err) return interaction.followUp({ embeds: [errorMain] });
                    const embed = new discord.MessageEmbed()
                        .setTitle(`${data.title}`)
                        .setColor(colors.COLOR)
                        .setImage(`${data.url}`)
                        .setURL("https://www.youtube.com/watch?v=LYuD9ydQr3w")
                        .setFooter("Click the title for a special surprise!")
                        .setDescription(`r/${data.subreddit} - Human, Human, Human, after all.`)
                        .setTimestamp('Posted ' + data.created)
                    interaction.editReply({ embeds: [embed] });
                });
                return;
            }
            if (NsfwReddits.includes(reddit.toLowerCase())) return interaction.reply("That subreddit was flagged as NSFW!");
            const redditScanning = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle(`Scanning r/${reddit} for images!`)
                .setTimestamp()
            interaction.reply({ ephemeral: true, embeds: [redditScanning] })
            meme(`${reddit}`, function (err, data) {
                if (err) return interaction.followUp({ embeds: [errorMain] });
                const embed = new discord.MessageEmbed()
                    .setTitle(`${data.title}`)
                    .setColor(colors.COLOR)
                    .setImage(`${data.url}`)
                    .setURL(data.url)
                    .setFooter(`r/${data.subreddit}`)
                    .setTimestamp('Posted ' + data.created)
                interaction.editReply({ embeds: [embed] });
            });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}