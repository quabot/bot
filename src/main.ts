import { ShardingManager } from 'discord.js';
import consola from 'consola';

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env.TOKEN ?? '',
  respawn: true,
  execArgv: ['--require', 'dotenv/config', '--require', 'module-alias/register', 'dist/main.js'],
	mode: 'worker',
	totalShards: 2
});
consola.info(`Loading QuaBot v${require('../package.json').version}.`);

manager.on('shardCreate', shard => {
  consola.log('');
  consola.info(`Launched shard #${shard.id + 1}.`);
});

manager.spawn();
