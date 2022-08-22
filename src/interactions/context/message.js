const { ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");

module.exports = {
    name: "msg",
    type: ApplicationCommandType.Message,
    /**
     * @param {ContextMenuCommandInteraction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const user = interaction.options.getMember('user') ? interaction.options.getMember('user') : interaction.member;
        const userObject = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        async function getHexColor(user) {
            if (user.displayHexColor !== '#000000') {
                return user.displayHexColor;
            } else return color;
        };

        let badges = [];
        houses.forEach((e) => {
            if (userObject.flags.toArray().includes(e.name)) badges.push(e.emoji);
        });

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(await getHexColor(user))
                    .setThumbnail(`${user.user.displayAvatarURL({ dynamic: true, size: 1024, })}`)
                    .setTitle("User Info")
                    .addFields({
                        name: `**General:**`,
                        value: `
                        **• Name**: ${user.user}
                        **• ID**: ${user.user.id}
                        **• Roles**: ${user.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}
                        **• Joined Server**: <t:${parseInt(user.joinedTimestamp / 1000)}:R>
                        **• Joined Discord**: <t:${parseInt(user.user.createdTimestamp / 1000)}:R>
                        **• House**: ${badges.join(" ")}
                    `,
                        inline: false,
                    })
            ]
        }).catch((e => { }));

    }
}