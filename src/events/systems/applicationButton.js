const { Client, Message, Events } = require('discord.js');
const { getUser } = require('../../utils/configs/user');
const { Embed } = require('../../utils/constants/embed');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const Application = require('../../structures/schemas/Application');

module.exports = {
    event: Events.InteractionCreate,
    name: "applicationButton",
    /**
    * @param {import('discord.js').Interaction} interaction
    * @param {Client} client 
    */
    async execute(interaction, client) {
        if (!interaction.isButton() || !interaction.guildId) return;

        const id = interaction.customId;

        if (!id.startsWith('applications-fill-')) return;
        const appid = id.slice(18, id.length);
        if (!appid) return interaction.reply({ content: 'The application form id couldn\'t be found.', ephemeral: true });

        const application = await Application.findOne({ id: appid, guildId: interaction.guildId });
        if (!application) return interaction.reply({ content: 'The application form couldn\'t be found.', ephemeral: true });
    }
}