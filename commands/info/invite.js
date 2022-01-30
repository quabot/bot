const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "invite",
    description: "QuaBot server invite.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const YourPing = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setDescription(`Invite me here: [Click Me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631&redirect_uri=https://quabot.net/added.html&response_type=code)`);
            interaction.reply({ embeds: [YourPing] })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
