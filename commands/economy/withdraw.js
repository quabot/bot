const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "withdraw",
    description: "Withdraw money.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "amount",
            description: "Amount to withdraw.",
            type: "STRING",
            required: true,
        },
    ],
    economy: true,
    async execute(client, interaction) {
        try {

            const UserEco = require('../../schemas/UserEcoSchema');
            const UserEcoDatabase = await UserEco.findOne({
                userId: interaction.user.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: interaction.user.id,
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
            
            const argsWithdraw = interaction.options.getString('amount');

            if (argsWithdraw === "max" || argsWithdraw === "all") {
                let amount = UserEcoDatabase.inWallet;

                var a = UserEcoDatabase.outWallet + amount;

                const embed = new discord.MessageEmbed()
                    .setTitle(`Withdrew ⑩ ${amount.toLocaleString('us-US', {minimumFractionDigits: 0})}`)
                    .setDescription(`There's now **⑩ 0** in your wallet and **⑩ ${a.toLocaleString('us-US', {minimumFractionDigits: 0})}** in your pocket.`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] })

                await UserEcoDatabase.updateOne({
                    outWallet: UserEcoDatabase.outWallet + amount,
                    inWallet: UserEcoDatabase.inWallet - amount,
                });


                return;
            } else {
                let amount = argsWithdraw;
                if (!amount) return interaction.reply({ content: "Please give an amount to deposit." });
                if (isNaN(amount)) return interaction.reply({ content: "Please give an amount to deposit." });

                if (amount > UserEcoDatabase.inWallet) amount = UserEcoDatabase.inWallet;

                var a = parseInt(UserEcoDatabase.inWallet) - parseInt(amount);  
                var b = parseInt(UserEcoDatabase.outWallet) + parseInt(amount);

                const embed = new discord.MessageEmbed()
                    .setTitle(`Withdrew ⑩ ${amount.toLocaleString('us-US', {minimumFractionDigits: 0})}`)
                    .setDescription(`There's now **⑩ ${a.toLocaleString('us-US', {minimumFractionDigits: 0})}** in your wallet and **⑩ ${b.toLocaleString('us-US', {minimumFractionDigits: 0})}** in your pocket.`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] })

                await UserEcoDatabase.updateOne({
                    outWallet: UserEcoDatabase.outWallet + parseInt(amount),
                    inWallet: UserEcoDatabase.inWallet - parseInt(amount),
                });

                return;
            }

        } catch (e) {
            console.log(e);
            return;
        }
    }
}