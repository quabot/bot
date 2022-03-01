const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "quabot",
    description: "Report bugs or leave suggestions for the quabot team.",
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

        try {
            const suggestion = interaction.options.getString('bot-suggestion');
            const report = interaction.options.getString('bug-report');
            if (suggestion) {
                const embed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle("Bot Suggestion Left")
                    .setDescription("The developers have recieved your suggestion!")
                    .addField(`Suggestion`, `${suggestion}`)
                    .setFooter("This is a quabot suggestion!")
                    .setTimestamp()
                interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
                client.guilds.cache.get('847828281860423690').channels.cache.get('940913767242403890').send({ embeds: [new MessageEmbed().setDescription(`${suggestion}`).setColor(COLOR_MAIN).setFooter(`Suggestion`)] }).catch(err => console.log(err));
            }
            if (report) {
                const embed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle("Bug Report Left")
                    .setDescription("The developers have recieved your bug report!")
                    .addField(`Bug`, `${report}`)
                    .setFooter("This is a quabot bug report!")
                    .setTimestamp()
                interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
                client.guilds.cache.get('847828281860423690').channels.cache.get('940914011271204895').send({ embeds: [new MessageEmbed().setDescription(`${report}`).setColor(COLOR_MAIN).setFooter(`Bug Report`)] }).catch(err => console.log(err));
            }
            if (!report && !suggestion) {
                const embed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(":x: Nothing recieved!")
                    .setDescription("You can leave suggestions and bugreports with this command for the developers. We didn't recieve anything this time! Please try again!")
                    .setTimestamp()
                interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
