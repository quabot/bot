const discord = require('discord.js');
const colors = require('../../files/colors.json');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "channel",
    description: "Manage channels",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     **/
    "options": [
        {
          "type": 1,
          "name": "slowmode",
          "description": "Set a slowmode",
          "options": [
            {
              "type": 7,
              "name": "channel",
              "description": "The channel to set",
              "required": true
            },
            {
              "type": 4,
              "name": "amount",
              "description": "The length to set",
              "required": true
            }
          ]
        },
        {
          "type": 1,
          "name": "create",
          "description": "Create a channel",
          "options": [
            {
              "type": 3,
              "name": "name",
              "description": "Name of the channel",
              "required": true
            },
            {
              "type": 3,
              "name": "description",
              "description": "Optional channel description"
            },
            {
              "type": 4,
              "name": "slowmode",
              "description": "Optional channel slowmode"
            }
          ]
        },
        {
          "type": 1,
          "name": "delete",
          "description": "Delete a channel",
          "options": [
            {
              "type": 7,
              "name": "channel",
              "description": "The target channel",
              "required": true
            }
          ]
        },
        {
          "type": 1,
          "name": "position",
          "description": "Move the channel",
          "options": [
            {
              "type": 7,
              "name": "channel",
              "description": "Channel to move",
              "required": true
            },
            {
              "type": 3,
              "name": "category",
              "description": "Where to move the channel",
              "required": true
            }
          ]
        }
    ],
    
    async execute(client, interaction) {
        try {            
            const sub = interaction.options.getSubcommand()
            const options = {}
            options.raw = interaction.options._hoistedOptions
            options.raw.forEach(option => {
                options[option.name] = option.value
                if (options.channel) options[option.name] = option.channel
            })
            switch (sub) {
                case "create":
                    if (!options.slowmode) options.slowmode = null
                    if (!options.description) options.description = null
                    interaction.guild.channels.create(options.name, {
                        topic: options.description,
                        rateLimitPerUser: options.slowmode
                    })
                    interaction.reply("Created channel " + options.name)
                    break;
                case "delete":
                    options.channel.delete()
                    interaction.reply("Deleted channel " + options.channel.name)
                    break;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}