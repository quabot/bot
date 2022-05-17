const { MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent, Message } = require('discord.js');

const ms = require('ms');

module.exports = {
    name: "poll",
    description: 'Manage polls.',
    options: [
        {
            name: "create",
            description: "Create a poll.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    type: "CHANNEL",
                    required: true,
                    description: "Channel to create the poll in."
                },
                {
                    name: "options",
                    type: "INTEGER",
                    required: true,
                    description: "Amount of poll choices.",
                    choices: [
                        { name: "2", value: 2 },
                        { name: "3", value: 3 },
                        { name: "4", value: 4 },
                    ]
                },
                {
                    name: "duration",
                    type: "STRING",
                    required: true,
                    description: "How long the poll will last.",
                },
            ]
        },
        {
            name: "end",
            description: "End a poll.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "id",
                    type: "INTEGER",
                    required: true,
                    description: "The poll id to end."
                }
            ]
        },
        // {
        //     name: "setduration",
        //     description: "Set a new poll duration.",
        //     type: "SUB_COMMAND",
        //     options: [
        //         {
        //             name: "id",
        //             type: "INTEGER",
        //             required: true,
        //             description: "The poll id to change the duration of."
        //         },
        //         {
        //             name: "new-duration",
        //             type: "STRING",
        //             required: true,
        //             description: "The new duration for the poll."
        //         }
        //     ]
        // }
    ],
    permission: "ADMINISTRATOR",
    async execute(client, interaction, color) {
        try {

            const subCmd = interaction.options.getSubcommand();

            const Poll = require('../../structures/schemas/PollSchema');
            const Guild = require('../../structures/schemas/GuildSchema');
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
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Added this server to the database! Please run that command again.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }))

            if (guildDatabase.pollEnabled === "false") return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Polls are disabled in this server! Ask an admin to enable them with \`/config general\``)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }))

            switch (subCmd) {
                case 'create':
                    const channel = interaction.options.getChannel("channel");
                    const options = interaction.options.getInteger("options");
                    const duration = interaction.options.getString("duration");

                    if (channel.type !== "GUILD_TEXT") return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Please enter a valid text channel.`)
                        ], ephemeral: true
                    });

                    if (!ms(duration)) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Please enter a valid poll duration.`)
                        ], ephemeral: true
                    });

                    const msg = await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Click the button below this message to enter the details for the poll.`)
                                .addFields(
                                    { name: "Channel", value: `${channel}`, inline: true },
                                    { name: "Duration", value: `${duration}`, inline: true },
                                    { name: "Choices", value: `${options}`, inline: true },
                                )
                        ], ephemeral: true,
                        components: [
                            new MessageActionRow({
                                components: [
                                    new MessageButton({
                                        style: 'PRIMARY',
                                        label: 'Enter Details',
                                        customId: "createPoll"
                                    })]
                            })
                        ], fetchReply: true,
                    });

                    const collectorRepeat = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                    collectorRepeat.on('collect', async interaction => {
                        if (interaction.customId === "createPoll") {
                            const modal = new Modal()
                                .setCustomId('poll')
                                .setTitle('Create a poll!')

                            const pollRow = new MessageActionRow()
                                .addComponents(
                                    new TextInputComponent()
                                        .setCustomId('poll-question')
                                        .setLabel('Enter the poll question.')
                                        .setStyle('SHORT')
                                        .setMinLength(1)
                                        .setMaxLength(200)
                                        .setPlaceholder('Should we start a giveaway?')
                                        .setRequired(true)
                                );

                            modal.addComponents(pollRow);

                            for (let i = 0; i < options; i++) {

                                modal.addComponents(
                                    new MessageActionRow()
                                        .addComponents(
                                            new TextInputComponent()
                                                .setCustomId(`${i + 1}`)
                                                .setLabel(`Enter choice ${i + 1}`)
                                                .setStyle('SHORT')
                                                .setMinLength(1)
                                                .setMaxLength(200)
                                                .setRequired(true)
                                        ));
                            }

                            await interaction.showModal(modal);

                        }
                    });


                    const pollId = parseInt(guildDatabase.pollID) + 1;
                    await guildDatabase.updateOne({
                        pollID: pollId,
                    });

                    const newPoll = new Poll({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        pollId: pollId,
                        channelId: channel.id,
                        msgId: "none",
                        options: options,
                        duration: duration,
                        interactionId: msg.id,
                        createdTime: new Date().getTime(),
                        endTimestamp: "none",
                        ended: false,
                    });
                    newPoll.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });

                    break;

                case 'end':
                    const id = interaction.options.getInteger("id");

                    const polldb2 = await Poll.findOne({
                        guildId: interaction.guild.id,
                        pollId: id,
                    }, (err, poll) => {
                        if (err) console.error(err);
                        if (!poll) return;
                    }).clone().catch(function (err) { console.log(err) });

                    if (!polldb2) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`That poll does not exist.`)
                                .setColor(color)
                        ], ephemeral: true
                    }).catch((err => { }))

                    await polldb2.updateOne({
                        endTimestamp: new Date().getTime() + 3000
                    });

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Succesfully ended poll.`)
                                .setColor(color)
                        ], ephemeral: true
                    }).catch((err => { }))
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}