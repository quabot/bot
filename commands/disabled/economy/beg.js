const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');
const shop = require('../../validation/shop.json');

module.exports = {
    name: "beg",
    description: "Beg for money.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    aliases: ['gimme'],
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
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("You can use economy commands now.")
                    return interaction.channel.send({ embeds: [addedEmbed] });
                }
            });
            let moneyGiven = 0;

            if (UserEcoDatabase.lastBeg) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastBeg / 1000;
                if (difference < 180) {
                    let nextTime = parseInt(UserEcoDatabase.lastBeg) + 180000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to beg for money again!`)
                    message.reply({ embeds: [notValid], allowedMentions: { repliedUser: false } });
                    return;
                }
            }

            const array = UserEcoDatabase.shop;
            const appleArray = array.find(item => item.name === `Apple`);
            const appleShop = shop.find(item => item.item === `Apple`);

            if (array) {
                if (appleArray.lastUsed) {
                let timeinonehour = appleArray.lastUsed + appleShop.active;
                if (new Date().getTime() < timeinonehour) {
                    let yes = Math.random();
                    const lostarray = ["imagine begging", "go work", "do something better with your life", "i have better things to do then give you money", "go away begger"]
                    var lostmsg = lostarray[Math.floor(Math.random() * lostarray.length)];
                    const winarray = ["here you go take ", "ok here's ", "heres some mone: ", "i hate beggers but here u go ", "thought it was funny"]
                    var winmsg = winarray[Math.floor(Math.random() * winarray.length)];
                    let randomCoins = Math.random() * 1000 + 100;
                    randomCoins = Math.round(randomCoins)
                    let randomMoney = randomCoins;
                    randomMoney = Math.round(randomMoney)
                    if (yes > 0.45) moneyGiven = randomMoney;
                    if (yes > 0.45) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`${winmsg} ${randomMoney.toLocaleString('us-US', { minimumFractionDigits: 0 })} ⑩`)
                            .setTimestamp()
                            .setDescription(`You got a total of **⑩ ${randomMoney.toLocaleString('us-US', { minimumFractionDigits: 0 })}**`)
                            .setColor(colors.LIME)
                            .setFooter("5% boost active from 🍎 Apple")
                        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                    } else if (yes < 0.45) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`${lostmsg} `)
                            .setTimestamp()
                            .setDescription("You got a total of **⑩ 0**!")
                            .setFooter("5% boost active from 🍎 Apple")
                            .setColor(colors.RED)
                        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                    }

                    let spaceAdd = moneyGiven / 40;

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastBeg: new Date().getTime(),
                    });
                    return;
                }
            }
            }
            

            let yes = Math.random();
            const lostarray = ["imagine begging", "go work you fool (coming soon)", "do something better with your life", "i have better things to do then give you money", "go away begger"]
            var lostmsg = lostarray[Math.floor(Math.random() * lostarray.length)];
            const winarray = ["here you go take ", "ok here's ", "heres some mone: ", "i hate beggers but here u go ", "thought it was funny"]
            var winmsg = winarray[Math.floor(Math.random() * winarray.length)];
            let randomCoins = Math.random() * 1000 + 100;
            randomCoins = Math.round(randomCoins)
            let randomMoney = randomCoins;
            randomMoney = Math.round(randomMoney)
            if (yes > 0.5) moneyGiven = randomMoney;
            if (yes > 0.5) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${winmsg} ${randomMoney.toLocaleString('us-US', { minimumFractionDigits: 0 })} ⑩`)
                    .setTimestamp()
                    .setDescription(`you got a total of **⑩ ${randomMoney.toLocaleString('us-US', { minimumFractionDigits: 0 })}**`)
                    .setColor(colors.LIME)
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            } else if (yes < 0.5) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${lostmsg} `)
                    .setTimestamp()
                    .setDescription("You got a grand total of **⑩ 0**!")
                    .setColor(colors.RED)
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            }

            let spaceAdd = moneyGiven / 40;

            await UserEcoDatabase.updateOne({
                outWallet: UserEcoDatabase.outWallet + moneyGiven,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
                lastBeg: new Date().getTime(),
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}