const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "daily",
    description: "Get money every 24 hours.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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

            if (UserEcoDatabase.lastDaily !== undefined) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastDaily / 1000;
                if (difference < 86400) {
                    let nextTime = parseInt(UserEcoDatabase.lastDaily) + 82800000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);

                    let hrs;
                    if (timestamp > 82800000) hrs = 23;
                    if (timestamp < 82800000) hrs = date.getHours()

                    const timeLeft = hrs + " hours " + date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const alreadyClaimed = new discord.MessageEmbed()
                        .setTitle(`You've already claimed your daily money!`)
                        .setColor(colors.COLOR)
                        .setDescription(`You can claim money again in **${timeLeft}**!`)
                        .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
                        .setTimestamp()
                    interaction.reply({ embeds: [alreadyClaimed] })
                    return;
                }
            }

            moneyGiven = 5000;

            const embed = new discord.MessageEmbed()
                .setTitle(`Daily money for ${interaction.user.username}!`)
                .setColor(colors.COLOR)
                .setDescription(`You were given **⑩ 5,000**!\nYou can claim money again in 24 hours.`)
                .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
                .setTimestamp()
            interaction.reply({ embeds: [embed] });

            let spaceAdd = moneyGiven / 40;

            await UserEcoDatabase.updateOne({
                outWallet: UserEcoDatabase.outWallet + moneyGiven,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
                lastDaily: new Date().getTime(),
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}