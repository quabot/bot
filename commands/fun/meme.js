const discord = require('discord.js');
const { meme } = require('memejs');

const { MemeScanning, errorMain } = require('../../files/embeds');
const { newMeme } = require('../../files/interactions');
const colors = require('../../files/colors.json');

module.exports = {
    name: "meme",
    description: "When you use this command you get a random meme from a subreddit.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const subreddits = ['meme', 'memes', 'dankmemes']
            const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
            if (subreddit === "meme") {
                interaction.reply({ embeds: [MemeScanning] })
                meme('meme', function (err, data) {
                    if (err) return interaction.editReply({ embeds: [errorMain] });
                    const embed = new discord.MessageEmbed()
                        .setTitle(`${data.title}`)
                        .setColor(colors.COLOR)
                        .setURL(data.url)
                        .setImage(`${data.url}`)
                        .setFooter(`r/${data.subreddit} - u/${data.author}`)
                        .setTimestamp('Created ' + data.created)
                    interaction.editReply({ embeds: [embed], components: [newMeme] });
                });
            } else if (subreddit === "memes") {
                interaction.reply({ embeds: [MemeScanning] })
                meme('memes', function (err, data) {
                    if (err) return interaction.editReply({ embeds: [errorMain] });
                    const embed = new discord.MessageEmbed()
                        .setTitle(`${data.title}`)
                        .setColor(colors.COLOR)
                        .setURL(data.url)
                        .setImage(`${data.url}`)
                        .setFooter(`r/${data.subreddit} - u/${data.author}`)
                        .setTimestamp('Created ' + data.created)
                    interaction.editReply({ embeds: [embed], components: [newMeme] });
                });
            } else if (subreddit === "dankmemes") {
                interaction.reply({ embeds: [MemeScanning] })
                meme('dankmemes', function (err, data) {
                    if (err) return interaction.editReply({ embeds: [errorMain] });
                    const embed = new discord.MessageEmbed()
                        .setTitle(`${data.title}`)
                        .setColor(colors.COLOR)
                        .setURL(data.url)
                        .setImage(`${data.url}`)
                        .setFooter(`r/${data.subreddit} - u/${data.author}`)
                        .setTimestamp('Created ' + data.created)
                    interaction.editReply({ embeds: [embed], components: [newMeme] });
                });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}