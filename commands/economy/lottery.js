const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');
const shop = require('../../files/shop.json');

module.exports = {
    name: "lottery",
    description: "Play in the lottery.",
    economy: true,
    aliases: ['gamble-lottery'],
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
            let moneySpent = 0;
            let randomPlayers = 36;

            if (UserEcoDatabase.lastLottery !== undefined) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastLottery / 1000;
                if (difference < 1800) {
                    let nextTime = parseInt(UserEcoDatabase.lastLottery) + 1800000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(COLOR_MAIN)
                        .setDescription(`Wait **${timeLeft}** to play again!`)
                    message.reply({ embeds: [notValid],  allowedMentions: { repliedUser: false } });
                    return;
                }
            }

            const buttonsLottery = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId(`lottery-${message.author.id}`)
                        .setLabel('Continue')
                        .setStyle('SUCCESS'),
                    new discord.MessageButton()
                        .setCustomId(`disable-lottery-${message.author.id}`)
                        .setLabel('Abort')
                        .setStyle('DANGER'),
                );
            if (UserEcoDatabase.outWallet < 500) {
                const embed = new discord.MessageEmbed()
                    .setTitle("You don't have the money!")
                    .setDescription("You need ⑩ 500 to play in the lottery.")
                    .setTimestamp()
                    .setColor(COLOR_MAIN)
                message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } });
                return;
            }

            const embed = new discord.MessageEmbed()
                .setTitle(`Play in the lottery`)
                .setColor(COLOR_MAIN)
                .setDescription("Pay ⑩ 500 to enter, if you win you get ⑩ 10,000!")
                .setTimestamp()
            message.reply({ embeds: [embed], components: [buttonsLottery],  allowedMentions: { repliedUser: false } });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}