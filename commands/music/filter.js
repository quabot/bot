const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, noSongs, MusicIsDisabled } = require('../../files/embeds');


module.exports = {
    name: "filter",
    description: "Toggle filters.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "filter-type",
            description: "The filter-type",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {

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
                        interaction.channel.send({ embeds: [errorMain] });
                    });
                return interaction.channel.send({ embeds: [addedDatabase] });
            }
        });

        const type = interaction.options.getString('filter-type');

        if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC]});

        const queue = client.player.getQueue(interaction);
        if(!queue) return interaction.reply({ embeds: [noSongs] });
        const filters = new discord.MessageEmbed()
            .setTitle("Music Filters")
            .setColor(colors.COLOR)
            .setDescription(`- 3d\n- bassboost\n- echo\n- karaoke\n- nightcore\n- vaporwave \n- flanger\n- gate\n- haas\n- reverse\n- surround\n- mcompnad\n- phaser\n- tremolo\n- earway`)
            .setTimestamp()
        
        if (type === "off" && queue.filters?.length) queue.setFilter(false);
        else if (Object.keys(client.player.filters).includes(type)) queue.setFilter(type)
        else if (type) return interaction.reply({ embeds: [filters] });
        const currentFilters = new discord.MessageEmbed()
            .setTitle("Current Filters")
            .setColor(colors.COLOR)
            .setDescription(`\`${queue.filters.join(", ") || "Off"}\``)
            .setTimestamp()
        interaction.reply({ embeds: [currentFilters] });
    }
}