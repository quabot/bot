const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { noPermission } = require('../../files/embeds/config')
const { errorMain, addedDatabase } = require('../../files/embeds.js');
const { pausedButtons, skipButtons } = require('../../files/interactions/music');
const { NotInVC, MusicIsDisabled, noSongs, pausedQueue, skippedSong, stoppedQueue, shuffledQueue } = require('../../files/embeds');


module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: false,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted',
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            swearEnabled: false,
transcriptChannelID: "none"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (interaction.isButton()) {
                if (interaction.customId === "pause-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });

                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] });
                    client.player.pause(interaction);
                    interaction.reply({ embeds: [pausedQueue], components: [pausedButtons] });
                }

                if (interaction.customId === "skip-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] });

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });

                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] });

                    const song1 = queue.songs[1];
                    if (!song1) return interaction.reply({ embeds: [noSongs] });

                    client.player.skip(queue);
                    interaction.reply({ embeds: [skippedSong], components: [skipButtons] });
                }

                if (interaction.customId === "stop-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] });

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });

                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] });
                    client.player.stop(interaction);
                    interaction.reply({ embeds: [stoppedQueue] });
                }

                if (interaction.customId === "shuffle-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] });

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });

                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] });
                    client.player.shuffle(interaction);
                    interaction.reply({ embeds: [shuffledQueue], components: [skipButtons] });
                }

                if (interaction.customId === "repeat-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });
                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] });

                    const newMode = 2;
                    let mode = client.player.setRepeatMode(interaction, newMode);
                    mode = mode ? mode == 2 ? "Repeat queue :repeat:" : "Repeat song :repeat_one:" : "Off :arrow_forward:";

                    const embed = new discord.MessageEmbed()
                        .setTitle(":repeat:  Changed repeat mode!")
                        .setDescription(`${mode}`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed], components: [skipButtons] });
                }
            }

        } catch (e) {
            //console.log(e);
            //interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}