const { MessageEmbed } = require('discord.js');
const typeSentences = require('../../../structures/files/type.json');

module.exports = {
    name: "type",
    description: "Play a typing game",
    async execute(client, interaction, color) {
        
        const sentence = typeSentences[Math.floor(Math.random() * typeSentences.length)];
        const startTime = new Date().getTime();
    }
}