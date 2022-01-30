const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "balance",
    description: "Get your balance.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            type: "USER",
            description: "Other user to check the balance of.",
            required: false,
        }
    ],
    async execute(client, interaction) {

        try {
            if (!interaction.options.getMember('user')) {
                const UserEco = require('../../schemas/UserEcoSchema');
                const UserEcoDatabase = await UserEco.findOne({
                    userId: interaction.user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: interaction.user.id,
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
                        const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] });
                    }
                });

                var walletSize = Math.round(UserEcoDatabase.walletSize);
                var inWallet = Math.round(UserEcoDatabase.inWallet);
                var outWallet = Math.round(UserEcoDatabase.outWallet);
                const embed = new discord.MessageEmbed()
                    .setTitle(`Money of ${interaction.user.username}`)
                    .setColor(colors.COLOR)
                    .setDescription(`Bank: ⑩ ${inWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}/${walletSize.toLocaleString('us-US', { minimumFractionDigits: 0 })} \`${Math.round(inWallet / walletSize * 100)}%\`
                    Pocket: ⑩ ${outWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] })
            } else {
                let user = interaction.options.getMember('user');
                const UserEco = require('../../schemas/UserEcoSchema');
                const OtherUserEcoDatabase = await UserEco.findOne({
                    userId: user.user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: user.user.id,
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
                        return interaction.channel.send("Added to db")
                    }
                });

                var walletSize = Math.round(OtherUserEcoDatabase.walletSize);
                var inWallet = Math.round(OtherUserEcoDatabase.inWallet);
                var outWallet = Math.round(OtherUserEcoDatabase.outWallet);
                const embed = new discord.MessageEmbed()
                    .setTitle(`Money of ${user.user.username}`)
                    .setColor(colors.COLOR)
                    .setDescription(`Bank: ⑩ ${inWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}/${walletSize.toLocaleString('us-US', { minimumFractionDigits: 0 })} \`${Math.round(inWallet / walletSize * 100)}%\`
                    Pocket: ⑩ ${outWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}