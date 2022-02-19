const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error } = require('../../embeds/general');

module.exports = {
    name: "baltop",
    description: "Get your balance.",
    aliases: ['rich', 'top', 'balancetop'],
    economy: true,
    async execute(client, message) {

        try {
            let leaderboard = [];

            const UserEco = require('../../schemas/UserEcoSchema');
            message.guild.members.cache.forEach(async member => {
                const UserEcoDatabase = await UserEco.findOne({
                    userId: member.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: member.id,
                            outWallet: 0,
                            walletSize: 500,
                            inWallet: 0,
                            lastUsed: "none"
                        });
                        newEco.save()
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }).clone().catch(function (err) { console.log(err) });
                if (!UserEcoDatabase) return
                const topush = { userId: member.id, out: UserEcoDatabase.outWallet, in: UserEcoDatabase.inWallet, total: Math.round(UserEcoDatabase.outWallet) + Math.round(UserEcoDatabase.inWallet), position: 1 }
                leaderboard.push(topush);
            });
            setTimeout(() => {

                leaderboard = leaderboard.sort((a, b) => b.total - a.total)

                leaderboard = leaderboard.slice(0, 10)

                leaderboard = leaderboard.map((el, i) => ({ ...el, position: i + 1 }));

                leaderboard = leaderboard.filter(checkValid);

                function checkValid(item) {
                    return item.total > 0;
                }

                leaderboard = leaderboard.map(e => `\n${e.position}. \`⑩ ${e.total.toLocaleString('us-US', { minimumFractionDigits: 0 })}\` - <@${e.userId}>`);
                message.reply({ embeds: [new discord.MessageEmbed().setTitle(`Total Coins Leaderboard`).setDescription(`${leaderboard}`).setColor(COLOR_MAIN)], allowedMentions: {repliedUser: false} });
            }, 1000);
        } catch (e) {
            console.log(e);
            return;
        }
    }
}