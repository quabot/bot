const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType, Collection } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

const houses = new Collection();
houses.set('HypeSquadOnlineHouse1', '<:QBravery:1011633937296138341> Bravery');
houses.set('HypeSquadOnlineHouse2', '<:QBrilliance:1011633938441195572> Brilliance');
houses.set('HypeSquadOnlineHouse3', '<:QBalance:1011633936088182834> Balance');

module.exports = {
    parent: 'info',
    name: 'user',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const member = (interaction.options.getMember('user') ?? interaction.member);
        const { user } = member;
        console.log(member.presence?.status)

        const badges = [];
        user.flags?.toArray().forEach(flag => {
            badges.push(houses.get(flag) ?? '');
        });
        
        await interaction.editReply({
            embeds: [
                new Embed(color).setTitle('User Info').setThumbnail(user.displayAvatarURL()).setDescription(`
                    **• User**: ${user}
                    **• Displayname**: ${user.globalName ?? 'None'}
                    **• Username**: @${user.username}
                    **• ID**: ${user.id}
                    **• Roles**: ${member.roles.cache
                        .map((r) => r)
                        .join(' ')
                        .replace('@everyone', ' ') ?? 'None'
                    }
                    **• Joined Server**: <t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:R>
                    **• Joined Discord**: <t:${Math.floor(user.createdTimestamp / 1000)}:R>
                    **• House**: ${badges.join(' ')} ${badges.length === 0 ? 'None' : ''}
                    **• Status**: ${member.presence?.status ?? 'Unknown'}
                `),
            ],
        });
    },
};
