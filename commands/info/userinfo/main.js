const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");

const houses = [
    { name: "HypeSquadOnlineHouse1", emoji: "<:HouseBraveryMember:994985087856820345>" },
    { name: "HypeSquadOnlineHouse2", emoji: "<:HouseBrillianceMember:994985091883348048>" },
    { name: "HypeSquadOnlineHouse3", emoji: "<:HouseBalanceMember:994985089949777920>" },
];

module.exports = {
    name: "userinfo",
    description: "Get information about a user.",
    options: [
        {
            name: "user",
            description: "The user to get info about.",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async execute(client, interaction, color) {

        const user = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member;
        const userObject = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        async function getHexColor(user) {

            if (user.displayHexColor !== '#000000') {
                return user.displayHexColor;
            } else {
                return color;
            }

        };

        let badges = [];
        houses.forEach((e) => {
            if (userObject.flags.toArray().includes(e.name)) badges.push(e.emoji);
        });

        const embed = new EmbedBuilder()
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
            **• House**: ${badges.join(" ")}
            `,
                inline: false,
            });

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        }).catch((err => { }));

    }
}