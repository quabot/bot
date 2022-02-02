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
                            message.channel.send({ embeds: [errorMain] });
                        });
                    const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("You can use economy commands now.")
                    return message.channel.send({ embeds: [addedEmbed] });
                }
            });

            const array = UserEcoDatabase.shop;
            let foundItem = array.find(item => item.name.toLowerCase() === `${arguments.toLowerCase()}` && item.count > 0)
            const foundShop = shop.find(item => item.item.toLowerCase() === `${arguments.toLowerCase()}`);
            if (!foundShop) return message.reply({ content: "That item doesn't exist lmao", allowedMentions: { repliedUser: false } })
            if (!foundItem) return message.reply({ content: "You don't own that item!", allowedMentions: { repliedUser: false } })

            if (foundShop.usable === false) return message.reply({ content: "You can't use that here! Use it while working or something!", allowedMentions: { repliedUser: false } })

            if (foundItem.lastUsed) {
                let difference = new Date().getTime() / 1000 - foundItem.lastUsed / 1000;
                if (difference < foundShop.activeseconds) {
                    let nextTime = parseInt(foundItem.lastUsed) + foundShop.active;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft = date.getDay() + " days, " +date.getHours() + " hours, " + date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You still have that item active!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** for ${foundShop.item} to run out.!`)
                    message.reply({ embeds: [notValid], allowedMentions: { repliedUser: false } });
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
                        .setColor(colors.COLOR)
                        .setTimestamp()
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