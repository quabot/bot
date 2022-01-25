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
                        guildName: mesinteractionsage.guild.name,
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
            let moneyGiven = 0;
            let moneySpent = 0;
            let randomPlayers = 36;

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

            const embed = new discord.MessageEmbed()
                .setTitle(`Do you want to continue?`)
                .setColor(colors.COLOR)
                .addField(`Ticket Prize`, `⑩ 500`, true)
                .addField(`Other Players`, `50`, true)
                .addField("Prize", "⑩ 10,000", true)
            interaction.reply({ embeds: [embed], components: [buttonsLottery] });


            let spaceAdd = moneyGiven / 40;

            await UserEcoDatabase.updateOne({
                outWallet: UserEcoDatabase.outWallet + moneyGiven,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
                lastLottery: new Date().getTime(),
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}