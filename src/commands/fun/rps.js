const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Colors,
  Client,
  CommandInteraction,
} = require("discord.js");
const { Embed } = require("@constants/embed");
const { getUserGame } = require("@configs/userGame");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play rock, paper, scissors.")
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction, color) {
    //* Get the user's game data to pre-load it.
    await getUserGame(interaction.user.id);

    //* Give the user the options to choose from and create a collector for the message.
    const msg = await interaction.reply({
      embeds: [new Embed(color).setDescription("Rock, paper or scissors?")],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Rock")
            .setEmoji("🪨")
            .setCustomId("rock"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Paper")
            .setEmoji("📄")
            .setCustomId("paper"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Scissors")
            .setEmoji("✂️")
            .setCustomId("scissors"),
        ),
      ],
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      time: 60000,
    });

    const userDB = await getUserGame(interaction.user.id);

    //* Stop listening when a button is clicked.
    collector.on("collect", async (i) => {
      collector.stop();

      //* Update the tries
      userDB.rpsTries += 1;

      //* Pick an option as bot and check the user's choice.
      const options = ["rock", "paper", "scissors"];
      const myChoice = options[Math.floor(Math.random() * options.length)];
      const userChoice = i.customId;

      //* Define the list of options and what happens.
      const choices = {
        rock: { weakTo: "paper", strongTo: "scissors" },
        paper: { weakTo: "scissors", strongTo: "rock" },
        scissors: { weakTo: "rock", strongTo: "paper" },
      };

      //* Handle the different options, give the user a response and update the database accordingly.
      if (choices[myChoice].strongTo === userChoice) {
        await i.update({
          embeds: [
            new Embed(Colors.Red)
              .setDescription(
                `I picked **${myChoice}** and you picked **${userChoice}**, so i won and you lost!`,
              )
              .addFields(
                {
                  name: "Your Score",
                  value: `${userDB.rpsPoints - 1}`,
                  inline: true,
                },
                { name: "Entered By", value: `${i.user}`, inline: true },
              ),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Play Again")
                .setCustomId("rps-replay"),
            ),
          ],
        });

        userDB.rpsPoints -= 1;
        await userDB.save();
      } else if (choices[myChoice].weakTo === userChoice) {
        await i.update({
          embeds: [
            new Embed(Colors.Green)
              .setDescription(
                `I picked **${myChoice}** and you picked **${userChoice}**, so you won!`,
              )
              .addFields(
                {
                  name: "Your Score",
                  value: `${userDB.rpsPoints + 1}`,
                  inline: true,
                },
                { name: "Entered By", value: `${i.user}`, inline: true },
              ),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Play Again")
                .setCustomId("rps-replay"),
            ),
          ],
        });

        userDB.rpsPoints += 1;
        await userDB.save();
      } else {
        await i.update({
          embeds: [
            new Embed(Colors.Orange)
              .setDescription(
                `I picked **${myChoice}** and you picked **${userChoice}**, so it's a tie!`,
              )
              .addFields(
                {
                  name: "Your Score",
                  value: `${userDB.rpsPoints}`,
                  inline: true,
                },
                { name: "Entered By", value: `${i.user}`, inline: true },
              ),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Play Again")
                .setCustomId("rps-replay"),
            ),
          ],
        });

        await userDB.save();
      }
    });

    //* When the collector ends, give the user the option to play again.
    collector.on("end", async () => {
      await interaction.editReply({
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("Play Again")
              .setCustomId("rps-replay"),
          ),
        ],
      });
    });
  },
};
