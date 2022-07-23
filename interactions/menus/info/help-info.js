const { EmbedBuilder } = require("discord.js");

module.exports = {
    value: "info_commands",
    async execute(interaction, client, color) {

        const { promisify } = require('util');
        const { glob } = require("glob");
        const PG = promisify(glob);

        const cmdList = (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/info/*/main.js`)).map((file) => {
            const item = require(file);
            return `**/${item.name}** - ${item.description}`
        }).join('\n');  

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Info Commands`)
                    .setDescription(`Bot status, ping, info about a user, these are the info commands.
                    ${cmdList}`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}