const discord = require('discord.js');
const { meme } = require('memejs');

const colors = require('../../files/colors.json');
const { newCat } = require('../../files/interactions');
const { CatScanning, errorMain } = require('../../files/embeds');

module.exports = {
    name: "cat",
    description: "When you use this command you will recieve a cute picture of a cat.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [CatScanning] })
            meme('cats', function (err, data) {
                if (err) return interaction.followUp({ embeds: [errorMain] });
                const embed = new discord.MessageEmbed()
                    .setTitle(`Here is your cat! :cat:`)
                    .setColor(colors.COLOR)
                    .setImage(`${data.url}`)
                    .setURL(data.url)
                    .setFooter(`r/${data.subreddit}`)
                    .setTimestamp('Created ' + data.created)
                interaction.editReply({ embeds: [embed], components: [newCat] });
            });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}