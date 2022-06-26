module.exports = {
    name: "command",
    command: "bot",
    async execute(client, interaction) {

        interaction.reply("Subcommand number 2 for `/bot`")

    }
}