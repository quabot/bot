module.exports = {
    name: "reopen",
    description: "This command allows you to add a user to your support ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "channel",
            description: "The channel to reopen",
            type: "CHANNEL",
            required: true,
        },
    ],
    async execute(client, interaction) {

        return interaction.reply("Coming soon.")

    }
}