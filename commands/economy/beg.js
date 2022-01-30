const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "beg",
    description: "Beg for money.",
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

            if (UserEcoDatabase.lastBeg) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastBeg / 1000;
                if (difference < 180) {
                    let nextTime = parseInt(UserEcoDatabase.lastBeg) + 180000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft =  date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to beg for money again!`)
                    interaction.reply({ embeds: [notValid]});
                    return;
                }
            }

            let yes = Math.random();
            const lostarray = ["imagine begging", "go work you fool (coming soon)", "do something better with your life", "i have better things to do then give you money", "go away begger"]
            var lostmsg = lostarray[Math.floor(Math.random()*lostarray.length)];
            const winarray = ["here you go take ", "ok here's ", "heres some money", "i hate beggers but here u go ", "thought it was funny"]
            var winmsg = winarray[Math.floor(Math.random()*winarray.length)];
            let randomCoins = Math.random() * 1000 + 100;
            randomCoins = Math.round(randomCoins)
            let randomMoney = randomCoins;
            randomMoney = Math.round(randomMoney)
            if (yes > 0.5) moneyGiven = randomMoney;
            if (yes > 0.5) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${winmsg} ${randomMoney.toLocaleString('us-US', {minimumFractionDigits: 0})} ⑩`)
                    .setTimestamp()
                    .setDescription(`you got a total of **⑩ ${randomMoney.toLocaleString('us-US', {minimumFractionDigits: 0})}**`)
                    .setColor(colors.LIME)
                interaction.reply({ embeds: [embed] });
            } else if (yes < 0.5) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${lostmsg} `)
                    .setTimestamp()
                    .setDescription("You got a grand total of **⑩ 0**!")
                    .setColor(colors.RED)
                interaction.reply({ embeds: [embed] });
            }

            let spaceAdd = moneyGiven / 40;

            await UserEcoDatabase.updateOne({
                outWallet: UserEcoDatabase.outWallet + moneyGiven,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
                lastBeg: new Date().getTime(),
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}