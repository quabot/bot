import type { Client, ColorResolvable, SelectMenuInteraction } from 'discord.js';

module.exports = {
    name: 'help',
    async execute(_client: Client, interaction: SelectMenuInteraction, _color: ColorResolvable) {
        await interaction.reply('need help? go to hell!');
    },
};
