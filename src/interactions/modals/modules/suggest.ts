import { Client, ModalSubmitInteraction } from 'discord.js';

module.exports = {
    id: 'suggest',
    async execute(client: Client, interaction: ModalSubmitInteraction, color: any) {
        interaction.reply('your sugestion? go to hell!');
    },
};
