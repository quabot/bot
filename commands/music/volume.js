const discord = require('discord.js');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled } = require('../../files/embeds');

module.exports = {
    name: "volume",
    description: "Change the volume of the currently playing music.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "volume",
            description: "Enter the new volume level you wish to apply.",
            type: "INTEGER",
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
        if (settings.enableMusic === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC]});
        const queue = client.player.getQueue(interaction);
        if(!queue) return interaction.reply("There are no songs playing! Play a song first. (new message soon)");

        const volumeNew = interaction.options.getInteger('volume');
        if (volumeNew <= 0) return interaction.reply("invalid number (new message soon)");
        if (volumeNew >= 101) return interaction.reply("invalid number (new message soon)");

        const song = queue.songs[0];

        client.player.setVolume(interaction, volumeNew);
        const newVolume = new discord.MessageEmbed()
            .setTitle("Changed Volume! :speaker:")
            .setThumbnail(song.thumbnail)
            .setDescription(`Succesfully set the volume to **${volumeNew}%**`)
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [newVolume]});  
    }
}