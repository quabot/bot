const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { execute } = require("../../events/systems/welcomeRole");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-event')
        .setDescription('Test the event system')
        .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        interaction.reply('Running...')

        await execute(interaction.member, client);
    }
}