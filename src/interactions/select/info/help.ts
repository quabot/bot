import { Client, CommandInteraction } from "discord.js"

module.exports = {
    id: 'help',
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        interaction.reply('need help? go to hell!')
    }
}