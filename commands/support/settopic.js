module.exports = {
    name: "settopic",
    description: "Change a ticket's topic.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "newtopic",
            description: "New topic",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

        return interaction.reply("Coming soon.")

    }
}