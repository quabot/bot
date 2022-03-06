const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error } = require('../../embeds/general');

module.exports = {
    name: "afk",
    description: "Set an afk status when mentioned.",
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
                                bio: "none",
                            });
                            newUser.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                                });
                        }
                    }).clone().catch(function (err) { console.log(err) });
                    if (userDatabase.afk === true) {
                        await userDatabase.updateOne({
                            afk: false
                        });
                        const embed = new MessageEmbed()
                            .setTitle("You are now no longer afk!")
                            .setDescription("You can become afk again by using `/afk toggle` once more.")
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
                        return;
                    } else {
                        await userDatabase.updateOne({
                            afk: true
                        });
                        const embed = new MessageEmbed()
                            .setTitle("You are now afk!")
                            .setDescription("When you're mentioned, we will alert the person that mentioned you that you're afk. You can get out of AFK mode by chatting, or using `/afk toggle` again. You can add a message to your AFK status that will be sent when you're mentioned with `/afk status`!")
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
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
                                bio: "none",
                            });
                            newUser.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                                });
                        }
                    }).clone().catch(function (err) { console.log(err) });
                    await userDatabase.updateOne({
                        afkStatus: `${status}`
                    });
                    const embed = new MessageEmbed()
                        .setTitle("Status set!")
                        .setDescription(`Your status message is now set to **${status}**! If you want to reset it, use \`/afk reset\`.`)
                        .setColor(COLOR_MAIN)
                        
                    interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
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
                                bio: "none",
                            });
                            newUser.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                                });
                        }
                    }).clone().catch(function (err) { console.log(err) });
                    await userDatabase.updateOne({
                        afkStatus: "none",
                        afk: false,
                    });
                    const embed3 = new MessageEmbed()
                        .setTitle("Status reset!")
                        .setDescription(`Your status message has been disabled and you are no longer afk.`)
                        .setColor(COLOR_MAIN)
                        
                    interaction.reply({ embeds: [embed3] }).catch(err => console.log(err));
                    break;
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: avatar`)] }).catch(err => console.log(err));;
            return;
        }
    }
}