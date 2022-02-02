const config = require('../../files/settings.json');
const mongoose = require('mongoose');
const consola = require('consola');

const { embed } = require('../../files/embeds/guildAdd');
const { main } = require('../../files/interactions/guildAdd');

module.exports = {
    name: "guildCreate",
    /**
     * @param {Client} client 
     */
    async execute(guild, client) {
        const guildId = guild.id;
        const guildName = guild.name;
        
        if (guild.id === null) return;
        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: guildId,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: guildId,
                        guildName: guildName,
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
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        swearEnabled: false,
transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
            consola.log(" ");
            consola.info("QUABOT ADDED")
            consola.info(`QuaBot has been added to: ${guild.name}\nMembers: ${guild.memberCount}`);


            let channel = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);

            channel.send({ embeds: [embed], components: [main] }).catch(err => {
                console.log(err); 
                return;
            });

        } catch (e) {
            console.log(e);
            return;
        }

    }
};