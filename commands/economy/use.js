const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

const shop = require('../../validation/shop.json');

module.exports = {
    name: "use",
    description: "Use items.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "item",
            description: "The item you wish to use.",
            type: "STRING",
            required: true,
            choices: [
                { name: "Apple", value: "apple" },
                { name: "Book", value: "book" },
                { name: "Simple Lock", value: "simple_lock" }
            ]
        },
    ],
    async execute(client, interaction) {

        try {
            const UserEco = require('../../schemas/UserEcoSchema');
            const UserEcoDatabase = await UserEco.findOne({
                userId: interaction.user.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: interaction.user.id,
                        outWallet: 250,
                        walletSize: 500,
                        inWallet: 250,
                        lastUsed: "none"
                    });
                    newEco.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                        const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] });
                }
            });

            const item = interaction.options.getString('item');
            console.log(item)

        } catch (e) {
            console.log(e);
            return;
        }
    }
}