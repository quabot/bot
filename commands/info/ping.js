const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "ping",
    description: "Your ping.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            interaction.reply({ embeds: [PingGetting]}).then(m => {
            var ping = Date.now() - interaction.createdTimestamp;

            const YourPing = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle(`:white_check_mark: Your current ping is: **${ping}ms**.`);

            interaction.editReply({ embeds: [YourPing]})
        })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}