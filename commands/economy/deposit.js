const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');


module.exports = {
    name: "deposit",
    description: "Deposit money.",
    aliases: ['dep'],
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

            const amountArgs = args[0];
            if (!args[0]) return message.channel.send("You need to give an amount to deposit lol");

            if (amountArgs.length > 500) return message.reply({ content:"That amount is too much for our systems to handle!",  allowedMentions: { repliedUser: false }});


            if (amountArgs === "max" || amountArgs === "all") {
                let amount = Math.round(UserEcoDatabase.outWallet);
                const freeSpace = Math.round(UserEcoDatabase.walletSize) - Math.round(UserEcoDatabase.inWallet);
                if (amount > freeSpace) {
                    let remaining = amount - freeSpace;
                    amount = Math.round(freeSpace);

                    let inwalletAmount = Math.round(UserEcoDatabase.inWallet) + amount;
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${inwalletAmount.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${remaining.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } })

                    await UserEcoDatabase.updateOne({
                        outWallet: remaining,
                        inWallet: UserEcoDatabase.inWallet + amount,
                    });
                } else {
                    let inwalletAmount = Math.round(UserEcoDatabase.inWallet) + amount;
                    let something = Math.round(UserEcoDatabase.outWallet) - amount;
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${inwalletAmount.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${something.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } })

                    await UserEcoDatabase.updateOne({
                        outWallet: Math.round(UserEcoDatabase.outWallet) - amount,
                        inWallet: Math.round(UserEcoDatabase.inWallet) + amount,
                    });
                }

                return;
            } else {
                let amount = Math.round(amountArgs);
                if (!amount) return message.reply({ content: "Please give an amount to deposit.",  allowedMentions: { repliedUser: false } });
                if (isNaN(amount)) return message.reply({ content: "Please give an amount to deposit.",  allowedMentions: { repliedUser: false } });
                const freeSpace = UserEcoDatabase.walletSize - UserEcoDatabase.inWallet;

                if (amount > UserEcoDatabase.outWallet) amount = Math.round(UserEcoDatabase.outWallet);

                if (amount > freeSpace) {
                    amount = Math.round(freeSpace);
                    let remaining = Math.round(UserEcoDatabase.outWallet) - amount;

                    let inwalletAmount = Math.round(UserEcoDatabase.inWallet) + amount;
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${inwalletAmount.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${remaining.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } })

                    await UserEcoDatabase.updateOne({
                        outWallet: remaining,
                        inWallet: Math.round(UserEcoDatabase.inWallet) + amount,
                    });
                } else {
                    var a = parseInt(UserEcoDatabase.inWallet) + parseInt(amount);
                    var b = parseInt(UserEcoDatabase.outWallet) - parseInt(amount);
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${a.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${b.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } })

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet - parseInt(amount),
                        inWallet: UserEcoDatabase.inWallet + parseInt(amount),
                    });
                }
                return;
            }

        } catch (e) {
            console.log(e);
            return;
        }
    }
}