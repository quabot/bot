const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const consola = require("consola");

let loaded = 0;
let total = 0;

module.exports = async (client) => {
  (await PG(`${process.cwd().replace(/\\/g, "/")}/src/ws/*/*.js`)).map(
    async (wsFile) => {
      total += 1;

      const ws = require(wsFile);
      if (!ws.code) return;

      client.ws_events.set(ws.code, ws);

      loaded += 1;
    },
  );

  consola.success(`Loaded ${loaded}/${total} WebSocket events.`);
};
