const { fetchLeaderboard, computeLeaderboard } = require('discord.js-leveling');
const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { levelDisabled, noLeaderboard } = require('../../embeds/info');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "leaderboard",
    description: "Guild's level leaderboard.",
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
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });
            if (guildDatabase.levelEnabled === "false") return interaction.reply({ embeds: [levelDisabled] }).catch(err => console.log("Error!"));

            const leaderboardRaw = await fetchLeaderboard(interaction.guild.id, 10);
            if (leaderboardRaw.length < 1) return interaction.reply({ embeds: [noLeaderboard] }).catch(err => console.log("Error!"));
            const lb = await computeLeaderboard(client, leaderboardRaw, true);
            const leaderboard = lb.map(e => `${e.position}. **${e.username}#${e.discriminator}** | Level: \`${e.level}\` | \`XP: ${e.xp.toLocaleString()}\`\n`);
            interaction.reply({ embeds: [new MessageEmbed().setTitle(`${interaction.guild.name}'s Leaderboard`).setDescription(`${leaderboard}`).setColor(COLOR_MAIN)] });
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: leaderboard`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}