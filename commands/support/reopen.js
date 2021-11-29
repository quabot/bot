module.exports = {
    name: "reopen",
    description: "Reopen a ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "channel",
            description: "Ticket to reopen",
            type: "CHANNEL",
            required: false,
        },
    ],
    async execute(client, interaction) {

        return interaction.reply("Coming soon.")

    }
}