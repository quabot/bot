import { rollGiveaway } from "@functions/giveaway";
import Giveaway from "@schemas/Giveaway";
import { WsEventArgs } from "@typings/functionArgs";

//* Reroll a giveaway.
export default {
    code: 'giveaway-reroll',
    async execute({ client, data }: WsEventArgs) {
    
        const id = data.giveawayId;
        const guildId = data.guildId;
        if (!guildId) return;
        if (id === null || id === undefined) return;
    
        const giveaway = await Giveaway.findOne({
          guildId: guildId,
          id,
        });
        if (!giveaway) return;
    
        const giveawayEnded = await rollGiveaway(client, giveaway, true, true);
    
        if (giveawayEnded === false) return;
    
        if (!giveawayEnded) return;
    },
  };
  