const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');

module.exports = {
    name: "share",
    description: "Share money.",
    aliases: ['give'],
    economy: true,
    async execute(client, message, args) {
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

            const user = message.mentions.users.first();
            const amount = args[1];

            if (!user) return message.reply({ embeds: [new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("Please give a user to share money with!")], allowedMentions: { repliedUser: false } });
            if (!args[0]) return message.reply({ embeds: [new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("Please give a user to share money with!")], allowedMentions: { repliedUser: false } });
            if (!amount) return message.reply({ embeds: [new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("Please an amount to share!")], allowedMentions: { repliedUser: false } });

            const OtherUserEcoDatabase = await UserEco.findOne({
                userId: user.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: user.id,
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

            console.log(OtherUserEcoDatabase.outWallet)

            if (isNaN(amount)) return message.reply({ embeds: [new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("Please an amount to share!")], allowedMentions: { repliedUser: false } });
            if (amount < 0) return message.reply({ embeds: [new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("Please an amount to share!")], allowedMentions: { repliedUser: false } });

            let currentBal = UserEcoDatabase.outWallet;
            let otherBal = OtherUserEcoDatabase.outWallet;

            let sharedAmount = parseInt(amount);
            
            console.log(OtherUserEcoDatabase.outWallet + sharedAmount)
            console.log(sharedAmount)

            if (amount > otherBal) sharedAmount = otherBal;
            if (sharedAmount > currentBal) sharedAmount = currentBal;

            const embed = new discord.MessageEmbed()
                .setDescription(`You shared ⑩ ${sharedAmount} with ${user}!\nThere is now ⑩ ${Math.round(UserEcoDatabase.outWallet) - sharedAmount} in your pocket. And ${user} now has ⑩ ${Math.round(OtherUserEcoDatabase.outWallet) + sharedAmount}`)
                .setColor(COLOR_MAIN)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

            await UserEcoDatabase.updateOne({
                outWallet: Math.round(UserEcoDatabase.outWallet) - sharedAmount
            });

            await OtherUserEcoDatabase.updateOne({
                outWallet: Math.round(OtherUserEcoDatabase.outWallet) + sharedAmount
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}