const osUtils = require("os-utils");
const ms = require("ms");

const DB = require('../../structures/schemas/ClientDB');

module.exports = {
    name: "ready",
    execute(client) {

        let memArray = [];

        setInterval(async () => {
            memArray.push((osUtils.totalmem() - osUtils.freemem()) / 1024);

            if (memArray.length >= 14) {
                memArray.shift();
            }

            await DB.findOneAndUpdate({
                Client: true,
            }, {
                Memory: memArray,
            }, {
                upsert: true,
            });
        }, ms("5s"));
    }
}