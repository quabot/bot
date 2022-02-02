const discord = require('discord.js');
const Levels = require('discord.js-leveling');

const colors = require('../../files/colors.json');
const { LBNoXP, LBDisabled, addedDatabase, errorMain } = require('../../files/embeds');

module.exports = {
    name: "leaderboard",
    description: "Server's xp leaderboard.",
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
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });
            if (guildDatabase.levelEnabled === "false") return interaction.reply({ embeds: [LBDisabled] });

            const rawLeaderboard = await Levels.fetchLeaderboard(interaction.guild.id, 10);
            if (rawLeaderboard.length < 1) return interaction.reply({ embeds: [LBNoXP] });
            const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
            const lb = leaderboard.map(e => `${e.position}. **${e.username}#${e.discriminator}** | Level: \`${e.level}\` | \`XP: ${e.xp.toLocaleString()}\``); // We map the outputs.
            let userFound = leaderboard.find(user => {
                return user.userID === `${interaction.user.id}`;
            });

            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("Leaderboard")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            
            if (userFound.position < 10) {
                embed.setDescription(`\n${lb.join("\n\n")}`)
            }
            if (userFound.position > 10) {
                embed.setDescription(`\n${lb.join("\n\n")}\n\n${userFound.position}. **${userFound.username}#${userFound.discriminator}** | Level: \`${userFound.level}\` | \`XP: ${userFound.xp.toLocaleString()}\``)
            };
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}