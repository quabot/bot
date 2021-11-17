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
            interaction.reply({ embeds: [MemeScanning] })
            meme('meme', function (err, data) {
                if (err) return interaction.editReply({ embeds: [errorMain] });
                const embed = new discord.MessageEmbed()
                    .setTitle(`${data.title}`)
                    .setColor(colors.COLOR)
                    .setURL(data.url)
                    .setImage(`${data.url}`)
                    .setFooter(`r/${data.subreddit}`)
                    .setTimestamp('Created ' + data.created)
                interaction.editReply({ embeds: [embed], components: [newMeme] });
            });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}