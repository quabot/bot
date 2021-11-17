const discord = require('discord.js');
const colors = require('../../files/colors.json');
const { CoinFlipping, errorMain } = require('../../files/embeds');

module.exports = {
    name: "coin",
    description: "When using this command you will flip a virtual coin.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            function randomCoin() {
                const random = ['Heads', 'Tails'];
                return random[Math.floor(Math.random() * random.length)];
            }

            const Result = new discord.MessageEmbed()
                .setDescription(`**${randomCoin()}! :coin:**`)
                .setColor(colors.COLOR);
            interaction.reply({ embeds: [CoinFlipping] }).then(msg => {
                setTimeout(function () {
                    interaction.editReply({ embeds: [Result] });
                }, 1500);
            })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}