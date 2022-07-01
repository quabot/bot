module.exports = {
    name: "lock",
    permission: "ADMINISTRATOR",
    description: "Lock a channel.",
    options: [
        {
            name: "all",
            description: "Lock all channels in the server.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "duration",
                    description: "Duration to lock the channel.",
                    required: true,
                    type: "STRING"
                },
                {
                    name: "reason",
                    description: "Reason for locking all channels.",
                    required: false,
                    type: "STRING"
                },
                {
                    name: "announce",
                    description: "Announce that channels have been locked to all channels.",
                    required: false,
                    type: "BOOLEAN"
                }
            ]
        },
        {
            name: "channel",
            type: "SUB_COMMAND",
            description: "Lock an individual channel.",
            options: [
                {
                    name: "channel",
                    type: "CHANNEL",
                    required: true,
                    description: "The channel to lock.",
                },
                {
                    name: "message",
                    type: "STRING",
                    required: true,
                    description: "Reason for locking the channel.",
                },
                {
                    name: "duration",
                    type: "STRING",
                    required: false,
                    description: "Duration to lock the channel.",
                },
                {
                    name: "announce",
                    description: "Announce that the channel has been locked to the channel.",
                    required: false,
                    type: "BOOLEAN"
                }
            ]
        }
    ],
    async execute(client, interaction, color) {

        // This command just sets the options. 
        
    }
}