
//* Remove the config from the cache when the backend tells it to.
module.exports = {
    code: 'cache',
    async execute(client, data) {
        client.cache.take(data.message);
    }
}