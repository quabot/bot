const discord = require('discord.js');
const { meme } = require('memejs');

const colors = require('../../files/colors.json');
const { DogScanning, errorMain } = require('../../files/embeds');
const { newDog } = require('../../files/interactions');

module.exports = {
    name: "dog",
    description: "By using this command you recieve picture of a dog.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            interaction.reply({ embeds: [DogScanning] })
            meme('dogpics', function (err, data) {
                if (err) return interaction.followUp({ embeds: [errorMain] });
                const embed = new discord.MessageEmbed()
                    .setTitle(`Here is your dog! :dog:`)
                    .setColor(colors.COLOR)
                    .setImage(`${data.url}`)
                    .setURL(data.url)
                    .setFooter(`r/${data.subreddit}`)
                    .setTimestamp('Created ' + data.created)
                interaction.editReply({ embeds: [embed], components: [newDog] });
            });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}