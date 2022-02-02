const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "balance",
    description: "Get your balance.",
    /**
     * @param {Client} client 
     * @param {Message} message
     */
    aliases: ['bal'],
    economy: true,
    async execute(client, message) {

        try {
            const user = message.mentions.users.first();
            if (!user) {
                const UserEco = require('../../schemas/UserEcoSchema');
                const UserEcoDatabase = await UserEco.findOne({
                    userId: message.author.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: message.author.id,
                            outWallet: 0,
                            walletSize: 500,
                            inWallet: 0,
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

                var walletSize = Math.round(UserEcoDatabase.walletSize);
                var inWallet = Math.round(UserEcoDatabase.inWallet);
                var outWallet = Math.round(UserEcoDatabase.outWallet);
                const embed = new discord.MessageEmbed()
                    .setTitle(`Money of ${message.author.username}`)
                    .setColor(colors.COLOR)
                    .setDescription(`Bank: ⑩ ${inWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}/${walletSize.toLocaleString('us-US', { minimumFractionDigits: 0 })} \`${Math.round(inWallet / walletSize * 100)}%\`
                    Pocket: ⑩ ${outWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                    .setTimestamp()
                message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false }})
            } else {
                const UserEco = require('../../schemas/UserEcoSchema');
                const OtherUserEcoDatabase = await UserEco.findOne({
                    userId: user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: user.id,
                            outWallet: 0,
                            walletSize: 500,
                            inWallet: 0,
                            lastUsed: "none"
                        });
                        newEco.save()
                            .catch(err => {
                                console.log(err);
                                message.channel.send({ embeds: [errorMain] });
                            });
                        return message.channel.send("Added to db")
                    }
                });

                var walletSize = Math.round(OtherUserEcoDatabase.walletSize);
                var inWallet = Math.round(OtherUserEcoDatabase.inWallet);
                var outWallet = Math.round(OtherUserEcoDatabase.outWallet);
                const embed = new discord.MessageEmbed()
                    .setTitle(`Money of ${user.username}`)
                    .setColor(colors.COLOR)
                    .setDescription(`Bank: ⑩ ${inWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}/${walletSize.toLocaleString('us-US', { minimumFractionDigits: 0 })} \`${Math.round(inWallet / walletSize * 100)}%\`
                    Pocket: ⑩ ${outWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                    .setTimestamp()
                message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false } });
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}