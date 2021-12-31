const config = require('../../files/config.json');
const mongoose = require('mongoose');
const consola = require('consola');

const { embed } = require('../../files/embeds/botadd');
const { main } = require('../../files/interactions/botadd');

module.exports = {
    name: "guildCreate",
    /**
     * @param {Client} client 
     */
    async execute(guild, client) {
        if (guild.id === null) return;
        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: guild.id,
                        guildName: guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Closed Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });
            consola.log(" ");
            consola.info("QUABOT ADDED")
            consola.info(`QuaBot has been added to: ${guild.name}\nMembers: ${guild.memberCount}`);


            let channel = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);

            channel.send({ embeds: [embed], components: [main] });

        } catch (e) {
            console.log(e);
            return;
        }

    }
};