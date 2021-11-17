module.exports = {
    name: "settopic",
    description: "This command allows you to change your support ticket's name.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "newtopic",
            description: "The topic to change to.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

        return interaction.reply("Coming soon.")

    }
}