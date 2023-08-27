const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  Collection,
} = require("discord.js");
const { Embed } = require("@constants/embed");

const houses = new Collection();
houses.set("HypeSquadOnlineHouse1", "<:QBravery:1011633937296138341> Bravery");
houses.set(
  "HypeSquadOnlineHouse2",
  "<:QBrilliance:1011633938441195572> Brilliance",
);
houses.set("HypeSquadOnlineHouse3", "<:QBalance:1011633936088182834> Balance");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Userinfo")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  /**
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    const member = interaction.targetMember;
    const user = interaction.targetUser;

    const badges = [];
    user.flags?.toArray().forEach((flag) => {
      badges.push(houses.get(flag) ?? "");
    });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle("User Info")
          .setThumbnail(user.displayAvatarURL()).setDescription(`
                    **• User**: ${user}
                    **• Displayname**: ${user.globalName ?? "Unknown"}
                    **• Username**: @${user.username}
                    **• ID**: ${user.id}
                    **• Roles**: ${
                      member.roles.cache
                        .map((r) => r)
                        .join(" ")
                        .replace("@everyone", " ") ?? "None"
                    }
                    **• Joined Server**: <t:${Math.floor(
                      (member.joinedTimestamp ?? 0) / 1000,
                    )}:R>
                    **• Joined Discord**: <t:${Math.floor(
                      user.createdTimestamp / 1000,
                    )}:R>
                    **• House**: ${badges.join(" ")}
                `),
      ],
    });
  },
};
