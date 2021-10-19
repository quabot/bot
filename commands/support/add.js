module.exports = {
    name: "add",
    description: "This command allows you to add a user to your support ticket.",
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