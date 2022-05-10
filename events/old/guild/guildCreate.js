const consola = require('consola');
const { guildAdd } = require('../../embeds/general');

module.exports = {
    name: "guildCreate",
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
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Closed Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "none",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });
            consola.log(" ");
            consola.info("QUABOT ADDED")
            consola.info(`QuaBot has been added to: ${guild.name}\nMembers: ${guild.memberCount}`);


            let channel = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);

            channel.send({ embeds: [guildAdd] }).catch(err => {
                console.log(err);
                return;
            });

        } catch (e) {
            console.log(e);
            return;
        }

    }
};