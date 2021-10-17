const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild')
const Levels = require('discord.js-leveling');

//const { errorMain, addedDatabase } = require('../../files/embeds');
const { errorMain, LBNoXP, LBDisabled, addedDatabase } = require('../../files/embeds');


module.exports = {
    name: "rank",
    description: "Get your current amount of levels and XP points.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "A user to get the rank from.",
            type: "USER",
            required: true,
        }
    ],
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
        const target = interaction.options.getUser('user');
        const user = await Levels.fetch(target.id, interaction.guild.id);
        if (!user) return interaction.reply({ embeds: [LBNoXP]});

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`${target.tag}'s rank:`)
            .addField("Level", `${user.level}`)
            .addField("XP", `${user.xp}`)
        interaction.reply({ embeds: [embed]});

    }
}