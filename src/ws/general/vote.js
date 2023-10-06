const Vote = require('@schemas/Vote');
const axios = require('axios');
const { Embed } = require('@constants/embed');

//* Handle the vote of a user. Send a message and update DB.
module.exports = {
  code: 'vote',
  async execute(client, data) {
    //* Get the votes channel and send the Vote message.		
    const guild = client.guilds.cache.get('1007810461347086357');
    if (!guild) return;
    const ch = guild.channels.cache.get('1024600377628299266');
    if (!ch) return;

    const votes = await axios.get('https://top.gg/api/bots/995243562134409296/votes', {
      headers: {
        Authorization: process.env.TOPGG_API_KEY,
      },
    }).catch(() => {});
    let voteCount = -1;
    if (votes) voteCount = votes.data.monthlyPoints;

    ch.send({
      content: `<@${data.body.user}>`,
      embeds: [
        new Embed('#416683')
          .setTitle('User Voted!')
          .setDescription(
            `<@${data.body.user}> has voted for QuaBot, you are the **${voteCount}th** vote! Thank you for your support, you have received a 1.5x level XP multiplier. You can vote again in 12 hours! [Vote here.](https://top.gg/bot/995243562134409296/vote)`,
          ),
      ],
    });

    //* Try to send a DM to the user.
    const user = client.users.cache.get(data.body.user);
    if (!user) return;

    await user
      .send({
        embeds: [
          new Embed('#416683').setDescription(
            `Hey ${user}! Thank you so much for voting for QuaBot. It really means a lot to us. As a reward, we have given you a 1.5x level XP multiplier for 12 hours! We hope you enjoy your time with QuaBot! You are our **${voteCount}th** vote this month!`,
          ),
        ],
      })
      .catch(() => {});

    //* Update the DB.
    const config = await Vote.findOne({ userId: data.body.user }, (err, c) => {
      if (err) console.log(err);
      if (!c)
        new Vote({
          userId: data.body.user,
          lastVote: `${new Date().getTime()}`,
        }).save();
    })
      .clone()
      .catch(() => {});

    if (!config) return;
    config.lastVote = `${new Date().getTime()}`;
  },
};
