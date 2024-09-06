import type { EventArgs } from '@typings/functionArgs';
import type { Message, TextChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';
import { IAutomation } from '@typings/schemas';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { repostMessageAutomation } from '@functions/automations/actions/repostMessage';
import { addRoleAutomation } from '@functions/automations/actions/addRole';
import { removeRoleAutomation } from '@functions/automations/actions/removeRole';
import { giveXPAutomation } from '@functions/automations/actions/giveXP';
import { removeXPAutomation } from '@functions/automations/actions/removeXP';
import { inChannelCheck } from '@functions/automations/if/inChannel';
import { isTypeCheck } from '@functions/automations/if/isType';
import { containedWordsCheck } from '@functions/automations/if/hasWords';
import { isSentenceCheck } from '@functions/automations/if/isSentence';
import { notHasWordsCheck } from '@functions/automations/if/notHasWords';
import { hasImageCheck } from '@functions/automations/if/hasImage';
import { hasTextCheck } from '@functions/automations/if/hasText';
import { hasVideoCheck } from '@functions/automations/if/hasVideo';
import { hasRoleCheck } from '@functions/automations/if/hasRole';
import { hasReactionCheck } from '@functions/automations/if/hasReaction';

export default {
  event: 'messageDelete',
  name: 'automationDeletedMessage',
  async execute({ client }: EventArgs, message: Message) {
    if (!message.author) return;
    if (message.author.bot) return;
    if (!message.guildId) return;

    const config = await getAutomationConfig(message.guildId, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: message.guildId,
      trigger: 'deleted-message',
    });
    if (!automations) return;

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (automationIf.type === 'in-channel' && !(await inChannelCheck(message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'is-type' && !(await isTypeCheck(message.channel, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'contains-words' && !(await containedWordsCheck(message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'is-exactly' && !(await isSentenceCheck(message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-not' && !(await notHasWordsCheck(message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-image' && !(await hasImageCheck(message, client))) shouldRun = false;
          if (automationIf.type === 'has-text-attachment' && !(await hasTextCheck(message, client))) shouldRun = false;
          if (automationIf.type === 'has-video' && !(await hasVideoCheck(message, client))) shouldRun = false;
          if (automationIf.type === 'is-reply' && message.reference === null) shouldRun = false;
          if (automationIf.type === 'not-reply' && message.reference !== null) shouldRun = false;
          if (automationIf.type === 'has-role' && !(await hasRoleCheck(message.member, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'not-role' && (await hasRoleCheck(message.member, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-reactions' && !(await hasReactionCheck(message, client, automationIf)))
            shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-message') await sendMessageAutomation(message.channel as TextChannel, client, action);
        if (action.type === 'delete-message') await message.delete();
        if (action.type === 'send-dm') sendDmAutomation(message.member, client, action);
        if (action.type === 'delete-channel') await message.channel.delete();
        if (action.type === 'repost') await repostMessageAutomation(message, client, action);
        if (action.type === 'add-role') await addRoleAutomation(message.member, client, action);
        if (action.type === 'remove-role') await removeRoleAutomation(message.member, client, action);
        if (action.type === 'give-xp') await giveXPAutomation(message, client, action);
        if (action.type === 'take-xp') await removeXPAutomation(message, client, action);
      });
    });
  },
};
