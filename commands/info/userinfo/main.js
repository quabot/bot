const { MessageEmbed, MessageAttachment } = require("discord.js");

const moment = require("moment");
const ms = require("ms");

module.exports = {
    name: "userinfo",
    description: "Get information about a user.",
    options: [
        {
            name: "user",
            description: "The user to get info about.",
            type: "USER",
            required: false
        }
    ],
    async execute(client, interaction, color) {

        const user = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member;

        async function getHexColor(user) {
 
            if (user.displayHexColor !== '#000000') {
                return user.displayHexColor;
            } else {
                return color;
            }

        };

        const embed = new MessageEmbed()
            .setColor(await getHexColor(user))
            .setThumbnail(`${user.user.displayAvatarURL({ dynamic: true, size: 1024, })}`)
            .addFields({
                name: `Info about ${user.user.tag}`,
                value: `
            **• Name**: ${user.user}
            **• ID**: ${user.user.id}
            **• Roles**: ${user.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}
            **• Joined Server**: <t:${parseInt(user.joinedTimestamp / 1000)}:R>
            **• Joined Discord**: <t:${parseInt(user.user.createdTimestamp / 1000)}:R>
            `,
                inline: false,
            });

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        }).catch((err => { }));

    }
}