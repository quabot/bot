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
    aliases: ['theft, murder, fraud'],
    async execute(client, message) {

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
                            message.channel.send({ embeds: [errorMain] });
                        });
                    const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("You can use economy commands now.")
                    return message.channel.send({ embeds: [addedEmbed] });
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
                    message.reply({ embeds: [notValid],  allowedMentions: { repliedUser: false } });
                    return;
                }
            }

            const buttonsCrime = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId(`pickpocket-${message.author.id}`)
                        .setLabel('Pickpocket')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`murder-${message.author.id}`)
                        .setLabel('Murder')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`robbery-${message.author.id}`)
                        .setLabel('Robbery')
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`cancel-crime-${message.author.id}`)
                        .setLabel('Abort')
                        .setStyle('DANGER'),
                );
            const embed = new discord.MessageEmbed()
                .setTitle('Do you wanna commit some crimes?')
                .setDescription('click the buttons to do that!')
                .setColor(colors.COLOR)
                .setTimestamp()
            message.reply({ embeds: [embed], components: [buttonsCrime],  allowedMentions: { repliedUser: false } })

        } catch (e) {
            console.log(e);
            return;
        }
    }
}