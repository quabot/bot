module.exports = {
    name: "music",
    description: "Play music in any voice channel.",
    options: [
        {
            name: "play",
            description: "Play a song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "search",
                    description: "The song name or spotify, youtube or soundcloud link - playlists are supported!",
                    type: "STRING",
                    required: true,
                },
            ]
        },
        {
            name: "search",
            description: "Search for a song and play a song of the results.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "search",
                    description: "The song name or spotify, youtube or soundcloud link - playlists are supported!",
                    type: "STRING",
                    required: true,
                },
            ]
        },
        {
            name: "skip",
            description: "Skip a song.",
            type: "SUB_COMMAND",
        },
        {
            name: "filters",
            description: "Set a music filter.",
            type: "SUB_COMMAND",
            options: [{
                name: "option", description: "Pick an option.", type: "STRING", required: true,
                choices: [
                    { name: "off", value: "false" },
                    { name: "3d", value: "3d" },
                    { name: "bassboost", value: "bassboost" },
                    { name: "echo", value: "echo" },
                    { name: "karaoke", value: "karaoke" },
                    { name: "nightcore", value: "nightcore" },
                    { name: "vaporwave", value: "vaporwave" },
                    { name: "flanger", value: "flanger" },
                    { name: "gate", value: "gate" },
                    { name: "haas", value: "haas" },
                    { name: "reverse", value: "reverse" },
                    { name: "surround", value: "surround" },
                    { name: "mcompand", value: "mcompand" },
                    { name: "phaser", value: "phaser" },
                    { name: "tremolo", value: "tremolo" },
                    { name: "earwax", value: "earwax" },  
                ]
            }],
        },
        {
            name: "options",
            description: "Other options.",
            type: "SUB_COMMAND",
            options: [{
                name: "option", description: "Pick an option.", type: "STRING", required: true,
                choices: [
                    { name: "queue", value: "queue" },
                    { name: "stop", value: "stop" },
                    { name: "repeat", value: "repeat" },
                    { name: "volume", value: "volume" },
                    { name: "pause", value: "pause" },
                    { name: "shuffle", value: "shuffle" },
                    { name: "resume", value: "resume" },
                    { name: "seek", value: "seek" },
                    { name: "lyrics", value: "lyrics" },
                    { name: "nowplaying", value: "nowplaying" },
                    { name: "autoplay", value: "autoplay" },
                ]
            }],
        },
    ],
    async execute(client, interaction, color) {

        // Set arguments

    }
}