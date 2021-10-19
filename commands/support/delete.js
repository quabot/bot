module.exports = {
    name: "delete",
    description: "This command allows you to close delete a support ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    done: "false",
     options: [
        {
            name: "user",
            description: "A user to ban",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction) {



    }
}