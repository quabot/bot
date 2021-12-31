const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase } = require('../../files/embeds');
const { embed } = require('../../files/embeds/botadd');
const { main } = require('../../files/interactions/botadd');

module.exports = {
    name: "debug",
    description: "Debug testing",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "type",
            description: "The debug you want to run",
            type: "STRING",
            required: true,
            choices: [
                { name: "botadd", value: "botadd" },
                { name: "test", value: "test" }
            ]
        },
    ],
    async execute(client, interaction) {

        try {
            if (interaction.options.getString("type") === "botadd") {
                let channel = interaction.guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);

                channel.send({ embeds: [embed], components: [main] });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}