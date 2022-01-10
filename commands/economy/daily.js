const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "daily",
    aliases: ['dailymoney', 'coinsdaily'],
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
                        .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.xyz) - [Website](https://quabot.xyz)")
                        .setTimestamp()
                    message.reply({ embeds: [alreadyClaimed], allowedMentions: { repliedUser: false } })
                    return;
                }
            }

            moneyGiven = 10000;

            const embed = new discord.MessageEmbed()
                .setTitle(`Daily money for ${message.author.username}!`)
                .setColor(colors.COLOR)
                .setDescription(`You were given **⑩ 10,000**!\nYou can claim money again in 24 hours.`)
                .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.xyz) - [Website](https://quabot.xyz)")
                .setTimestamp()
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

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