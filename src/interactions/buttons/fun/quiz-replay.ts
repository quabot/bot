import quiz from '../../../commands/fun/quiz';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'quiz-replay',

  async execute({ client, interaction, color }: ButtonArgs) {
    await quiz.execute({ client, interaction, color }).catch(e => console.log(e.message));
  },
};
