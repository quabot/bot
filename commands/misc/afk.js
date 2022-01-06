const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "afk",
    description: "Set an afk status when mentioned.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "toggle",
            description: "Toggle your afk status.",
            type: "SUB_COMMAND",
        },
        {
            name: "status",
            description: "Set an afk status message.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "status",
                    description: "The status to set.",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "reset",
            description: "Reset your afk status.",
            type: "SUB_COMMAND",
        },
    ],
    async execute(client, interaction) {

        try {
            const { options } = interaction;
            const Sub = options.getSubcommand();

            switch (Sub) {
                case "toggle": {
                    const User = require('../../schemas/UserSchema');
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
                                typeScore: 0,
                                kickCount: 0,
                                banCount: 0,
                                warnCount: 0,
                                muteCount: 0,
                                afk: true,
                                afkStatus: "none",
                            });
                            newUser.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [errorMain] });
                                });
                        }
                    });
                    if (userDatabase.afk === true) {
                        await userDatabase.updateOne({
                            afk: false
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle("You are now no longer afk!")
                            .setDescription("You can become afk again by using `/afk toggle` once more.")
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [embed] });
                        return;
                    } else {
                        await userDatabase.updateOne({
                            afk: true
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle("You are now afk!")
                            .setDescription("When you're mentioned, we will alert the person that mentioned you that you're afk. You can get out of AFK mode by chatting, or using `/afk toggle` again. You can add a message to your AFK status that will be sent when you're mentioned with `/afk status`!")
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [embed] });
                    }
                    break;
                }
                case "status": {
                    const status = interaction.options.getString("status");
                    const User = require('../../schemas/UserSchema');
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
                                typeScore: 0,
                                kickCount: 0,
                                banCount: 0,
                                warnCount: 0,
                                muteCount: 0,
                                afk: true,
                                afkStatus: "none",
                            });
                            newUser.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [errorMain] });
                                });
                        }
                    });
                    await userDatabase.updateOne({
                        afkStatus: `${status}`
                    });
                    const embed = new discord.MessageEmbed()
                        .setTitle("Status set!")
                        .setDescription(`Your status message is now set to **${status}**! If you want to reset it, use \`/afk reset\`.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                    break;
                }
                case "reset": {
                    const User = require('../../schemas/UserSchema');
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
                                typeScore: 0,
                                kickCount: 0,
                                banCount: 0,
                                warnCount: 0,
                                muteCount: 0,
                                afk: true,
                                afkStatus: "none",
                            });
                            newUser.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [errorMain] });
                                });
                        }
                    });
                    await userDatabase.updateOne({
                        afkStatus: "none",
                        afk: false,
                    });
                    const embed3 = new discord.MessageEmbed()
                        .setTitle("Status reset!")
                        .setDescription(`Your status message has been disabled and you are no longer afk.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed3] });
                    break;
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}