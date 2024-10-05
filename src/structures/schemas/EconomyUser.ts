import { Schema, model } from 'mongoose';
import { EconomyUser } from '@typings/economy';
import { reqArray, reqBool, reqNum, reqString } from '@constants/schemas';

export default model<EconomyUser>(
  'Economy-Users',
  new Schema({
		userId: reqString,
		walletCoins: reqNum,
		bankCoins: reqNum,
		walletSize: reqNum,
		passive: reqBool,
		lastRobbedBy: reqNum,
		cooldowns: {
			gamble: reqNum,
			beg: reqNum,
			fish: reqNum,
			hack: reqNum,
			game: reqNum,
			socialMedia: reqNum,
			stream: reqNum,
			rob: reqNum,
			bankRob: reqNum,
			work: reqNum,
		},
		achievements: reqArray,
		boosts: reqArray,
		inventory: reqArray,
		job: {
			job: reqString,
			strikes: reqArray,
			performance: reqNum,
		}
  }),
);