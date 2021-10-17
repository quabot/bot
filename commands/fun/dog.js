const discord = require('discord.js');
const randomPuppy = require('random-puppy');

const colors = require('../../files/colors.json');
const { DogScanning } = require('../../files/embeds');

module.exports = {
    name: "dog",
    description: "By using this command you recieve picture of a dog.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        interaction.reply({ embeds: [DogScanning] }).then(msg => {
            setTimeout(async function () {
                const subReddits = ["puppies"];
                const random = subReddits[Math.floor(Math.random() * subReddits.length)];
                const img = await randomPuppy(random);

                const embed = new discord.MessageEmbed()
                    .setDescription("There you go! :dog:")
                    .setImage(img)
                    .setColor(colors.COLOR);

                interaction.editReply({ embeds: [embed] });
            });
        }, 2000);
    }
}