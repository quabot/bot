const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    name: "afk",
    description: 'Set your afk status.',
    options: [
        {
            name: "settings",
            description: "Toggle your afk status, or reset it.",
            type: "SUB_COMMAND",
        },
        {
            name: "status",
            description: "See if you're afk and view your message.",
            type: "SUB_COMMAND",
        },
        {
            name: "set",
            description: "Set your afk status.",
            type: "SUB_COMMAND",
        }
    ],
    async execute(client, interaction, color) {
        try {

            const subCmd = interaction.options.getSubcommand();

            const User = require('../../structures/schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        banCount: 0,
                        kickCount: 0,
                        timeoutCount: 0,
                        warnCount: 0,
                        updateNotify: true,
                        lastNotify: "none",
                        afk: false,
                        afkMessage: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!userDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`We added you to the database! Please run that command again.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch(err => console.log(err));

            switch (subCmd) {
                case 'settings':

                    const afkTrueId = 'afkEn'
                    const afkFalseId = 'afkDis'
                    const afkResetId = 'afkReset'
                    const enableAfk = new MessageButton({
                        style: 'SUCCESS',
                        label: 'Enable AFK',
                        customId: afkTrueId
                    });
                    const disableAfk = new MessageButton({
                        style: 'DANGER',
                        label: 'Disable AFK',
                        customId: afkFalseId
                    });
                    const resetAfk = new MessageButton({
                        style: 'SECONDARY',
                        label: 'Reset AFK',
                        customId: afkResetId
                    });

                    const afkMsg = await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Pick your afk options below this message.`)
                                .setColor(color)
                        ], ephemeral: true, fetchReply: true,
                        components: [new MessageActionRow({ components: [enableAfk, disableAfk, resetAfk] })]
                    }).catch(err => console.log(err));

                    const collectorRepeat = afkMsg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                    collectorRepeat.on('collect', async interaction => {
                        if (interaction.customId === afkFalseId) {
                            await userDatabase.updateOne({
                                afk: false
                            });

                            interaction.update({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription(`You are no longer afk.`)
                                        .setColor(color)
                                ],
                                components: [new MessageActionRow({ components: [enableAfk, disableAfk, resetAfk] })]
                            }).catch(err => console.log(err));

                        } else if (interaction.customId === afkResetId) {
                            await userDatabase.updateOne({
                                afk: false,
                                afkMessage: "none",
                            });

                            interaction.update({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription(`Reset your afk status & message.`)
                                        .setColor(color)
                                ],
                                components: [new MessageActionRow({ components: [enableAfk, disableAfk, resetAfk] })]
                            }).catch(err => console.log(err));

                        } else if (interaction.customId === afkTrueId) {
                            await userDatabase.updateOne({
                                afk: true
                            });

                            interaction.update({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription(`You are now afk.`)
                                        .setColor(color)
                                ],
                                components: [new MessageActionRow({ components: [enableAfk, disableAfk, resetAfk] })]
                            }).catch(err => console.log(err));
                        }
                    });
                    break;

                case 'set':

                    const setAfk = new Modal()
                        .setCustomId('afk-set')
                        .setTitle('Set your AFK message')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('afk-status')
                                .setLabel('Enter your new status')
                                .setStyle('SHORT')
                                .setMinLength(1)
                                .setMaxLength(150)
                                .setPlaceholder('I\'m sleeping...')
                                .setRequired(true)
                        );

                    showModal(setAfk, {
                        client: client,
                        interaction: interaction
                    });

                    break;

                case 'status':
                    let trueFalse = `${userDatabase.afk}`;
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`You are currently ${trueFalse.replace("true", "**afk**").replace("false", "**not afk**")}. Your afk status message is set to: **${userDatabase.afkMessage}**`)
                                .setColor(color)
                        ], ephemeral: true,
                    }).catch(err => console.log(err));
                    break;
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}