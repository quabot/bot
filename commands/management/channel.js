const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
  name: "channel",
  description: "Manage channels",
  permission: "MANAGE_CHANNELS", 
  options: [
    {
      type: 1,
      name: "slowmode",
      description: "Set a slowmode in seconds",
      options: [
        {
          type: 7,
          name: "channel",
          description: "The channel to set",
          required: true
        },
        {
          type: 4,
          name: "amount",
          description: "The length to set in seconds",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "create",
      description: "Create a channel",
      options: [
        {
          type: 3,
          name: "name",
          description: "Name of the channel",
          required: true
        },
        {
          type: 3,
          name: "description",
          description: "Optional channel description"
        },
        {
          type: 4,
          name: "slowmode",
          description: "Optional channel slowmode (in seconds)"
        }
      ]
    },
    {
      type: 1,
      name: "delete",
      description: "Delete a channel",
      options: [
        {
          type: 7,
          name: "channel",
          description: "The target channel",
          required: true
        }
      ]
    },
  ],

  async execute(client, interaction) {
    try {
      const sub = interaction.options.getSubcommand();
      const options = {};
      options.raw = interaction.options._hoistedOptions;
      options.raw.forEach(option => {
        options[option.name] = option.value;
        if (option.channel) options[option.name] = option.channel;
      })
      switch (sub) {
        case "create":
          if (!options.slowmode) options.slowmode = null;
          if (!options.description) options.description = null;
          interaction.guild.channels.create(options.name, {
            topic: options.description,
            rateLimitPerUser: options.slowmode
          }).then(ch => {
            const embed = new MessageEmbed()
              .setTitle("Channel Created!")
              .setDescription(`Created the channel: ${ch}!`)
              .setTimestamp()
              .setColor(COLOR_MAIN);
            if (options.description) embed.addField("Description", `${options.description}`)
            if (options.slowmode) embed.addField("Slowmode (seconds)", `${options.slowmode}`)
            interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
          }).catch(err => console.log("Error!"));
          break;
        case "delete":
          options.channel.delete().catch(err => console.log("Error!"));
          const embed2 = new MessageEmbed()
            .setTitle("Channel Deleted!")
            .setDescription(`Deleted the channel with the name: \`${options.channel.name}\`!`)
            .setTimestamp()
            .setColor(COLOR_MAIN);
          interaction.reply({ embeds: [embed2] }).catch(err => console.log("Error!"));
          break;
        case "slowmode":
          if (options.channel.type !== "GUILD_TEXT") {
            const embed = new MessageEmbed()
              .setTitle("Invalid Channel!")
              .setDescription("You must specify a text channel.")
              .setTimestamp()
              .setColor(COLOR_MAIN)
            interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
          }
          if (options.amount > 21600) options.amount = 21600;
          if (options.amount < 0) options.amount = 0;
          options.channel.setRateLimitPerUser(options.amount).catch(err => console.log("Error!"));
          const embed3 = new MessageEmbed()
            .setTitle("Slowmode set!")
            .setDescription(`Set the channel's slowmode to ${options.amount} seconds!`)
            .setTimestamp()
            .setColor(COLOR_MAIN)
          interaction.reply({ embeds: [embed3] }).catch(err => console.log("Error!"));
          break;
      }
    } catch (e) {
        interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
        client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: channel`)] }).catch(err => console.log("Error!"));
        return;
    }
  }
}