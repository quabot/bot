const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: "user",
    description: 'Configure user preferences & settings.',
    options: [
        {
            name: "bio",
            description: "Set your profile bio.",
            type: "SUB_COMMAND",
            options: [
                { name: "set", description: "Your new bio.", required: true, type: "STRING" }
            ]
        },
        {
            name: "settings",
            description: "Configure your peferences & settings.",
            type: "SUB_COMMAND",
        }
    ],
    async execute(client, interaction, color) {
        try {

            const subCmd = interaction.options.getSubcommand()

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

                    const updateNotifId = 'updNotId';
                    const updateNotif = new MessageButton({
                        style: 'PRIMARY',
                        label: 'Update Notifications',
                        customId: updateNotifId
                    });

                    let trueFalse = `${userDatabase.updateNotify}`;

                    const settingsMsg = await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`User Settings`)
                                .addField("Update notifications", `Get notified when QuaBot updates.\nYou currently have this: **${trueFalse.replace("true", "enabled").replace("false", "disabled")}**`)
                                .setColor(color)
                                .setFooter({ text: "Toggle these settings with the buttons below this message." })
                        ], ephemeral: true, fetchReply: true,
                        components: [new MessageActionRow({ components: [updateNotif] })]
                    }).catch(err => console.log(err));

                    const collector = settingsMsg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                    collector.on('collect', async interaction => {
                        if (interaction.customId === updateNotifId) {
                            if (userDatabase.updateNotify === true) {

                                await userDatabase.updateOne({
                                    updateNotify: false,
                                });

                                interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription("Disabled update notifications.")
                                    ], ephemeral: true,
                                }).catch(err => console.log(err));

                            } else if (userDatabase.updateNotify === false) {

                                await userDatabase.updateOne({
                                    updateNotify: false,
                        lastNotify: "none",
                                });

                                interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription("Enabled update notifications.")
                                    ], ephemeral: true,
                                }).catch(err => console.log(err));

                            } else {
                                interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription("There was an error - But: don't worry: just run the command again.")
                                    ], ephemeral: true,
                                }).catch(err => console.log(err));
                            }
                        }
                    });
                    break;

                case 'bio':
                    interaction.reply("This feature is coming with the `/profile` update!")
                    break;
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}