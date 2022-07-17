const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ready",
    async execute(client) {
        (function loop() {
            setTimeout(async function () {

                const Punishment = require('../../structures/schemas/PunishmentSchema');
                const banSchemas = await Punishment.find({
                    type: "tempban"
                }, (err, schema) => {
                    if (err) console.error(err);
                    if (!schema) return;
                }).clone().catch(function (err) { });

                if (banSchemas.length === 0) return;

                banSchemas.forEach(async item => {
                    if (item.time < new Date().getTime() + 5000 && item.time > new Date().getTime() - 5000) {
                        const guild = client.guilds.cache.get(`${item.guildId}`);

                        let userid = item.userId;
                        console.log(userid)
                        let member = await guild.bans.fetch(userid).catch(err => {
                            console.log(err)
                        });

                        guild.members.unban(userid).catch((err => console.log(err)));

                        const { getColor } = require('../../structures/files/contants');
                        const color = await getColor(item.guildId);

                        const channel = guild.channels.cache.get(`${item.channelId}`);
                        if (channel) {
                            channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`User Unbanned!`)
                                        .setDescription(`**User:** <@${userid}>\n**Reason**: Automated unban after being tempbanned.`)
                                        .setColor(color)
                                ],
                            })
                        }
                    }
                })
                loop()
            }, 10000);
        }());
    }
}
