import { Client, CommandInteraction } from "discord.js";
import { embed } from "../../utils/constants/embeds";
const houses = [
    { name: 'HypeSquadOnlineHouse1', emoji: '<:QBravery:1011633937296138341> Bravery' },
    { name: 'HypeSquadOnlineHouse2', emoji: '<:QBrilliance:1011633938441195572> Brilliance' },
    { name: 'HypeSquadOnlineHouse3', emoji: '<:QBalance:1011633936088182834> Balance' },
];

module.exports = {
    command: 'info',
    subcommand: 'user',
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        await interaction.deferReply();

        const user:any = interaction.options.get('user')?.member ?? interaction.member;

        const badges: string[] = [];
        houses.forEach((e) => {
            if (user.user.flags.toArray().includes(e.name)) badges.push(e.emoji);
        });

        await interaction.editReply({
            embeds: [
                embed(color)
                    .setTitle("User Info")
                    .setThumbnail(user.user.displayAvatarURL())
                    .setDescription(`
                    **• Name**: ${user.user}
                    **• ID**: ${user.user.id}
                    **• Roles**: ${user.roles.cache
                            .map((r: any) => r)
                            .join(' ')
                            .replace('@everyone', ' ') || 'None'
                        }
                    **• Joined Server**: <t:${Math.floor(user.joinedTimestamp / 1000)}:R>
                    **• Joined Discord**: <t:${Math.floor(user.user.createdTimestamp / 1000)}:R>
                    **• House**: ${badges.join(' ')}
                `)
            ]
        });
    }
}