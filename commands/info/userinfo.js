const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "userinfo",
    description: "Info about a user.",
    options: [
        {
            name: "user",
            description: "User to get the info of",
            type: "USER",
        }
    ],
    async execute(client, interaction, color) {

        try {

            let user = interaction.options.getUser('user');
            if (!user) user = interaction.user;
            let member = interaction.options.getMember("user");
            if (!member) member = interaction.member;

            var roles = `<@&${member._roles.map(role => role.toString()).join('>, <@&')}>`;

            const embed = new MessageEmbed()
                .addField('User <:MembersIcon:959741227689988196>', `${user}`, true)
                .addField('Discriminator <:ChannelIcon:959741807380557845>', `\`#${user.discriminator}\``, true)
                .addField('ID <:IdIcon:960591936840957962>', `\`${user.id}\``, true)
                .addField('Joined server on', `<t:${member.joinedTimestamp}:R>`, true)
                .addField('Joined Discord on', `<t:${user.createdAt}:R>`, true)
                .setFooter(`${user.username}#${user.discriminator}`, user.avatarURL({ dynamic: true }))
                .setTimestamp()
                .setThumbnail(user.avatarURL({ dynamic: true }))
                .setColor(color);

            if (member.premiumSinceTimestamp) embed.addField("Booster Since <:BoostIcon:959748299911479306>", `\`${moment(member.premiumSinceTimestamp).format('MMM DD YYYY')}\``, true);
            if (member.nickname) embed.addField("Nickname", `\`${member.nickname}\``, true);
            if (user.bot) embed.addField('Bot', `\`${user.bot}\``, true);
            if (roles.length < 1024) {
                if (member._roles.length !== 0) embed.addField("Roles <:RolesIcon:959764812068450318>", `<@&${member._roles.map(role => role.toString()).join('>, <@&')}>`, true);
            }

            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}