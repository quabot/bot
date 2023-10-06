const consola = require('consola');

//* Handle info events from the backend.
module.exports = {
  code: 'info',
  async execute(client, data) {
    console.log('');
    consola.info('Websocket: ' + data.message);
  },
};
