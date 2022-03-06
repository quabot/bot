const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');

module.exports = {
    name: "vote",
    description: "Get money for voting.",
    aliases: [],
    economy: true,
    async execute(client, message, args) {
        try {

            const fetch = require("node-fetch"); // import node-fetch module

            const uId = message.author.id; // get the author id

            const url = `https://top.gg/api/bots/845603702210953246/check?userId=${uId}`; // api endpoint

            fetch(url, { method: "GET", headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0NTYwMzcwMjIxMDk1MzI0NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQxMzAwNTQxfQ.MhZPKVmJ2RgoWVZ1x5ADwZZI0oMt2Aa2Z_sjDC_QzXY" } })
                .then((res) => res.text())
                .then(async (json) => {
                    var isVoted = JSON.parse(json).voted;

                    if (isVoted === 0) {
                        return message.channel.send({ embeds: [new discord.MessageEmbed().setDescription("You need to vote first, do that [here](https://top.gg/bot/845603702210953246/vote)").setColor(COLOR_MAIN)] });
                    }

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
                                    message.channel.send({ embeds: [error] });
                                });
                            const addedEmbed = new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("You can use economy commands now.")
                            return message.channel.send({ embeds: [addedEmbed] });
                        }
                    }).clone().catch(function (err) { console.log(err) });

                    if (UserEcoDatabase.lastVote) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastVote / 1000;
                        if (difference < 43200) {
                            let nextTime = parseInt(UserEcoDatabase.lastVote) + 60000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getHours() + " hours, " + date.getMinutes() + " mintes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`You are on cooldown!`)
                                .setColor(COLOR_MAIN)
                                .setDescription(`Wait **12 hours** to claim your vote money again!`)
                            message.reply({ embeds: [notValid], allowedMentions: { repliedUser: false } });
                            return;
                        }
                    }

                    const embed = new discord.MessageEmbed()
                        .setTitle(`Thanks for voting, ${message.author.username}!`)
                        .setColor(COLOR_MAIN)
                        .setDescription(`You were given **⑩ 5,000**!\nYou can claim vote money again in 12 hours.`)
                        .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
                        

                    message.channel.send({ embeds: [embed]});

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + 5000,
                        walletSize: UserEcoDatabase.walletSize + 100,
                        lastVote: new Date().getTime(),
                    });

                });

        } catch (e) {
            console.log(e);
            return;
        }
    }
}