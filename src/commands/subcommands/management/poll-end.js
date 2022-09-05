const { getPollConfig } = require("../../../structures/functions/config");
const { generateEmbed } = require("../../../structures/functions/embed");
const { endPoll } = require("../../../structures/functions/guilds");

module.exports = {
    name: "end",
    command: "poll",
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true });
        const id = interaction.options.getInteger("id");

        const pollConfig = await getPollConfig(client, interaction.guildId);
        if (!pollConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new database record! Please run that command again.")], ephemeral: true
        }).catch((e => { }));

        if (pollConfig.pollEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Polls are not enabled in this server. Toggle them on [our dashboard](https://dashboard.quabot.net).")], ephemeral: true
        }).catch((e => { }));

        
        const Poll = require('../../../structures/schemas/PollSchema');
        const document = await Poll.findOne({
            guildId: interaction.guildId,
            pollId: id,
        }).clone().catch((e => { }));

        if (!document) return interaction.editReply({
            embeds: [await generateEmbed(color, "That poll doesn't exist/has been ended already.")], ephemeral: true
        }).catch((e => { }));

        await endPoll(client, document, color);

        interaction.editReply({
            embeds: [await generateEmbed(color, "Ending the poll.")], ephemeral: true
        }).catch((e => { }));
    }
}