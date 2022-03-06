const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');
const shop = require('../../files/shop.json');

module.exports = {
    name: "daily",
    description: "Get money every 24 hours.",
    aliases: ['freemoney'],
    economy: true,
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
            let moneyGiven = 0;

            if (UserEcoDatabase.lastDaily !== undefined) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastDaily / 1000;
                if (difference < 86400) {
                    let nextTime = parseInt(UserEcoDatabase.lastDaily) + 82800000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);

                    let hrs;
                    if (timestamp > 82800000) hrs = 23;
                    if (timestamp < 82800000) hrs = date.getHours()

                    const timeLeft = hrs + " hours " + date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const alreadyClaimed = new discord.MessageEmbed()
                        .setTitle(`You've already claimed your daily money!`)
                        .setColor(COLOR_MAIN)
                        .setDescription(`You can claim money again in **${timeLeft}**!`)
                        .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
                        
                    message.reply({ embeds: [alreadyClaimed], allowedMentions: { repliedUser: false } })
                    return;
                }
            }

            moneyGiven = 5000;
            const array = UserEcoDatabase.shop;
            const appleArray = array.find(item => item.name === `Apple`);
            const appleShop = shop.find(item => item.item === `Apple`);

            if (array) {
                if (appleArray) {
                    if (appleArray.lastUsed) {
                        let timeinonehour = appleArray.lastUsed + appleShop.active;
                        if (new Date().getTime() < timeinonehour) moneyGiven = 5500;
                    }
                }

            }

            const embed = new discord.MessageEmbed()
                .setTitle(`Daily money for ${message.author.username}!`)
                .setColor(COLOR_MAIN)
                .setDescription(`You were given **⑩ ${moneyGiven.toLocaleString()}**!\nYou can claim money again in 24 hours.`)
                .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
                
            if (array) {
                if (appleArray) {
                    if (appleArray.lastUsed) {
                    let timeinonehour = appleArray.lastUsed + appleShop.active;
                    if (new Date().getTime() < timeinonehour) embed.setFooter("5% boost active from 🍎 Apple")
                }
                }
                
            }
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

            let spaceAdd = moneyGiven / 40;

            await UserEcoDatabase.updateOne({
                outWallet: UserEcoDatabase.outWallet + moneyGiven,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
                lastDaily: new Date().getTime(),
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}