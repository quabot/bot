const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "bio",
    description: "Set a bio.",
    options: [
        {
            name: "set",
            description: "Set your bio on your server profile.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "bio",
                    description: "The bio to set it to.",
                    type: "STRING",
                    required: true,
                }
            ]
        },
    ],
    async execute(client, interaction) {
        try {
            const { options } = interaction;
            const Sub = options.getSubcommand();

            switch (Sub) {
                case "set": {
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
                    }).clone().catch(function (err) { console.log(err) })
                    .catch(err => console.log(err));
                    if (!userDatabase) return;
                    const bio = interaction.options.getString("bio");
                    const embed = new MessageEmbed()
                        .setTitle("Set your bio!")
                        .setDescription("Use `/profile` to view your bio!")
                        .setFooter("TIP: We support nitro emojis in bios.")
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] }).catch(err => console.log(err));

                    await userDatabase.updateOne({
                        bio: `${bio}`,
                    }).catch(err => console.log(err));
                    break;
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: bio`)] }).catch(err => console.log(err));
            return;
        }
    }
}