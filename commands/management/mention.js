const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "mention",
    description: "By using this command you will mention the entire guild (so you don't take the blame).",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const ebed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle(":white_check_mark: Mentioned everyone!")
            interaction.reply({ embeds: [ebed] });
            setTimeout(() => {
                interaction.deleteReply()
            }, 3000);
            interaction.channel.send(`@everyone`).then(m => {
                m.delete();
            });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}