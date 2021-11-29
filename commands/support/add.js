module.exports = {
    name: "add",
    description: "Add a user to your ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "User to add",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
        }

        const user = interaction.options.getUser('user');

        interaction.channel.permissionOverwrites.edit(user, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
        });

        interaction.reply(`Adding ${user} to your support ticket!`);

    }
}