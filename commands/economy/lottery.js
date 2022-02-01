const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "lottery",
    description: "Play in the lottery.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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
            let moneyGiven = 0;
            let moneySpent = 0;
            let randomPlayers = 36;

            if (UserEcoDatabase.lastLottery !== undefined) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastLottery / 1000;
                if (difference < 3600) {
                    let nextTime = parseInt(UserEcoDatabase.lastLottery) + 3600000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to play again!`)
                    interaction.reply({ embeds: [notValid] });
                    return;
                }
            }

            const buttonsLottery = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId(`lottery-${interaction.user.id}`)
                        .setLabel('Continue')
                        .setStyle('SUCCESS'),
                    new discord.MessageButton()
                        .setCustomId(`disable-lottery-${interaction.user.id}`)
                        .setLabel('Abort')
                        .setStyle('DANGER'),
                );
            if (UserEcoDatabase.outWallet < 500) {
                const embed = new discord.MessageEmbed()
                    .setTitle("You don't have the money!")
                    .setDescription("You need ⑩ 500 to play in the lottery.")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                interaction.reply({ embeds: [embed] });
                return;
            }

            const embed = new discord.MessageEmbed()
                .setTitle(`Play in the lottery`)
                .setColor(colors.COLOR)
                .setDescription("Pay ⑩ 500 to enter, if you win you get ⑩ 10,000!")
                .setTimestamp()
            interaction.reply({ embeds: [embed], components: [buttonsLottery] });


        } catch (e) {
            console.log(e);
            return;
        }
    }
}