const discord = require('discord.js');
const Levels = require('discord.js-leveling');

const Guild = require('../../models/guild');
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
        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });
        
                newGuild.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
        
                return interaction.reply({ embeds: [addedDatabase] });
            }
        });
        if (settings.enableLevel === "false") return interaction.reply({ embeds: [LBDisabled]});

        const rawLeaderboard = await Levels.fetchLeaderboard(interaction.guild.id, 10);
        if (rawLeaderboard.length < 1) return interaction.reply({ embeds: [LBNoXP]});
        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
        const lb = leaderboard.map(e => `${e.position}. **${e.username}#${e.discriminator}** | Level: \`${e.level}\` | \`XP: ${e.xp.toLocaleString()}\``); // We map the outputs.

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle("Leaderboard")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`\n${lb.join("\n\n")}`)
            interaction.reply({ embeds: [embed]});
    }
}