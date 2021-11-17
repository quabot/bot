const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "avatar",
    description: "By using this command you will be able to view either your own profile picture or another users'.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "A user to get the avatar of.",
            type: "USER",
            required: false,
        }
    ],
    async execute(client, interaction) {

        try {
            let user = interaction.options.getUser('user') || interaction.user;
            let author = interaction.user;
            let avatar = user.displayAvatarURL({ size: 1024, dynamic: true });

            const embed = new discord.MessageEmbed()
                .setTitle(`Avatar of ${user.username}`)
                .setImage(avatar)
                .setColor(colors.COLOR)
                .setFooter(`Requested by: ${author.tag}`)
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}