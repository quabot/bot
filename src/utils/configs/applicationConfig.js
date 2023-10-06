/* eslint-disable no-mixed-spaces-and-tabs */
const ApplicationConfig = require('@schemas/AfkConfig');

const getApplicationConfig = async (guildId, client) => {
  const applicationConfig =
    client.cache.get(`${guildId}-application-config`) ??
    (await ApplicationConfig.findOne({ guildId }, (err, config) => {
      if (err) console.log(err);
      if (!config)
        new ApplicationConfig({
          guildId,
          enabled: true,
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-application-config`, applicationConfig);
  return applicationConfig;
};

module.exports = { getApplicationConfig };
