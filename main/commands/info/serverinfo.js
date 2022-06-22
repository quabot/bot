const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "serverinfo",
    description: "Server\'s info.",
    async execute(client, interaction, color) {

        try {

            // get the boosts, roles and send the embed
            let boostTier = interaction.guild.premiumTier;
            if (boostTier === "NONE") boostTier = "None";
            if (boostTier === "TIER_1") boostTier = "Tier 1";
            if (boostTier === "TIER_2") boostTier = "Tier 2";
            if (boostTier === "TIER_3") boostTier = "Tier 3";
            
            let description = interaction.guild.description;
            if (description === null) description = "None";

            let roles = `${interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).join(', ')}`;

            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(`${interaction.guild.name}`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .addField("Members <:MembersIcon:959741227689988196>", `${interaction.guild.memberCount}`, true)
                .addField("Text Channels <:ChannelIcon:959741807380557845>", `${interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT").size}`, true)
                .addField("Voice Channels <:VoiceIcon:959742741217148938>", `${interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size}`, true)
                .addField("Categories <:CategoryIcon:959745537232474123>", `${interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY").size}`, true)
                .addField("Boost Tier <:BoostIcon:959748299911479306>", `${boostTier}`, true)
                .addField("Owner <:OwnerIcon:959757089025163295>", `<@${interaction.guild.ownerId}>`, true)
                .addField("Emojis <:EmojiIcon:959757571927998544>", `${interaction.guild.emojis.cache.size}`, true)
                .addField("Stickers <:StickerIcon:959758865652662314>", `${interaction.guild.stickers.cache.size}`, true)
                .addField("Created <:CreatedIcon:959759880418369596>", `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}:R>`, true)
                .addField("Description <:DescriptionIcon:959760258337738832>", `${interaction.guild.description ? interaction.guild.description : "None" }`, false)

            if (roles.length < 1023) embed.addField("Roles <:RolesIcon:959764812068450318>", `${roles}`, false)
            interaction.reply({ embeds: [embed] }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}