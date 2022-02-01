const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "crime",
    description: "Commit some crimes.",
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

            if (!UserEcoDatabase.lastCrime) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastCrime / 1000;
                if (difference < 180) {
                    let nextTime = parseInt(UserEcoDatabase.lastCrime) + 180000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                    interaction.reply({ embeds: [notValid] });
                    return;
                }
            }

            const buttonsCrime = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId(`pickpocket-${interaction.user.id}`)
                        .setLabel('Pickpocket')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`murder-${interaction.user.id}`)
                        .setLabel('Murder')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`robbery-${interaction.user.id}`)
                        .setLabel('Robbery')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`cancel-crime-${interaction.user.id}`)
                        .setLabel('Abort')
                        .setStyle('DANGER'),
                );
            const embed = new discord.MessageEmbed()
                .setTitle('Do you wanna commit some crimes?')
                .setDescription('click the buttons to do that!')
                .setColor(colors.COLOR)
                .setTimestamp()
            interaction.reply({ embeds: [embed], components: [buttonsCrime] })

        } catch (e) {
            console.log(e);
            return;
        }
    }
}