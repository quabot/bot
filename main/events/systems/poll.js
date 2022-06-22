const { CMD_AMOUNT } = require('../../structures/settings.json');
const { connect } = require('mongoose');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ready",
    async execute(client, clientdefined, color) {
        (function loop() {
            setTimeout(async function () {

                const Poll = require('../../structures/schemas/PollSchema');
                const pollDatabase = await Poll.find({}, (err, poll) => {
                    if (err) console.error(err);
                    if (!poll) return;
                }).clone().catch(function (err) {  });

                pollDatabase.forEach(async item => {
                    if (item.endTimestamp < new Date().getTime() + 1000 && item.endTimestamp > new Date().getTime() - 1000) {
                        const guild = client.guilds.cache.get(`${item.guildId}`);
                        const channel = guild.channels.cache.get(`${item.channelId}`);
                        const msg = channel.messages.fetch(`${item.msgId}`).then(message => {

                            let reactions = message.reactions.cache
                                .each(async (reaction) => await reaction.users.fetch())
                                .map((reaction) => reaction.count)
                                .flat()

                            reactions = reactions.slice(0, 3)
                            var winner = Math.max(...reactions);

                            let winMsg;
                            if (reactions[0] === winner) winMsg = ":one:"
                            if (reactions[1] === winner) winMsg = ":two:"
                            if (reactions[2] === winner) winMsg = ":three:"
                            if (reactions[3] === winner) winMsg = ":four:"

                            message.edit({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`${message.embeds[0].title}`)
                                        .setDescription(`${message.embeds[0].description}\n\nPoll is over, number ${winMsg} won!`)
                                        .addFields(
                                            { name: "Hosted by", value: `${message.embeds[0].fields[0].value}`, inline: true },
                                            { name: "Winner", value: `${winMsg}`, inline: true },
                                            { name: "Ended", value: `${message.embeds[0].fields[1].value}`, inline: true }
                                        )
                                        .setTimestamp()
                                        .setColor(color)
                                ]
                            });
                        });

                        const deleteDB = await Poll.deleteOne({
                            guildId: `${item.guildId}`,
                            channelId: `${item.channelId}`,
                            msgId: `${item.msgId}`,
                            pollId: `${item.pollId}`,
                        }, (err, poll) => {
                            if (err) console.error(err);
                            if (!poll) return;
                        }).clone().catch(function (err) {  });
                    }
                })
                loop()
            }, 2000);
        }());
    }
}