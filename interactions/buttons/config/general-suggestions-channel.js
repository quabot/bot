const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    id: "general_suggestions_channel",
    async execute(interaction, client, color) {

        const Guild = require('../../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    punishmentChannelID: "none",
                    pollID: 0,
                    logEnabled: true,
                    modEnabled: true,
                    levelEnabled: false,
                        welcomeEmbed: true,
                    pollEnabled: true,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                        leaveEnabled: true,
                    roleEnabled: false,
                    mainRole: "none",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                    levelCard: false,
                    levelEmbed: true,
                    levelMessage: "{user} just leveled up to level **{level}**!",
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Added this server to the database, please run that command again.`)
            ]
        }).catch((err => { }));

        const msg = await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Mention** the new suggestions channel within 15 seconds.`)
                    .setColor(color)
            ], ephemeral: true, fetchReply: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Cancel',
                            customId: "general_suggestions_channel_cancel"
                        }),
                    ]
                })
            ]
        });

        const filter = m => interaction.user === m.author;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async m => {
            if (!m) return;
            const channel = m.mentions.channels.first();
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            await guildDatabase.updateOne({
                suggestChannelID: channel
            });

            const updated = new MessageEmbed()
                .setDescription(`Succesfully changed the suggestions channel to ${channel}`)
                .setColor(color)
            m.channel.send({ embeds: [updated] }).catch(( err => { } ))

            collector.stop();
            return;
        });


        const collectorCancel = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

        collectorCancel.on('collect', async interaction => {
            if (interaction.customId === "general_suggestions_channel_cancel") {

                collector.stop();

                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Cancelled.`)
                            .setColor(color)
                    ], ephemeral: true, components: []
                }).catch(( err => { } ))

            }
        });
    }
}