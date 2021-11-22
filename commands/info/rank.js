const discord = require('discord.js');
const colors = require('../../files/colors.json');
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
            const target = interaction.options.getUser('user');
            const user = await Levels.fetch(target.id, interaction.guild.id);
            if (!user) return interaction.reply({ embeds: [LBNoXP] });

            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle(`${target.tag}'s rank:`)
                .addField("Level", `${user.level}`)
                .addField("XP", `${user.xp}`)
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}