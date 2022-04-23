const { fun, info, moderation, management, misc, support, music, economy } = require('../../embeds/help');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isSelectMenu()) {
            if (interaction.values[0] === "fun_commands") interaction.reply({ ephemeral: true, embeds: [fun]}).catch(err => console.log(err));
            if (interaction.values[0] === "info_commands") interaction.reply({ ephemeral: true, embeds: [info]}).catch(err => console.log(err));                                                                                                                                                                                                                                                                                                                                                                    
            if (interaction.values[0] === "music_commands") interaction.reply({ ephemeral: true, embeds: [music]}).catch(err => console.log(err));                                                                                                                                                                                                                                                                                                                                                                    
            if (interaction.values[0] === "moderation_commands") interaction.reply({ ephemeral: true, embeds: [moderation]}).catch(err => console.log(err));
            if (interaction.values[0] === "management_commands") interaction.reply({ ephemeral: true, embeds: [management]}).catch(err => console.log(err));;
            if (interaction.values[0] === "misc_commands") interaction.reply({ ephemeral: true, embeds: [misc]}).catch(err => console.log(err));
            if (interaction.values[0] === "support_commands") interaction.reply({ ephemeral: true, embeds: [support]}).catch(err => console.log(err));    
            if (interaction.values[0] === "economy_commands") interaction.reply({ ephemeral: true, embeds: [economy]}).catch(err => console.log(err));        
        }
    }
}