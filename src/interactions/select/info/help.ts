import { Client, SelectMenuInteraction } from "discord.js"

module.exports = {
    id: 'help',
    async execute(client: Client, interaction: SelectMenuInteraction, color: any) {
        interaction.reply('need help? go to hell!')
    }
}