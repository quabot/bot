const { EmbedBuilder } = require("discord.js");

module.exports = {
    value: "system_commands",
    async execute(interaction, client, color) {

        const { promisify } = require('util');
        const { glob } = require("glob");
        const PG = promisify(glob);

        const cmdList = (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/systems/*/main.js`)).map((file) => {
            const item = require(file);
            return `**/${item.name}** - ${item.description}`
        }).join('\n');  

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Module Commands`)
                    .setDescription(`View your XP, leave suggestions, create a ticket and so much more, these are the other commands.
                    ${cmdList}`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}