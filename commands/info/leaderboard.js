const discord = require('discord.js');
const Levels = require('discord.js-leveling');

const colors = require('../../files/colors.json');
const { LBNoXP, LBDisabled, addedDatabase, errorMain } = require('../../files/embeds');

module.exports = {
    name: "leaderboard",
    description: "This command allows you to view a leaderbord of levels of a server.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });
            if (guildDatabase.levelEnabled === "false") return interaction.reply({ embeds: [LBDisabled] });

            const rawLeaderboard = await Levels.fetchLeaderboard(interaction.guild.id, 10);
            if (rawLeaderboard.length < 1) return interaction.reply({ embeds: [LBNoXP] });
            const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
            const lb = leaderboard.map(e => `${e.position}. **${e.username}#${e.discriminator}** | Level: \`${e.level}\` | \`XP: ${e.xp.toLocaleString()}\``); // We map the outputs.

            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("Leaderboard")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription(`\n${lb.join("\n\n")}`)
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}