const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled } = require('../../files/embeds');


module.exports = {
    name: "queue",
    description: "When using this command you will get a list of the current songs in queue.",
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

        if (settings.enableMusic === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });

        const queue = client.player.getQueue(interaction);
        if (!queue) return interaction.reply("There is no queue! (new message soon)");
        interaction.reply('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
        ).join("\n"));
    }
}