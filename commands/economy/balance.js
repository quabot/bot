const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "balance",
    aliases: ['bal', 'money'],
    economy: true,
    async execute(client, message, args) {

        try {
            const UserEco = require('../../schemas/UserEcoSchema');
            const UserEcoDatabase = await UserEco.findOne({
                guildId: message.guild.id,
                userId: message.author.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: message.author.id,
                        guildId: message.guild.id,
                        guildName: message.guild.name,
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
                    return message.channel.send("You were added to the database! Please add users on messageCreate next time.")
                }
            });

            var walletSize = UserEcoDatabase.walletSize;
            var inWallet = UserEcoDatabase.inWallet;
            var outWallet = UserEcoDatabase.outWallet;
            const embed = new discord.MessageEmbed()
                .setTitle(`Money of ${message.author.username}`)
                .setColor(colors.COLOR)
                .setDescription(`PERCENTAGE Bank: ⑩ ${inWallet.toLocaleString('en-US', {minimumFractionDigits: 0})}/${walletSize.toLocaleString('en-US', {minimumFractionDigits: 0})}
                Pocket: ⑩ ${outWallet.toLocaleString('en-US', {minimumFractionDigits: 0})}`)
                .setTimestamp()
            message.reply({ embeds: [embed],  allowedMentions: { repliedUser: false }})
        } catch (e) {
            console.log(e);
            return;
        }
    }
}