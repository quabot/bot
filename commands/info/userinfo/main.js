const { MessageEmbed, MessageAttachment } = require("discord.js");

const moment = require("moment");
const ms = require("ms");

const emoji = [
    { name: "DISCORD_EMPLOYEE", emoji: "<:Staff:994985083633160272>" },
    { name: "DISCORD_CERTIFIED_MODERATOR", emoji: "<:CertifiedModerator:994985105724551218>" },
    { name: "PARTNERED_SERVER_OWNER", emoji: "<:ServerPartner:994985085780643850>" },
    { name: "HYPESQUARD_EVENTS", emoji: "<:HypeSquardEvents:994985103824523296>" },
    { name: "HOUSE_BRAVERY", emoji: "<:HouseBraveryMember:994985087856820345>" },
    { name: "HOUSE_BRILLIANCE", emoji: "<:HouseBrillianceMember:994985091883348048>" },
    { name: "HOUSE_BALANCE", emoji: "<:HouseBalanceMember:994985089949777920>" },
    { name: "BUGHUNTER_LEVEL_1", emoji: "<:BugHunterLvL1:994985107939147936>" },
    { name: "BUGHUNTER_LEVEL_2", emoji: "<:BigHunterLvL2:994985101580566588>" },
    { name: "EARLY_VERIFIED_BOT_DEVELOPER", emoji: "<:VerifiedDeveloper:994985099135295529>" },
    { name: "EARLY_SUPPORTER", emoji: "<:EarlyNitroSupporter:994985096706801915>" }
];

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
        const userObject = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        async function getHexColor(user) {

            if (user.displayHexColor !== '#000000') {
                return user.displayHexColor;
            } else {
                return color;
            }

        };

        let badges = [];
          emoji.forEach((e) => {
            if (userObject.flags.toArray().includes(e.name)) badges.push(e.emoji);
          });

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
            **• Badges**: ${badges.join(" ")}
            `,
                inline: false,
            });

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        }).catch((err => { }));

    }
}