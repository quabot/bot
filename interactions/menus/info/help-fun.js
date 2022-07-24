const { EmbedBuilder } = require("discord.js");

module.exports = {
    value: "fun_commands",
    async execute(interaction, client, color) {

        const { promisify } = require('util');
        const { glob } = require("glob");
        const PG = promisify(glob);

        const cmdList = (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/fun/*/main.js`)).map((file) => {
            const item = require(file);
            return `**/${item.name}** - ${item.description}`
        }).join('\n');

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Fun Commands`)
                    .setDescription(`Play a game, get a meme or ask a question, these are the fun commands.
                    ${cmdList}`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}