import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

const buttonTypeStringToNumber = (s: string) => {
  switch (s) {
    case 'primary':
      return 1;
    case 'secondary':
      return 2;
    case 'success':
      return 3;
    case 'danger':
      return 4;
    default:
      return 1;
  }
};

export const getButtons = async (
  buttons: {
    name: string;
    style: 'primary' | 'secondary' | 'success' | 'danger';
    emoji: string;
    id: string;
  }[],
  buttonIds: string[],
) => {
  if (buttons.length === 0) return;
  if (buttonIds.length === 0) return;
  const newButtons = new ActionRowBuilder<ButtonBuilder>();

  for (const buttonId of buttonIds) {
    const button = buttons.find(button => button.id === buttonId);
    if (!button) return;
    newButtons.addComponents(
      new ButtonBuilder()
        .setCustomId(button.id ?? 'id')
        .setStyle(buttonTypeStringToNumber(button.style) ?? 1)
        .setLabel(button.name ?? 'unknown name')
        .setEmoji(button.emoji ?? ''),
    );
  }

  if (newButtons.components.length === 0) return;
  return newButtons;
};
