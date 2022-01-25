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

            var walletSize = UserEcoDatabase.walletSize;
            var inWallet = UserEcoDatabase.inWallet;
            var outWallet = UserEcoDatabase.outWallet;
            const embed = new discord.MessageEmbed()
                .setTitle(`Money of ${interaction.user.username}`)
                .setColor(colors.COLOR)
                .setDescription(`Bank: ⑩ ${inWallet.toLocaleString('us-US', {minimumFractionDigits: 0})}/${walletSize.toLocaleString('us-US', {minimumFractionDigits: 0})} \`${Math.round(inWallet / walletSize * 100)}%\`
                Pocket: ⑩ ${outWallet.toLocaleString('us-US', {minimumFractionDigits: 0})}`)
                .setTimestamp()
            interaction.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e);
            return;
        }
    }
}