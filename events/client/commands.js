const consola = require('consola');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
        if (!interaction.isCommand()) {
            if (interaction.isSelectMenu()) {
                consola.info(`${interaction.values[0]} was selected`);
            }
            client.guilds.cache.get('957024489638621185').channels.cache.get('957024582794104862').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${interaction.customId}** in **${interaction.guild.name}**`)] }).catch(( err => { } ));
        }
        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            if (command.permission) {
                if (!interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.`, ephemeral: true })
                }
            }

            command.execute(client, interaction, color);
            consola.info(`/${command.name} was used`);
            client.guilds.cache.get('957024489638621185').channels.cache.get('957024490318094369').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${command.name}** in **${interaction.guild.name}**`)] }).catch(( err => { } ))

            return; // notification system is under maintenance
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
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!userDatabase) return;

            let lastNotif = userDatabase.lastNotify;

            if (userDatabase.updateNotify === false) return;

            if (lastNotif !== "none" || lastNotif !== undefined) {
                lastNotif = parseInt(lastNotif);
                lastNotif = lastNotif;

                let newNotif = 1651090867546; // SET THIS TO THE TIME THE NEW ANNOUNCEMENT CAME OUT (get it with new Date().getTime())

                if (lastNotif > newNotif) return;
            }

            await userDatabase.updateOne({
                lastNotify: new Date().getTime()
            });

            interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`> ${interaction.user}, new alert: QuaBot v3.0.0 has released! [Changes](https://quabot.net/)`)
                        .setColor(color)
                ],
                components: [new MessageActionRow({
                    components: [new MessageButton({
                        style: 'PRIMARY',
                        label: 'Mark as read',
                        customId: "notifRead"
                    })]
                })]
            }).catch(( err => { } ))
        }
    }
}