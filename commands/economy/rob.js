const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "rob",
    description: "Steal money from a users pocket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "The user you want to rob.",
            type: "USER",
            required: true,
        }
    ],
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

            const user = interaction.options.getMember('user');
            const OtherUserEcoDatabase = await UserEco.findOne({
                userId: user.id
            }, (err, usereco) => {
                if (err) console.error(err);
                if (!usereco) {
                    const newEco = new UserEco({
                        userId: user.id,
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
                        const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("Added the other user to the database.")
                        return interaction.channel.send({ embeds: [addedEmbed] });
                }
            });

            if (UserEcoDatabase.lastRobAny) {
                let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastRobAny / 1000;
                if (difference < 300) {
                    let nextTime = parseInt(UserEcoDatabase.lastRobAny) + 300000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft =  date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`You are on cooldown!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to rob someone again!`)
                    interaction.reply({ embeds: [notValid]});
                    return;
                }
            }
            
            
            if (OtherUserEcoDatabase.lastRobbed) {
                let difference = new Date().getTime() / 1000 - OtherUserEcoDatabase.lastRobbed / 1000;
                if (difference < 300) {
                    let nextTime = parseInt(OtherUserEcoDatabase.lastRobbed) + 300000;
                    var timestamp = nextTime - new Date().getTime();
                    var date = new Date(timestamp);
                    const timeLeft =  date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                    const notValid = new discord.MessageEmbed()
                        .setTitle(`Leave ${user.user.username} alone!`)
                        .setColor(colors.COLOR)
                        .setDescription(`Wait **${timeLeft}** to rob ${user.user.username} again!`)
                    interaction.reply({ embeds: [notValid]});
                    return;
                }
            }


            if (user.user.bot) {
                const embed = new discord.MessageEmbed()
                    .setTitle("Leave the bots alone! They have feelings too.")
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
                return;
            }


            if (user === interaction.user) {
                const embed = new discord.MessageEmbed()
                    .setTitle("You cannot rob yourself!")
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
                return;
            }

            if (UserEcoDatabase.outWallet < 500) {
                const embed = new discord.MessageEmbed()
                    .setTitle("You need atleast ⑩ 500 to rob someone!")
                    .setDescription("Check your bank and withdraw the money in there.")
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
                return;
            }

            if (OtherUserEcoDatabase.outWallet < 500) {
                const embed = new discord.MessageEmbed()
                    .setTitle(`${user.user.username}#${user.user.discriminator} doesn't have enough money!`)
                    .setDescription("It wouldn't be worth the risk to rob them.")
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
                return;
            }

            let maxToWin = OtherUserEcoDatabase.outWallet;
            const haveYouWon = Math.random(); // chance: 58% win, 32% lose
            if (maxToWin > 5000) maxToWin = 5000;
            let moneyWon = Math.random() * maxToWin + 100;
            moneyWon = Math.round(moneyWon);
            let moneyTaken = moneyWon; // what other user will los
            let moneyLost = 0; // what you have lost if you lose

            if (haveYouWon > 0.5) moneyTaken = 0;
            if (haveYouWon > 0.5) moneyWon = 0;

            if (haveYouWon > 0.5) moneyLost = Math.round(Math.random() * 3000 / 2 + 1);
            if (haveYouWon > 0.5) {
                const notStolen = new discord.MessageEmbed()
                    .setTitle(`${interaction.user.username}#${interaction.user.discriminator} tried to rob you!`)
                    .setDescription(`${interaction.user} tried to rob you but failed. You now have an extra ⑩ ${moneyLost.toLocaleString('us-US', {minimumFractionDigits: 0})}!`)
                    .setTimestamp()
                    .setFooter("You are now protected for 5 minutes.")
                    .setColor(colors.COLOR)
                user.send({ embeds: [notStolen] }).catch(err => {
                    return;
                });
                const lost = new discord.MessageEmbed()
                    .setTitle(`You got caught trying to steal from ${user.user.username}!`)
                    .setDescription(`You had to pay ⑩ ${moneyLost.toLocaleString('us-US', {minimumFractionDigits: 0})} to ${user}`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [lost] });
            }

            const spaceAdd = Math.round(moneyWon / 40);

            if (haveYouWon < 0.5) {
                const stolen = new discord.MessageEmbed()
                    .setTitle("You got robbed!")
                    .setDescription(`${interaction.user} robbed you and stole ⑩ ${moneyWon.toLocaleString('us-US', {minimumFractionDigits: 0})}!`)
                    .setTimestamp()
                    .setFooter("You are now protected for 5 minutes.")
                    .setColor(colors.COLOR)
                user.send({ embeds: [stolen] }).catch(err => {
                    return;
                });
                const won = new discord.MessageEmbed()
                    .setTitle(`You stole ⑩ ${moneyWon.toLocaleString('us-US', {minimumFractionDigits: 0})} from ${user.user.username}!`)
                    .setDescription(`Because of this succesfull robbery, you got ⑩ ${spaceAdd.toLocaleString('us-US', {minimumFractionDigits: 0})} extra space in your bank.`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [won] });
            }


            await OtherUserEcoDatabase.updateOne({
                lastRobbed: new Date().getTime(),
                outWallet: OtherUserEcoDatabase.outWallet + moneyLost - moneyTaken,
            });

            await UserEcoDatabase.updateOne({
                lastRobAny: new Date().getTime(),
                outWallet: UserEcoDatabase.outWallet - moneyLost + moneyTaken,
                walletSize: UserEcoDatabase.walletSize + spaceAdd,
            });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}