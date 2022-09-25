const { EmbedBuilder, ButtonStyle, ButtonBuilder, Colors, ActionRowBuilder } = require("discord.js");
const axios = require('axios');
const { titleCase } = require('../../../structures/functions/strings');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "view",
    command: "queue-times",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {


        const park = interaction.options.getString("park") ? titleCase(await interaction.options.getString("park") ? interaction.options.getString("park") : "") : null;
        const attraction = interaction.options.getString("attraction") ? titleCase(await interaction.options.getString("attraction") ? interaction.options.getString("attraction") : "") : null;
        const { data: parks } = await axios.get("https://queue-times.com/parks.json");

        if (attraction) {
            const newParks = [];
            parks.forEach(p => p.parks.forEach(fp => newParks.push(fp)));
    
            const foundPark = newParks.find(i => i.name === park);
            if (!foundPark) return interaction.reply({ embeds: [await generateEmbed(color, "Couldn't find that park!\n[Powered by Queue-Times.com](https://queue-times.com)")] });
            const id = foundPark.id;
    
            const { data: rawRides } = await axios.get(`https://queue-times.com/parks/${id}/queue_times.json`).catch(() => { });
            const rides = [];
            rawRides.lands.forEach(i => i.rides.forEach(i => rides.push(i)));
            if (rides.length === 0) return interaction.reply({ embeds: [await generateEmbed(color, "No rides found for that park.\n[Powered by Queue-Times.com](https://queue-times.com)")] });

            const foundAttraction = rides.find(i => i.name === attraction);
            if (!foundAttraction) return interaction.reply({ embeds: [await generateEmbed(color, "Couldn't find that ride! Get a list of rides for that park with `/queue-times list`.\n[Powered by Queue-Times.com](https://queue-times.com)")] });

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTimestamp(new Date(foundAttraction.last_updated))
                        .setTitle(foundAttraction.name)
                        .setDescription(`${foundAttraction.is_open ? `The queue is currently ${foundAttraction.wait_time} minutes.` : "This ride is currently closed."}`)
                ]
            })
        }
    }
}