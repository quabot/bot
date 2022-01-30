const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');
const shop = require('../../validation/shop.json');

module.exports = {
    name: "shop",
    description: "Buy items from the shop.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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

            const shopPage1Select = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Select a product to buy.')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: `ICON HERE ${shop[0].item}`,
                                description: `${shop[0].description}`,
                                value: 'shop0',
                            },
                            {
                                label: `${shop[1].item}`,
                                description: `${shop[1].description}`,
                                value: 'shop1',
                            },
                            {
                                label: `${shop[2].item}`,
                                description: `${shop[2].description}`,
                                value: 'shop2',
                            },
                            {
                                label: `${shop[3].item}`,
                                description: `${shop[3].description}`,
                                value: 'shop3',
                            },
                            {
                                label: `${shop[4].item}`,
                                description: `${shop[4].description}`,
                                value: 'shop4',
                            },
                        ]),
                );

            const shopPage1Buttons = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId('page1dis')
                        .setDisabled(true)
                        .setLabel('🡰')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId('page1next')
                        .setLabel('🡲')
                        .setStyle('PRIMARY'),
                );

            const shopPage1Embed = new discord.MessageEmbed()
                .setTitle("Shop items - 1/2")
                .setDescription("Use the selection menu to purchase items.")
                .addField(`${shop[0].emoji} ${shop[0].item} - \`⑩ ${shop[0].prize}\``, `${shop[0].description}`)
                .addField(`${shop[1].emoji} ${shop[1].item} - \`⑩ ${shop[1].prize}\``, `${shop[1].description}`)
                .addField(`${shop[2].emoji} ${shop[2].item} - \`⑩ ${shop[2].prize}\``, `${shop[2].description}`)
                .addField(`${shop[3].emoji} ${shop[3].item} - \`⑩ ${shop[3].prize}\``, `${shop[3].description}`)
                .addField(`${shop[4].emoji} ${shop[4].item} - \`⑩ ${shop[4].prize}\``, `${shop[4].description}`)
                .setTimestamp()
                .setColor(colors.COLOR)
            interaction.reply({ embeds: [shopPage1Embed], components: [shopPage1Select, shopPage1Buttons] });
        } catch (e) {
            console.log(e);
            return;
        }
    }
}