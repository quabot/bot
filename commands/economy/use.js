const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const moment = require('moment')
const { error, added } = require('../../embeds/general');
const shop = require('../../files/shop.json');

module.exports = {
    name: "use",
    description: "Use items.",
    economy: true,
    aliases: ['use-item'],
    async execute(client, message, args) {

        try {
            let arguments = args.join(' ');
            if (!arguments) return message.reply({ content: "I don't think that item exists.", allowedMentions: { repliedUser: false } })
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
            let foundItem = array.find(item => item.name.toLowerCase() === `${arguments.toLowerCase()}` && item.count > 0)
            const foundShop = shop.find(item => item.item.toLowerCase() === `${arguments.toLowerCase()}`);
            if (!foundShop) return message.reply({ content: "That item doesn't exist lmao", allowedMentions: { repliedUser: false } })
            if (!foundItem) return message.reply({ content: "You don't own that item!", allowedMentions: { repliedUser: false } })

            if (foundShop.usable === false) return message.reply({ content: "You can't use that here! Use it while working or something!", allowedMentions: { repliedUser: false } })

            if (foundItem.lastUsed) {
                let timeinonehour = foundItem.lastUsed + foundShop.active;
                if (new Date().getTime() < timeinonehour) {
                    const timstamp = moment(timeinonehour);
                    console.log(moment(timstamp).fromNow())
                    const embed = new discord.MessageEmbed()
                        .setTitle(`${foundShop.emoji} ${foundShop.item} is still active!`)
                        .setDescription(`Use it again **${moment(timstamp).fromNow()}**`)
                        .setColor(COLOR_MAIN)
                    message.reply({ embeds: [embed] });
                    return;
                }
            }

            if (array) {
                const item = array.find(item => item.name === `${foundShop.item}`);
                if (item) {
                    const updatedArray = array.map(item => {
                        if (item.name.toLowerCase() === `${arguments.toLowerCase()}`) {
                            return { ...item, count: item.count - 1, lastUsed: new Date().getTime() }
                        }

                        return item;
                    });

                    await UserEcoDatabase.updateOne({
                        shop: updatedArray,
                    });
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Activated ${foundShop.emoji} ${foundShop.item}`)
                        .setDescription(`This item will remain active for ${foundShop.activeformat}`)
                        .addField("What does it do?", `${foundShop.whatdo}`)
                        .setColor(COLOR_MAIN)
                        
                    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                }
            } else {
                message.reply("Could not find that item in your inventory.")
                return
            }

        } catch (e) {
            console.log(e);
            return;
        }
    }
}