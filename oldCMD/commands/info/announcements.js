const discord = require("discord.js");

const colors = require('../../files/colors.json');
const {  errorMain } = require('../../files/embeds');

module.exports = {
    name: "announcement",
    description: "This command is used to give info about new quabot patches.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("QuaBeta Update - 15 November")
                .addField("General Changes", "- Changed time to send image on image-related commands to be variable (as fast as it can be)\n- Changed meme command.\n- Fixed `/rps  timeout after 15 seconds.\n- Added a mention to level up message.\n- Added a button to `/meme , `/cat` and `/dog` to get a next image.")
                .addField("Commmands", "- Added a `/mention` command.\n- Updated slash command descriptions.\n- Added a `/close` command.\n- Added a `/admin` command.\n- Added a `/add` command.\n- Added a `/delete` command.\n")
                .addField("Ticket Changes", "\n- Added embedded messages.\n- Added a closed ticket category.\n- Added buttons to close and reopen tickets.\n- Added topics to tickets.\n- Added a new way for users to create tickets (see `/admin`).")
                .addField("In progress", "- `/reopen [#channel]`\n- `/settopic [topic]`\n- Polls system\n- Welcome roles\nAnd a lot more :)")
                .setTimestamp(1637013600000)
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}