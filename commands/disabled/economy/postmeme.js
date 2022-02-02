const discord = require('discord.js');
const colors = require('../../../files/colors.json');

const { errorMain } = require('../../../files/embeds');

const shop = require('../../../validation/shop.json');

module.exports = {
    name: "postmeme",
    description: "Post a meme for money.",
    /**

     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    aliases: ['pm', 'meme-post', 'memepost'],
    economy: true,
    async execute(client, message) {

        try {
            const UserEco = require('../../../schemas/UserEcoSchema');
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
            let moneyGiven = 0;

            if (UserEcoDatabase.lastMeme) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastMeme / 1000;
                if (difference < 120) {
                    let nextTime = parseInt(UserEcoDatabase.lastMeme) + 120000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to post memes again!`)
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
                        const lostarray = ["nobody cared about your meme", "you tried, and failed miserably", "Nobody liked your meme!"]
                        var lostmsg = lostarray[Math.floor(Math.random() * lostarray.length)];
                        const winarray = ["saw your meme", "laughed about your meme", "upvoted your meme", "reposted your meme", "thought it was funny", "awarded you memer of the year"]
                        var winmsg = winarray[Math.floor(Math.random() * winarray.length)];
                        let randomViews = Math.random() * 1300 + 200;
                        randomViews = Math.round(randomViews)
                        let randomMoney = randomViews / 2.3;
                        randomMoney = Math.round(randomMoney)
                        if (yes > 0.5) moneyGiven = randomMoney;
                        if (yes > 0.5) {
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${randomViews.toLocaleString('us-US', { minimumFractionDigits: 0 })} people ${winmsg}`)
                                .setTimestamp()
                                .setDescription(`you earned a total of **⑩ ${randomMoney.toLocaleString('us-US', { minimumFractionDigits: 0 })}**`)
                                .setColor(colors.LIME)
                            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                        } else if (yes < 0.5) {
                            const embed = new discord.MessageEmbed()
                                .setTitle(`${lostmsg} `)
                                .setTimestamp()
                                .setDescription("You earned a grand total of **⑩ 0**!")
                                .setColor(colors.RED)
                            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                        }

                        let spaceAdd = moneyGiven / 40;

                        await UserEcoDatabase.updateOne({
                            outWallet: UserEcoDatabase.outWallet + moneyGiven,
                            walletSize: UserEcoDatabase.walletSize + spaceAdd,
                            lastMeme: new Date().getTime(),
                        });
                        return;
                    }
                }
            }

            let yes = Math.random();
            const lostarray = ["nobody cared about your meme", "you tried, and failed miserably", "Nobody liked your meme!"]
            var lostmsg = lostarray[Math.floor(Math.random() * lostarray.length)];
            const winarray = ["saw your meme", "laughed about your meme", "upvoted your meme", "reposted your meme", "thought it was funny", "awarded you memer of the year"]
            var winmsg = winarray[Math.floor(Math.random() * winarray.length)];
            let randomViews = Math.random() * 1300 + 200;
            randomViews = Math.round(randomViews)
            let randomMoney = randomViews / 2.3;
            randomMoney = Math.round(randomMoney)
            if (yes > 0.5) moneyGiven = randomMoney;
            if (yes > 0.5) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${randomViews.toLocaleString('us-US', { minimumFractionDigits: 0 })} people ${winmsg}`)
                    .setTimestamp()
                    .setDescription(`you earned a total of **⑩ ${randomMoney.toLocaleString('us-US', { minimumFractionDigits: 0 })}**`)
                    .setColor(colors.LIME)
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            } else if (yes < 0.5) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${lostmsg} `)
                    .setTimestamp()
                    .setDescription("You earned a grand total of **⑩ 0**!")
                    .setColor(colors.RED)
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            }

            let spaceAdd = moneyGiven / 40;

            await UserEcoDatabase.updateOne({
                outWallet: UserEcoDatabase.outWallet + moneyGiven,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
                lastMeme: new Date().getTime(),
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}