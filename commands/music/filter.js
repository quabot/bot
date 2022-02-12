const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { musicDisabled, notVoice, noSongs } = require('../../embeds/music');
const { skipButtons } = require('../../interactions/music');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports =
    module.exports = {
        name: "filter",
        description: "Toggle filters.",
        options: [
            {
                name: "filter-type",
                description: "The filter-type",
                type: "STRING",
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
                if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log("Error!"));


                const type = interaction.options.getString('filter-type');
                const member = interaction.guild.members.cache.get(interaction.user.id);
                if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log("Error!"));

                const queue = client.player.getQueue(interaction);
                if (!queue) return interaction.reply({ embeds: [noSongs] }).catch(err => console.log("Error!"));
                const filters = new MessageEmbed()
                    .setTitle("Music Filters")
                    .setColor(COLOR_MAIN)
                    .setDescription(`- off\n- 3d\n- bassboost\n- echo\n- karaoke\n- nightcore\n- vaporwave \n- flanger\n- gate\n- haas\n- reverse\n- surround\n- mcompnad\n- phaser\n- tremolo\n- earway`)
                    .setTimestamp();

                if (type === "off" && queue.filters?.length) queue.setFilter(false);
                else if (Object.keys(client.player.filters).includes(type)) queue.setFilter(type)
                else if (type) return interaction.reply({ embeds: [filters] }).catch(err => console.log("Error!"));
                const currentFilters = new MessageEmbed()
                    .setTitle("Current Filters")
                    .setColor(COLOR_MAIN)
                    .setDescription(`\`${queue.filters.join(", ") || "Off"}\``)
                    .setTimestamp()
                interaction.reply({ embeds: [currentFilters] }).catch(err => console.log("Error!"));
            } catch (e) {
                interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: filter`)] }).catch(err => console.log("Error!"));;
            return;
            }
        }
    }