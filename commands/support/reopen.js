module.exports = {
    name: "reopen",
    description: "This command allows you to reopen a closed support ticket.",
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