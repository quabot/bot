module.exports = {
    name: "close",
    description: "This command allows you to close your support ticket.",
    done: "false",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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