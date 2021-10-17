const discord = require('discord.js');
const randomPuppy = require('random-puppy');

const { MemeScanning, MemeNoAttach } = require('../../files/embeds');
const colors = require('../../files/colors.json');

module.exports = {
    name: "meme",
    description: "When you use this command you get a random meme from a subreddit.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        interaction.reply({ embeds: [MemeScanning] }).then(msg => {
            setTimeout(async function () {
                const subReddits = ["meme"];
                const random = subReddits[Math.floor(Math.random() * subReddits.length)];
                const img = await randomPuppy(random);

                const embed = new discord.MessageEmbed()
                    .setTitle("There you go! :thumbsup:")
                    .setImage(img)
                    .setColor(colors.COLOR)
                    .setFooter(`Your meme from r/${random}`)
                interaction.editReply({ embeds: [embed] });
            }, 5000);
        });

    }
}