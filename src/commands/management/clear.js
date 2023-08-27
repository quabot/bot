const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const { Embed } = require("@constants/embed");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear an amount of messages in a channel.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to clear.")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction, color) {
    //* Defer the reply to give the user an instant response.
    //* Ephemeral to make it private.
    await interaction.deferReply({ ephemeral: true });

    //* Get the amount of messages to delete and set it if it is invalid.
    let amount = interaction.options.get("amount").value;
    if (!amount)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "Please enter a valid amount of messages to delete.",
          ),
        ],
      });

    if (amount < 0) amount = 0;
    if (amount > 100) amount = 100;

    //* Delete the messages, give an error if failed.
    await interaction.channel.bulkDelete(amount, true).catch(async (e) => {
      if (e.code === 50013) {
        return await interaction.editReply({
          embeds: [
            new Embed(color)
              .setDescription(
                "I need some more permissions to execute that command. I need the `MANAGE MESSAGES` or `ADMINISTRATOR` permissions for that.",
              )
              .setColor(color),
          ],
        });
      }
    });

    //* Confirm that it worked to the user.
    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Deleted ${amount} messages.`)],
    });
  },
};
