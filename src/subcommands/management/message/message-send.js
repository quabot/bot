const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { channelBlacklist } = require("@constants/discord");
const { Embed } = require("@constants/embed");

module.exports = {
  parent: "message",
  name: "send",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    const channel = interaction.options.getChannel("channel");
    if (channelBlacklist.includes(channel.type))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription("Please enter a valid channel type."),
        ],
      });

    const buttons1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("embed-message")
        .setLabel("Set Message")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-title")
        .setLabel("Set Title")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-url")
        .setLabel("Set Url")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-description")
        .setLabel("Set Description")
        .setStyle(ButtonStyle.Primary),
    );

    const buttons2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("embed-thumbnail")
        .setLabel("Set Thumbnail")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-image")
        .setLabel("Set Image")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-footer")
        .setLabel("Set Footer")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-timestamp")
        .setLabel("Add Timestamp")
        .setStyle(ButtonStyle.Primary),
    );

    const buttons3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("embed-color")
        .setLabel("Set Color")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-author")
        .setLabel("Set Author")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-addfield")
        .setLabel("Add Field")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("embed-removefield")
        .setLabel("Remove Field")
        .setStyle(ButtonStyle.Danger),
    );

    const buttons4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("embed-send")
        .setLabel("Send Message")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("embed-cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Click the buttons below this message to set components of the embed.\nThe message will be sent to ${channel}. If the description is empty the embed will not be sent.`,
        ),
        new EmbedBuilder().setDescription("\u200b").setColor(color),
      ],
      components: [buttons1, buttons2, buttons3, buttons4],
    });
  },
};
