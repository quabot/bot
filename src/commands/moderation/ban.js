const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getModerationConfig } = require("@configs/moderationConfig");
const { getUser } = require("@configs/user");
const { Embed } = require("@constants/embed");
const Punishment = require("@schemas/Punishment");
const { randomUUID } = require("crypto");
const { CustomEmbed } = require("@constants/customEmbed");
const ms = require("ms");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you wish to ban.")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("delete_messages")
        .setDescription("How many of their recent messages to delete.")
        .setRequired(true)
        .addChoices(
          { name: "Don't delete any", value: 0 },
          { name: "Previous hour", value: 3600 },
          { name: "Previous 6 hours", value: 21600 },
          { name: "Previous 12 hours", value: 43200 },
          { name: "Previous 24 hours", value: 86400 },
          { name: "Previous 3 days", value: 259200 },
          { name: "Previous 7 days", value: 604800 },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning the user.")
        .setRequired(false),
    )
    .addBooleanOption((option) =>
      option
        .setName("private")
        .setDescription("Should the message be visible to you only?")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction, color) {
    //* Determine if the command should be ephemeral or not.
    const private = interaction.options.getBoolean("private") ?? false;

    //* Defer the reply to give the user an instant response.
    await interaction.deferReply({ ephemeral: private });

    //* Get the moderation config and return if it doesn't exist.
    const config = await getModerationConfig(client, interaction.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up moderation for first-time use! Please run the command again.",
          ),
        ],
      });

    //* Get the user-defined variables and return errors if they're invalid
    const reason = `${
      interaction.options.getString("reason") ?? "No reason specified."
    }`.slice(0, 800);
    const member = interaction.options.getMember("user");
    const seconds = interaction.options.getInteger("delete_messages");
    if (!member || !reason || seconds === undefined)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "Please fill out all the required fields.",
          ),
        ],
      });
    await getUser(interaction.guildId, member.id);

    //* Prevent non-allowed bans.
    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription("You cannot ban yourself.")],
      });

    if (
      member.roles.highest.rawPosition >
      interaction.member.roles.highest.rawPosition
    )
      return interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "You cannot ban a user with roles higher than your own.",
          ),
        ],
      });

    //* Get the user's database and add them if they don't exist.
    const userDatabase = await getUser(interaction.guildId, member.id);
    if (!userDatabase)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "The user has been added to our database. Please run the command again.",
          ),
        ],
      });

    //* Try to ban the user and return if it fails.
    let ban = true;
    await member
      .ban({ reason, deleteMessageSeconds: seconds })
      .catch(async (e) => {
        ban = false;

        await interaction.editReply({
          embeds: [new Embed(color).setDescription("Failed to ban the user.")],
        });
      });

    if (!ban) return;

    //* Update the databases
    userDatabase.bans += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId: member.id,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: "ban",
      id,
      reason,
      duration: "none",
      active: false,
    });
    await NewPunishment.save();

    //* Edit the reply to confirm the ban.
    interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle("User Banned")
          .setDescription(
            `**User:** ${member} (@${member.user.username})\n**Reason:** ${reason}`,
          )
          .addFields(
            {
              name: "Joined Server",
              value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "Account Created",
              value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    //* Send the ban message to the user.
    const sentFrom = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sentFrom")
        .setLabel("Sent from server: " + interaction.guild?.name ?? "Unknown")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.banDM) {
      const parseString = (text) =>
        text
          .replaceAll("{reason}", reason)
          .replaceAll("{user}", `${member}`)
          .replaceAll("{moderator}", interaction.user)
          .replaceAll("{staff}", interaction.user)
          .replaceAll("{server}", interaction.guild?.name ?? "")
          .replaceAll("{color}", color)
          .replaceAll("{id}", `${id}`)
          .replaceAll(
            "{joined}",
            `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
          )
          .replaceAll(
            "{created}",
            `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
          )
          .replaceAll("{icon}", interaction.guild?.iconURL() ?? "");

      await member
        .send({
          embeds: [new CustomEmbed(config.banDMMessage, parseString)],
          content: parseString(config.banDMMessage.content),
          components: [sentFrom],
        })
        .catch(() => {});
    }

    //* Send the log message.
    if (config.channel) {
      const channel = interaction.guild.channels.cache.get(config.channelId);
      if (!channel) return;

      await channel.send({
        embeds: [
          new Embed(color).setTitle("Member Banned").addFields(
            {
              name: "User",
              value: `${member} (@${member.user.username})`,
              inline: true,
            },
            { name: "Banned By", value: `${interaction.user}`, inline: true },
            {
              name: "Banned In",
              value: `${interaction.channel}`,
              inline: true,
            },
            {
              name: "User Total Bans",
              value: `${userDatabase.bans}`,
              inline: true,
            },
            {
              name: "Joined Server",
              value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "Account Created",
              value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            { name: "Reason", value: `${reason}`, inline: false },
          ),
        ],
      });
    }
  },
};
