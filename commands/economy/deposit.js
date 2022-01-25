const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "deposit",
    description: "Deposit money.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "amount",
            description: "Amount to deposit.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {

            const UserEco = require('../../schemas/UserEcoSchema');
            const UserEcoDatabase = await UserEco.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        outWallet: 0,
                        walletSize: 500,
                        inWallet: 0,
                        lastUsed: "none"
                    });
                    newEco.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send("You were added to the database! Please add users on messageCreate next time.")
                }
            });

            const amountArgs = interaction.options.getString('amount');

            if (amountArgs.length > 500) return interaction.reply({ ephemeral: true, content:"That amount is too much for our systems to handle!"});


            if (amountArgs === "max" || amountArgs === "all") {
                let amount = UserEcoDatabase.outWallet;
                const freeSpace = UserEcoDatabase.walletSize - UserEcoDatabase.inWallet;
                if (amount > freeSpace) {
                    let remaining = amount - freeSpace;
                    amount = freeSpace;

                    let inwalletAmount = UserEcoDatabase.inWallet + amount;
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${inwalletAmount.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${remaining.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] })

                    await UserEcoDatabase.updateOne({
                        outWallet: remaining,
                        inWallet: UserEcoDatabase.inWallet + amount,
                    });
                } else {
                    let inwalletAmount = UserEcoDatabase.inWallet + amount;
                    let something = UserEcoDatabase.outWallet - amount;
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${inwalletAmount.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${something.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] })

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet - amount,
                        inWallet: UserEcoDatabase.inWallet + amount,
                    });
                }

                return;
            } else {
                let amount = amountArgs;
                if (!amount) return interaction.reply({ content: "Please give an amount to deposit." });
                if (isNaN(amount)) return interaction.reply({ content: "Please give an amount to deposit." });
                const freeSpace = UserEcoDatabase.walletSize - UserEcoDatabase.inWallet;

                if (amount > UserEcoDatabase.outWallet) amount = UserEcoDatabase.outWallet;

                if (amount > freeSpace) {
                    amount = freeSpace;
                    let remaining = UserEcoDatabase.outWallet - amount;

                    let inwalletAmount = UserEcoDatabase.inWallet + amount;
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${inwalletAmount.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${remaining.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] })

                    await UserEcoDatabase.updateOne({
                        outWallet: remaining,
                        inWallet: UserEcoDatabase.inWallet + amount,
                    });
                } else {
                    var a = parseInt(UserEcoDatabase.inWallet) + parseInt(amount);
                    var b = parseInt(UserEcoDatabase.outWallet) - parseInt(amount);
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Deposited ⑩ ${amount.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                        .setDescription(`There's now **⑩ ${a.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your wallet and **⑩ ${b.toLocaleString('us-US', { minimumFractionDigits: 0 })}** in your pocket.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] })

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