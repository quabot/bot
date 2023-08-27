const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
} = require("discord.js");
const { Embed } = require("@constants/embed");
const { getPost } = require("random-reddit");

module.exports = {
  parent: "reddit",
  name: "meme",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    await getPost("meme")
      .then(async (d) => {
        await interaction.editReply({
          embeds: [
            new Embed(color)
              .setTitle(`${d.title}`)
              .setURL(`${d.url}`)
              .setDescription(
                d.is_gallery
                  ? `This post is a gallery, check all the images here: ${d.url}`
                  : null,
              )
              .setImage(`${d.url}`)
              .setFooter({
                text: `Posted by u/${d.author_fullname} in r/${d.subreddit}`,
              }),
          ],
        });
      })
      .catch(async () => {
        return await interaction.editReply({
          embeds: [
            new Embed(color)
              .setTitle("Reddit Ratelimit")
              .setDescription("Reddit is ratelimiting us, try again later."),
          ],
        });
      });
  },
};
