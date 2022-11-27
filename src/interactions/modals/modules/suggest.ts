import type { Client, ColorResolvable, ModalSubmitInteraction } from 'discord.js';

module.exports = {
    name: 'suggest',
    async execute(_client: Client, interaction: ModalSubmitInteraction, _color: ColorResolvable) {
        await interaction.reply('your sugestion? go to hell!');
    },
};
