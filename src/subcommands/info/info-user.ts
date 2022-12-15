import { Collection, type GuildMember } from 'discord.js';
import { Subcommand, Embed, type CommandArgs } from '../../structures';

const houses = new Collection<string, string>();
houses.set('HypeSquadOnlineHouse1', '<:QBravery:1011633937296138341> Bravery');
houses.set('HypeSquadOnlineHouse2', '<:QBrilliance:1011633938441195572> Brilliance');
houses.set('HypeSquadOnlineHouse3', '<:QBalance:1011633936088182834> Balance');

export default new Subcommand()
    .setParent('info')
    .setName('user')
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        const member: GuildMember = (interaction.options.getMember('user') ?? interaction.member) as GuildMember;
        const { user } = member;

        const badges: string[] = [];
        user.flags?.toArray().forEach(flag => {
            badges.push(houses.get(flag) ?? '');
        });

        await interaction.editReply({
            embeds: [
                new Embed(color).setTitle('User Info').setThumbnail(user.displayAvatarURL()).setDescription(`
                **• Name**: ${user}
                **• ID**: ${user.id}
                **• Roles**: ${
                    member.roles.cache
                        .map((r: any) => r)
                        .join(' ')
                        .replace('@everyone', ' ') ?? 'None'
                }
                **• Joined Server**: <t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:R>
                **• Joined Discord**: <t:${Math.floor(user.createdTimestamp / 1000)}:R>
                **• House**: ${badges.join(' ')}
            `),
            ],
        });
    });
