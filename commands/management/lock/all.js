const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "all",
    command: "lock",
    async execute(client, interaction, color) {

        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : "No reason given.";
        const duration = interaction.options.getString("duration")
        const public = interaction.options.getBoolean("announce") ? interaction.options.getBoolean("announce") : true;

        let channels = await interaction.guild.channels.fetch();

        const Role = require('../../../structures/schemas/RolesSchema');
        const RoleDatabase = await Role.findOne({
            guildId: interaction.guild.id,
        }, (err, role) => {
            if (err) console.log(err);
            if (!role) {
                const newRole = new Role({
                    guildId: interaction.guild.id,
                    reactionRoles: [],
                    memberRole: "none",
                    welcomeRole: "none",
                });
                newRole.save();
            }
        }).clone().catch((err => { }));

        if (!RoleDatabase) return;

        const permsRole = interaction.guild.roles.cache.get(`${RoleDatabase.memberRole}`) ? RoleDatabase.memberRole : interaction.guild.id;

        if (!ms(duration)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Please give a valid duration.`)
            ], ephemeral: true
        }).catch((err => { }));

        let channelArray = [];

        channels.forEach(channel => {
            if (!channel) return;
            if (channel.type !== "GUILD_TEXT") return;

            if (channel.permissionsFor(permsRole).has("SEND_MESSAGES")) {
                console.log(`${permsRole} does have send messages - ${channel.name}`);
                channel.permissionOverwrites.edit(permsRole, { SEND_MESSAGES: false }).catch((err => { }));

                channelArray.push(channel.id);
                if (public) {
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`**Channel Locked**\n${reason}`)
                        ]
                    }).catch(( err => { } ));
                }

                setTimeout(() => {
                    channel.permissionOverwrites.edit(permsRole, { SEND_MESSAGES: true }).catch((err => { }));

                    if (public) {
                        channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`**Channel Unlocked**`)
                            ]
                        }).catch((err => console.log(err)));
                    }

                }, ms(duration));
            }
        });

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`**Locked all channels**\nAll channels where <@&${permsRole}> could talk.\n**Channels:** ${channelArray.map(i => `<#${i}>`)}`)
            ], ephemeral: true
        }).catch((err => { }));
    }
}