const { SlashCommandBuilder } = require("discord.js");

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get loads of usefull information.")
    .addSubcommand((subcommand) =>
      subcommand.setName("bot").setDescription("Get information about QuaBot."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Get information about a channel in the server.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setRequired(false)
            .setDescription("The channel to get information of."),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Get information about a user (or yourself).")
        .addUserOption((option) =>
          option
            .setName("user")
            .setRequired(false)
            .setDescription("The user to get information of."),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("role")
        .setDescription("Get information about a role.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setRequired(true)
            .setDescription("The role to get information of."),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Get information about the server."),
    )
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute() {
    //* This command is just a placeholder for the subcommands.
  },
};
