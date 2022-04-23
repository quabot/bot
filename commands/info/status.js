const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "status",
    description: 'Bot status.',
    async execute(client, interaction, color) {
        try {

            require('../../events/client/ready'); // which executes 'mongoose.connect()'

            let embedColor;

            const mongoose = require('mongoose');
            let dbConnection;
            if (mongoose.connection.readyState === 0) { dbConnection = "<:dnd:938818583939649556>\`DISCONNECTED\`";embedColor = "RED"; }
            if (mongoose.connection.readyState === 1) { dbConnection = "<:online:938818583868366858>\`CONNECTED\`";embedColor = "GREEN"; }
            if (mongoose.connection.readyState === 2) { dbConnection = "<:idle:938818583864180796>\`CONNECTING\`";embedColor = "YELLOW"; }
            if (mongoose.connection.readyState === 3) { dbConnection = "<:idle:938818583864180796>\`DISCONNECTING\`";embedColor = "ORANGE"; }


            const embed = new MessageEmbed()
                .setTitle(`${client.user.username} Status`)
                .setDescription(`**Client:** \`✅ ONLINE\` - \`${client.ws.ping}ms\`\n**Uptime:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n\n**Database:** ${dbConnection}`)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}