const { MessageEmbed, MessageAttachment } = require("discord.js");

const moment = require("moment");
const ms = require("ms");

module.exports = {
    name: "serverinfo",
    description: "Get some information about the server you're in.",
    async execute(client, interaction, color) {

        const embed = new MessageEmbed()
            .setTitle(`Serverinfo`)
            .setColor(color)
            .setThumbnail(interaction.guild.iconURL({ dynamic: false, size: 1024 }))
            .addFields(
                {
                    name: "**General:**",
                    value:
                        `
                         **• Name**: ${interaction.guild.name}
                         **• ID**: ${interaction.guild.id}
                         **• Created**: <t:${Math.floor(parseInt(interaction.guild.createdTimestamp / 1000))}:R>
                         **• Owner**: <@${interaction.guild.ownerId}>
                         **• Description**: ${interaction.guild.description || "None"}
                         `,
                    inline: true,

                }, {
                name: "**Members**",
                value:
                    `
                         **• Total Members**: ${interaction.guild.members.cache.size}
                         **• Humans**: ${interaction.guild.members.cache.filter((m) => !m.user.bot).size}
                         **• Bots**: ${interaction.guild.members.cache.filter((m) => m.user.bot).size}
                         `,
                inline: false,

            }
            )
            .setTimestamp();

            console.log(interaction.guild.channels.cache.forEach(element => {
                console.log(element.type)
            }))

        if (interaction.guild.features.includes("COMMUNITY")) {
            embed.addFields(
                {
                    name: "**Channels:**",
                    value:
                        `
                                 **• Total**: ${interaction.guild.channels.cache.size}
                                 **• Text**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                                 **• Categories**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                                 **• Voice**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                                 **• News**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_NEWS").size}
                                 **• Stages**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE").size}
                                 **• Threads**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_PUBLIC_THREAD").size + interaction.guild.channels.cache.filter((c) => c.type === "GUILD_PRIVATE_THREAD").size}
                                 `,
                    inline: false,
                }
            );
        } else {
            embed.addFields(
                {
                    name: "**Channels:**",
                    value:
                        `
                                 **• Total**: ${interaction.guild.channels.cache.size}
                                 **• Text**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                                 **• Categories**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                                 **• Voice**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                                 **• Threads**: ${interaction.guild.channels.cache.filter((c) => c.type === "GUILD_PUBLIC_THREAD").size + interaction.guild.channels.cache.filter((c) => c.type === "GUILD_PRIVATE_THREAD").size}
                                 `,
                    inline: false,
                }
            );
        }

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        }).catch((err => { }));

    }
}