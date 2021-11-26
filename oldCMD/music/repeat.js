const discord = require('discord.js');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled } = require('../../files/embeds');

module.exports = {
    name: "repeat",
    description: "Change the repeat mode: 0 - OFF, 1 - REPEAT SONG or 2 - REPEAT QUEUE.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "repeatmode",
            description: "E0 - OFF, 1 - REPEAT SONG or 2 - REPEAT QUEUE",
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

        const newMode = interaction.options.getInteger('repeatmode');
        if(!newMode === "0" || !newMode === "1" || !newMode === "2") return interaction.reply("Invalid mode! Enter either `0 - OFF, 1 - REPEAT SONG or 2 - REPEAT QUEUE`")

        let mode = client.player.setRepeatMode(interaction, newMode);
        mode = mode ? mode == 2 ? "Repeat queue :repeat:" : "Repeat song :repeat_one:" : "Off :arrow_forward:";

        interaction.reply(`Changed repeat mode to **${mode}**!`)
    }
}