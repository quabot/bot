const discord = require('discord.js');
const fs = require('fs');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json')

module.exports = {
    name: "quabot",
    description: "This command is for testing purposes.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "bot-suggestion",
            description: "A suggestion you have for QuaBot.",
            type: "STRING",
            required: false,
        },
        {
            name: "bug-report",
            description: "A bug report related to quabot.",
            type: "STRING",
            required: false,
        },
    ],
    async execute(client, interaction) {
        const suggestion = interaction.options.getString('bot-suggestion');
        const report = interaction.options.getString('bug-report');
        if (suggestion) {
            const dataInFile = fs.readFileSync("files/suggestions.txt", "utf8");
            let data = `${dataInFile}\n\nUser: ${interaction.user.username}#${interaction.user.discriminator}\nUser-ID: ${interaction.user.id}\nSuggestion: ${suggestion}`;

            fs.writeFile("files/suggestions.txt", data, (err) => {
                if (err)
                    console.log(err);
                else {
                    console.log("New suggestion:\n" + suggestion);
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.SUGGEST_COLOR)
                        .setTitle("Bot Suggestion Left")
                        .setDescription("The developers have recieved your suggestion!")
                        .addField(`Suggestion`, `${suggestion}`)
                        .setFooter("This is a quabot suggestion!")
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                }
                return;
            });
        }
        if (report) {
            const dataInFile = fs.readFileSync("files/reports.txt", "utf8");
            let data = `${dataInFile}\n\nUser: ${interaction.user.username}#${interaction.user.discriminator}\nUser-ID: ${interaction.user.id}\nBug-Report: ${report}`;

            fs.writeFile("files/reports.txt", data, (err) => {
                if (err)
                    console.log(err);
                else {
                    console.log("New report:\n" + report);
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.REPORT_COLOR)
                        .setTitle("Bug Report Left")
                        .setDescription("The developers have recieved your bug report!")
                        .addField(`Bug report`, `${report}`)
                        .setFooter("This is a quabot bug report! ")
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                }
                return;
            });
        }
        if (!report && !suggestion) {
            const embed = new discord.MessageEmbed()
                .setColor(colors.RED)
                .setTitle(":x: Nothing recieved!")
                .setDescription("You can leave suggestions and bugreports with this command for the developers. We didn't recieve anything this time! Please try again!")
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        }
    }
}
