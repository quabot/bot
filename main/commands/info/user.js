const { MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent } = require('discord.js');
module.exports = {
    name: "user",
    description: 'Configure user preferences & settings.',
    options: [
        {
            name: "settings",
            description: "Configure your peferences & settings.",
            type: "SUB_COMMAND",
        }
    ],
    async execute(client, interaction, color) {
        try {

            const subCmd = interaction.options.getSubcommand()

            // get the database
            const GlobalUser = require('../../../structures/schemas/GlobalUser');
            const userDatabase = await GlobalUser.findOne({
                userId: interaction.user.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new GlobalUser({
                        userId: interaction.user.id,
                        updateNotify: true,
                        lastNotify: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                        });
                }
            }).clone().catch(function (err) {  });

            // failsaves
            if (!userDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`We added you to the database! Please run that command again.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }))


            // handle the commands
            switch (subCmd) {
                case 'settings':

                    // create buttons and send message
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
                    }).catch((err => { }))

                    const collector = settingsMsg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                    // listen for buttons and return
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
                                }).catch((err => { }))

                            } else if (userDatabase.updateNotify === false) {

                                await userDatabase.updateOne({
                                    updateNotify: true,
                                    lastNotify: "none",
                                });

                                interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription("Enabled update notifications.")
                                    ], ephemeral: true,
                                }).catch((err => { }))

                            } else {
                                interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription("There was an error - But: don't worry: just run the command again.")
                                    ], ephemeral: true,
                                }).catch((err => { }))
                            }
                        }
                    });
                    break;

            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}