import { getAutomationConfig } from '@configs/automationConfig';
import { addRoleAutomation } from '@functions/automations/actions/addRole';
import { createThreadAutomation } from '@functions/automations/actions/createThread';
import { giveXPAutomation } from '@functions/automations/actions/giveXP';
import { reactToMessageAutomation } from '@functions/automations/actions/reactToMessage';
import { removeReactionAutomation } from '@functions/automations/actions/removeReaction';
import { removeReactionsAutomation } from '@functions/automations/actions/removeReactions';
import { removeRoleAutomation } from '@functions/automations/actions/removeRole';
import { removeXPAutomation } from '@functions/automations/actions/removeXP';
import { replyToMessageAutomation } from '@functions/automations/actions/replyToMessage';
import { repostMessageAutomation } from '@functions/automations/actions/repostMessage';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';
import { hasImageCheck } from '@functions/automations/if/hasImage';
import { hasReactionCheck } from '@functions/automations/if/hasReaction';
import { hasRoleCheck } from '@functions/automations/if/hasRole';
import { hasTextCheck } from '@functions/automations/if/hasText';
import { hasVideoCheck } from '@functions/automations/if/hasVideo';
import { containedWordsCheck } from '@functions/automations/if/hasWords';
import { inChannelCheck } from '@functions/automations/if/inChannel';
import { isEmojiCheck } from '@functions/automations/if/isEmoji';
import { isSentenceCheck } from '@functions/automations/if/isSentence';
import { isTypeCheck } from '@functions/automations/if/isType';
import { notHasWordsCheck } from '@functions/automations/if/notHasWords';
import Automation from '@schemas/Automation';
import type { EventArgs } from '@typings/functionArgs';
import { IAutomation } from '@typings/schemas';
import { Message, MessageReaction, TextChannel, User } from 'discord.js';

export default {
  event: 'messageReactionAdd',
  name: 'automationReactionAdded',
  async execute({ client }: EventArgs, reaction: MessageReaction, user: User) {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message) return;
    if (!reaction.message.guildId) return;

    const config = await getAutomationConfig(reaction.message.guildId, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: reaction.message.guildId,
      trigger: 'reaction-added',
    });
    if (!automations) return;

    const member = reaction.message.guild?.members.cache.get(user.id);
    if (!member) return;

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (automationIf.type === 'in-channel' && !(await inChannelCheck(reaction.message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'is-type' && !(await isTypeCheck(reaction.message.channel, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'contains-words' && !(await containedWordsCheck(reaction.message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'is-exactly' && !(await isSentenceCheck(reaction.message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-not' && !(await notHasWordsCheck(reaction.message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-image' && !(await hasImageCheck(reaction.message, client))) shouldRun = false;
          if (automationIf.type === 'has-text-attachment' && !(await hasTextCheck(reaction.message, client))) shouldRun = false;
          if (automationIf.type === 'has-video' && !(await hasVideoCheck(reaction.message, client))) shouldRun = false;
          if (automationIf.type === 'is-reply' && reaction.message.reference === null) shouldRun = false;
          if (automationIf.type === 'not-reply' && reaction.message.reference !== null) shouldRun = false;
          if (automationIf.type === 'has-role' && !(await hasRoleCheck(member, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'not-role' && (await hasRoleCheck(member, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-reactions' && !(await hasReactionCheck(reaction.message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'is-emoji' && !(await isEmojiCheck(reaction, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'is-not-emoji' && (await isEmojiCheck(reaction, client, automationIf)))
            shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-message') await sendMessageAutomation(reaction.message.channel as TextChannel, client, action);
        if (action.type === 'reply') await replyToMessageAutomation(reaction.message as Message, client, action);
        if (action.type === 'delete-message') await reaction.message.delete();
        if (action.type === 'pin') await reaction.message.pin();
        if (action.type === 'send-dm') sendDmAutomation(member, client, action);
        if (action.type === 'delete-channel') await reaction.message.channel.delete();
        if (action.type === 'repost') await repostMessageAutomation(reaction.message as Message, client, action);
        if (action.type === 'add-reaction') await reactToMessageAutomation(reaction.message as Message, client, action);
        if (action.type === 'add-role') await addRoleAutomation(member, client, action);
        if (action.type === 'remove-role') await removeRoleAutomation(member, client, action);
        if (action.type === 'create-thread') await createThreadAutomation(reaction.message as Message, client, action);
        if (action.type === 'remove-all-reactions') await removeReactionsAutomation(reaction.message as Message, client);
        if (action.type === 'give-xp') await giveXPAutomation(reaction.message as Message, client, action);
        if (action.type === 'take-xp') await removeXPAutomation(reaction.message as Message, client, action);
        if (action.type === 'remove-reaction') await removeReactionAutomation(reaction, client);
      });
    });
  },
};
