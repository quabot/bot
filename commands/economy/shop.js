const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');
const shop = require('../../files/shop.json');

module.exports = {
    name: "shop",
    description: "Buy items from the shop.",
    economy: true,
    aliases: ['buy'],
    async execute(client, message) {

        try {
            const UserEco = require('../../schemas/UserEcoSchema');
            const UserEcoDatabase = await UserEco.findOne({
                userId: message.author.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: message.author.id,
                        outWallet: 250,
                        walletSize: 500,
                        inWallet: 250,
                        lastUsed: "none"
                    });
                    newEco.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [error] });
                        });
                    const addedEmbed = new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("You can use economy commands now.")
                    return message.channel.send({ embeds: [addedEmbed] });
                }
            }).clone().catch(function (err) { console.log(err) });

            const shopPage1Select = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Select a product to buy.')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: `🍎 ${shop[0].item}`,
                                description: `${shop[0].description}`,
                                value: 'shop0',
                            },
                            {
                                label: `📖 ${shop[1].item}`,
                                description: `${shop[1].description}`,
                                value: 'shop1',
                            },
                            {
                                label: `⏰ ${shop[2].item}`,
                                description: `${shop[2].description}`,
                                value: 'shop2',
                            },
                            {
                                label: `🔒 ${shop[3].item}`,
                                description: `${shop[3].description}`,
                                value: 'shop3',
                            },
                            {
                                label: `💻 ${shop[4].item}`,
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
                        .setLabel('⬅️')
                        .setStyle('SECONDARY'),
                    new discord.MessageButton()
                        .setCustomId('page1next')
                        .setLabel('➡️')
                        .setStyle('SECONDARY'),
                );

            const shopPage1Embed = new discord.MessageEmbed()
                .setTitle("Shop items - 1/2")
                .setDescription("Use the selection menu to purchase items.")
                .addField(`${shop[0].emoji} ${shop[0].item} - \`⑩ ${shop[0].prize}\``, `${shop[0].description}`)
                .addField(`${shop[1].emoji} ${shop[1].item} - \`⑩ ${shop[1].prize}\``, `${shop[1].description}`)
                .addField(`${shop[2].emoji} ${shop[2].item} - \`⑩ ${shop[2].prize}\``, `${shop[2].description}`)
                .addField(`${shop[3].emoji} ${shop[3].item} - \`⑩ ${shop[3].prize}\``, `${shop[3].description}`)
                .addField(`${shop[4].emoji} ${shop[4].item} - \`⑩ ${shop[4].prize}\``, `${shop[4].description}`)
                
                .setColor(COLOR_MAIN)
            message.reply({ embeds: [shopPage1Embed], components: [shopPage1Select, shopPage1Buttons],  allowedMentions: { repliedUser: false } });
        } catch (e) {
            console.log(e);
            return;
        }
    }
}