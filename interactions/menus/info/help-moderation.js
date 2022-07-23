const { EmbedBuilder } = require("discord.js");

module.exports = {
    value: "moderation_commands",
    async execute(interaction, client, color) {

        const { promisify } = require('util');
        const { glob } = require("glob");
        const PG = promisify(glob);

        const cmdList = (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/moderation/*/main.js`)).map((file) => {
            const item = require(file);
            return `**/${item.name}** - ${item.description}`
        }).join('\n');  

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Moderation Commands`)
                    .setDescription(`Ban users, warn them and so much more, these are the moderation commands.
                    ${cmdList}`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}