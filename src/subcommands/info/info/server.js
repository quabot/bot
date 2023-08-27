const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ChannelType,
} = require("discord.js");
const { Embed } = require("@constants/embed");

module.exports = {
  parent: "info",
  name: "server",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    const { guild } = interaction;
    const totalMembersSize = guild.members.cache.size;
    const humanMembersSize = guild.members.cache.filter(
      (m) => !m.user.bot,
    ).size;

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(guild.iconURL())
          .setTitle("Server Info")
          .addFields(
            {
              name: "**General:**",
              value: `
                            - **Name**: ${guild.name}\n- **ID**: ${
                              guild.id
                            }\n- **Created**: <t:${Math.floor(
                              guild.createdTimestamp / 1000,
                            )}:R>\n- **Owner**: <@${
                              guild.ownerId
                            }>\n- **Description**: ${
                              guild.description ?? "Unset"
                            }
                         `,
              inline: false,
            },
            {
              name: "**Members**",
              value: `
                         - **Total Members**: ${totalMembersSize}\n- **Humans**: ${humanMembersSize}\n- **Bots**: ${
                           totalMembersSize - humanMembersSize
                         }
                         `,
              inline: false,
            },
            {
              name: "**Channels:**",
              value: `
                            - **Total**: ${
                              guild.channels.cache.size
                            }\n- **Text**: ${
                              guild.channels.cache.filter(
                                (c) => c.type === ChannelType.GuildText,
                              ).size
                            }\n- **Categories**: ${
                              guild.channels.cache.filter(
                                (c) => c.type === ChannelType.GuildCategory,
                              ).size
                            }\n- **Voice**: ${
                              guild.channels.cache.filter(
                                (c) => c.type === ChannelType.GuildVoice,
                              ).size
                            }
                                ${
                                  guild.features.includes("COMMUNITY")
                                    ? `\n- **News**: ${
                                        guild.channels.cache.filter(
                                          (c) =>
                                            c.type ===
                                            ChannelType.GuildAnnouncement,
                                        ).size
                                      }
                                    \n- **Stages**: ${
                                      guild.channels.cache.filter(
                                        (c) =>
                                          c.type ===
                                          ChannelType.GuildStageVoice,
                                      ).size
                                    }`
                                    : ""
                                }\n- **Threads**: ${
                                  guild.channels.cache.filter(
                                    (c) => c.type === ChannelType.PublicThread,
                                  ).size +
                                  guild.channels.cache.filter(
                                    (c) => c.type === ChannelType.PrivateThread,
                                  ).size
                                }
                    `,
              inline: false,
            },
          ),
      ],
    });
  },
};
