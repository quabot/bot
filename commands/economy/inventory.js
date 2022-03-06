const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');
const shop = require('../../files/shop.json');

module.exports = {
    name: "inventory",
    description: "Your item inventory.",
    economy: true,
    aliases: ['inv', 'items'],
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

            const array = UserEcoDatabase.shop;
            const embed = new discord.MessageEmbed()
                .setTitle(`${message.author.username}'s inventory`)
                .setColor(COLOR_MAIN)
                

            if (array.length === 0) embed.setDescription("You don't own any items! Buy them with `!shop`.")

            for (let i = 0; i < array.length; i++) {
                const found = shop.find(item => item.item === array[i].name);
                embed.addField(`${found.emoji} ${array[i].name} - \`${array[i].count}\``, `ID: ${found.id} - Price: \`⑩ ${found.prize}\`\n${found.description}`)
            }

            message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } });
        } catch (e) {
            console.log(e);
            return;
        }
    }
}