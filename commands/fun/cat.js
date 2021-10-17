const discord = require('discord.js');
const randomPuppy = require('random-puppy');

const colors = require('../../files/colors.json');
const {CatNoFiles, CatScanning} = require('../../files/embeds');

module.exports = {
    name: "cat",
    description: "When you use this command you will recieve a cute picture of a cat.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        interaction.reply({ embeds: [CatScanning] }).then(msg => {
            setTimeout(async function () {
                const subReddits = ["catpics", "kittens"];
                const random = subReddits[Math.floor(Math.random() * subReddits.length)];
                const img = await randomPuppy(random);

                const embed = new discord.MessageEmbed()
                    .setDescription("There you go! :cat:")
                    .setImage(img)
                    .setColor(colors.COLOR);

                interaction.editReply({ embeds: [embed] });
            });
        }, 2000);
    }
}