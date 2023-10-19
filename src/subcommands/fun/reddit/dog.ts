import { Embed } from '@constants/embed';
import { getPost } from 'random-reddit';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'reddit',
  name: 'dog',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    await getPost('dogpictures')
      .then(async d => {
        await interaction.editReply({
          embeds: [
            new Embed(color)
              .setTitle(`${d.title}`)
              .setURL(`${d.url}`)
              .setDescription(d.is_gallery ? `This post is a gallery, check all the images here: ${d.url}` : null)
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
            new Embed(color).setTitle('Reddit Ratelimit').setDescription('Reddit is ratelimiting us, try again later.'),
          ],
        });
      });
  },
};
