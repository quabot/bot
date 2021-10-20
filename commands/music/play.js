const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const User = require('../../models/guild');
const { } = require('../../files/embeds');


module.exports = {
    name: "play",
    description: "This command allows you to play music.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "song",
            description: "Enter the song you wish to play or add to the queue here.",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {

        const song = interaction.options.getString('song');
        client.player.play(song);
        interaction.reply("Now playing: **" + song + "**!");
    }
}