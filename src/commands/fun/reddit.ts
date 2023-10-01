import { SlashCommandBuilder } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
export default {
  data: new SlashCommandBuilder()
    .setName('reddit')
    .setDescription('Get images from a subreddit.')
    .addSubcommand(subcommand => subcommand.setName('cat').setDescription('Get an image of a cute cat.'))
    .addSubcommand(subcommand => subcommand.setName('dog').setDescription('Get an image of a dog.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('subreddit')
        .setDescription('Get an image/post from any subreddit.')
        .addStringOption(option =>
          option.setName('subreddit').setDescription('The subreddit to get an image from.').setRequired(true),
        )
        .addBooleanOption(option =>
          option
            .setName('imageonly')
            .setDescription('Whether to give only an image or normal posts.')
            .setRequired(false),
        ),
    )
    .addSubcommand(subcommand => subcommand.setName('meme').setDescription('Get a meme.'))
    .setDMPermission(false),

  async execute() {
    //* This command is just a placeholder for the subcommands.
  },
};
