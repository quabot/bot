const { EmbedBuilder } = require("discord.js");

module.exports = {
    value: "management_commands",
    async execute(interaction, client, color) {

        const { promisify } = require('util');
        const { glob } = require("glob");
        const PG = promisify(glob);

        const cmdList = (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/management/*/main.js`)).map((file) => {
            const item = require(file);
            return `**/${item.name}** - ${item.description}`
        }).join('\n');  

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Management Commands`)
                    .setDescription(`Make reaction roles, purge a channel, these are the management commands.
                    ${cmdList}`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}