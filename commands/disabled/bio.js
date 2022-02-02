const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "bio",
    description: "Set your bio.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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
                                    interaction.channel.send({ embeds: [errorMain] });
                                });
                        }
                    });
                    const bio = interaction.options.getString("bio");
                    const embed = new discord.MessageEmbed()
                        .setTitle("Set your bio!")
                        .setDescription("Use `!profile` to view your bio!")
                        .setFooter("TIP: We support nitro emojis in bios.")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });

                    await userDatabase.updateOne({
                        bio: `${bio}`,
                    });
                    break;
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}