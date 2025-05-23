import { Embed } from '@constants/embed';
import { getPost, getImage } from 'random-reddit';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'reddit',
  name: 'subreddit',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const subreddit = interaction.options.getString('subreddit', true);
    const imageonly = interaction.options.getBoolean('imageonly' ?? false);

    if (!imageonly) {
      //? Has to be => {}, otherwise it'd return a value and would post not be 'null' (not 100% sure tho)
      const post = await getPost(subreddit).catch(async () => {
        await interaction.editReply({
          embeds: [
            new Embed(color).setDescription("Couldn't find that subreddit. This could be due to reddit reatelimits."),
          ],
        });
      });
      if (!post) return;

      await interaction.editReply({
        embeds: [
          new Embed(color)
            .setTitle(`${post.title}`.slice(0, 256))
            .setURL(`https://reddit.com${post.permalink}`)
            .setDescription(
              post.is_gallery
                ? `This post is a gallery, check all the images here: ${post.url}`.slice(0, 1024)
                : post.selftext
                ? `${post.selftext}`.slice(0, 1024)
                : null,
            )
            .setImage(post.post_hint === 'image' ? `${post.url}` : null)
            .setFooter({
              text: `Posted by u/${post.author_fullname} in r/${post.subreddit}`,
            }),
        ],
      });
    } else {
      const post = await getImage(subreddit).catch(async () => {
        return await interaction.editReply({
          embeds: [
            new Embed(color).setDescription("Couldn't find that subreddit. This could be due to reddit reatelimits."),
          ],
        });
      });
      if (!post) return;

      await interaction.editReply({
        embeds: [new Embed(color).setImage(`${post}`).setFooter({ text: `Posted in r/${subreddit}` })],
      });
    }
  },
};
