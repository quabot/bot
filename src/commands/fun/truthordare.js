const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('../../utils/constants/embed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('truthordare')
		.setDescription('Get a truth or dare.')
		.setDMPermission(false),
	/**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
	async execute(client, interaction, color) {
		//* Defer the reply to give the user an instant response.
		await interaction.deferReply();

		//* Define a list of truths and dares.
		// ? Why not an API? I don't really know but i think it was due to ratelimits. We could change this but this works too.
		// ? Most APIs had only a couple of answers and so we put those + more in arrays.
		const truths = [
			{
				'question': 'Did you drink alcohol before you were legal to do so?'
			},
			{
				'question': 'Have you ever tried marijuana?'
			},
			{
				'question': 'Have you ever tried cocaine?'
			},
			{
				'question': 'Have you ever tried magic mushrooms?'
			},
			{
				'question': 'Have you ever tried ecstasy?'
			},
			{
				'question': 'What\'s the weirdest thing you\'ve done while drunk?'
			},
			{
				'question': 'What did you last search for on your phone web browser?'
			},
			{
				'question': 'Have you ever accidentally walked in on your parents naked?'
			},
			{
				'question': 'Have you ever eaten food that you dropped on the ground?'
			},
			{
				'question': 'Have you ever picked your nose and ate it?'
			},
			{
				'question': 'Have you ever shoplifted?'
			},
			{
				'question': 'Have you ever stolen money from your parents?'
			},
			{
				'question': 'Have you ever blamed something you did on another person?'
			},
			{
				'question': 'Have you ever peed in your pants from laughing too hard?'
			},
			{
				'question': 'Have you ever tasted your ear wax?'
			},
			{
				'question': 'Have you ever peed in a public pool?'
			},
			{
				'question': 'Have you ever had a crush on one of your teachers?'
			},
			{
				'question': 'Have you ever made out in an elevator?'
			},
			{
				'question': 'Do you like anyone in this group more than a friend?'
			},
			{
				'question': 'Have you ever made out with someone in this group?'
			},
			{
				'question': 'Are you wearing underwear?'
			},
			{
				'question': 'Have you ever worn the same underwear for more than one day?'
			},
			{
				'question': 'Do you smell your clothes to determine if you can wear them again without washing?'
			},
			{
				'question': 'What parts of your body do you shave?'
			},
			{
				'question': 'Have you ever had cosmetic surgery?'
			},
			{
				'question': 'Have you ever accused someone else of farting after you farted?'
			},
			{
				'question': 'Have you ever dressed up as the opposite sex?'
			},
			{
				'question': 'What do you have in your room that your parents don\'t know about?'
			},
			{
				'question': 'Do you wash your hands every time after you go to the bathroom?'
			},
			{
				'question': 'What\'s the weirdest outfit you\'ve ever worn in public?'
			},
			{
				'question': 'What was your most recent embarrassing moment?'
			},
			{
				'question': 'What joke do you think is funny that nobody ever laughs at?'
			},
			{
				'question': 'Have you ever blamed a pet for something you did?'
			},
			{
				'question': 'Have you ever laughed at a totally inappropriate moment?'
			},
			{
				'question': 'What practical joke did you totally fall for?'
			},
			{
				'question': 'Have you ever sent someone naked photos of yourself?'
			},
			{
				'question': 'Have you ever taken a duck face selfie?'
			},
			{
				'question': 'What\'s the most disgusting food you\'ve ever eaten?'
			},
			{
				'question': 'Have you ever popped a zit in public?'
			},
			{
				'question': 'What\'s the worst thing you\'ve ever done to someone else?'
			},
			{
				'question': 'Did you ever try to fake your report card grades?'
			},
			{
				'question': 'Have you ever been mean to one of your teachers?'
			},
			{
				'question': 'What thing did you do that got you into the most trouble?'
			},
			{
				'question': 'What was the last thing you did to get grounded?'
			},
			{
				'question': 'Have you ever tried to write an excuse note for yourself?'
			},
			{
				'question': 'What\'s the biggest mistake you\'ve ever made while cooking?'
			},
			{
				'question': 'Have you ever started an unintended fire?'
			},
			{
				'question': 'Have you ever accidentally destroyed something that was important to someone else?'
			},
			{
				'question': 'Have you ever eaten dog food?'
			},
			{
				'question': 'Have you ever eaten something that was already thrown in the trash?'
			},
			{
				'question': 'What song\'s words did you totally mess up but you thought were correct?'
			},
			{
				'question': 'Have you ever drawn on someone when they were asleep?'
			},
			{
				'question': 'What video have you made that you\'re most embarrassed about?'
			},
			{
				'question': 'What\'s the most recent lie you told your parents?'
			},
			{
				'question': 'What was the last lie you told your significant other?'
			},
			{
				'question': 'What\'s your most recent naked story?'
			},
			{
				'question': 'Did you ever do a school prank?'
			},
			{
				'question': 'What did you do to get suspended from school?'
			},
			{
				'question': 'What did you do to end up in detention at school?'
			},
			{
				'question': 'What got you into the most trouble at home?'
			},
			{
				'question': 'What rumor did you start that you\'re sorry about?'
			},
			{
				'question': 'What is the best lie you convinced someone that was true?'
			},
			{
				'question': 'Have you ever been caught copying someone else\'s work?'
			},
			{
				'question': 'How did you get away with cheating on a test?'
			},
			{
				'question': 'Do you have anything in your bed for comfort when you sleep?'
			},
			{
				'question': 'Do you still sleep with a nightlight?'
			},
			{
				'question': 'What is your scariest imagination when you fall to sleep?'
			},
			{
				'question': 'When is the last time you pretended to be sick when you weren\'t?'
			},
			{
				'question': 'When is the last time you threw up?'
			},
			{
				'question': 'What do you think might be hiding in your closet at night?'
			},
			{
				'question': 'What\'s the last thing you binged ate?'
			},
			{
				'question': 'What\'s something you thought your parents didn\'t know but found out later they did?'
			},
			{
				'question': 'Did you ever sneak outside your house after you were supposed to be asleep?'
			},
			{
				'question': 'What happened at your worst birthday party?'
			},
			{
				'question': 'What\'s the worst excuse you tried to use on a teacher or parent?'
			},
			{
				'question': 'Who do you currently have a crush on?'
			},
			{
				'question': 'When\'s the last time you farted?'
			},
			{
				'question': 'When\'s the last time you sharted?'
			},
			{
				'question': 'What\'s your most embarrassing toilet story?'
			},
			{
				'question': 'What was the most embarrassing thing you accidentally texted to the wrong person?'
			},
			{
				'question': 'When is the last time you tried to silently fart, but it ended up being loud?'
			},
			{
				'question': 'What\'s your pooped in my pants story?'
			},
			{
				'question': 'What\'s your accidentally insulting someone story?'
			},
			{
				'question': 'Have you ever picked a wedgie and then smelled your fingers?'
			},
			{
				'question': 'What\'s your most embarrassing swimming story?'
			},
			{
				'question': 'What\'s the last thing you had stuck in your teeth that you didn\'t notice until you got home?'
			},
			{
				'question': 'What\'s your most embarrassing clothes malfunction story?'
			},
			{
				'question': 'How did you ruin clothing you really liked?'
			},
			{
				'question': 'What\'s the dumbest thing you\'ve said in front of someone you liked?'
			},
			{
				'question': 'What\'s the most recent thing you learned wasn\'t true that you thought was?'
			},
			{
				'question': 'When\'s the last time you snored loudly in front of others?'
			},
			{
				'question': 'What\'s the last big mistake you made in front of others?'
			},
			{
				'question': 'Who\'s the last person you called by the wrong name?'
			},
			{
				'question': 'Have you ever walked into something while on the phone?'
			},
			{
				'question': 'What did you think at the time was cool but now you regret?'
			},
			{
				'question': 'What did you think you were good at but found out that you really weren\'t?'
			},
			{
				'question': 'What\'s your bad breath story?'
			},
			{
				'question': 'What\'s your snot shooting out my nose story?'
			},
			{
				'question': 'Have you ever clipped your toenails in public?'
			},
			{
				'question': 'What\'s your really weird secret collection?'
			}
		];

		const dares = [
			{
				'question': 'Let the group pose you for a photo and you have to post it as your profile photo for the next 24 hours.'
			},
			{
				'question': 'Take off your shoes and socks with nothing but your teeth.'
			},
			{
				'question': 'Try to swallow a spoonful of cinnamon with no liquid.'
			},
			{
				'question': 'Take a shot of hot sauce.'
			},
			{
				'question': 'Let the group blindfold you and feed you something out of the refrigerator.'
			},
			{
				'question': 'Let the group duct tape a part of your body of their choice and rip it off.'
			},
			{
				'question': 'Smear peanut butter on your face and let the dog lick it off.'
			},
			{
				'question': 'Take a shot of pickle juice.'
			},
			{
				'question': 'Let the group style your hair as they please and you have to wear it that way until you go to sleep.'
			},
			{
				'question': 'Eat a spoonful of butter'
			},
			{
				'question': 'Spend the rest of the game talking without letting your lips touch each other.'
			},
			{
				'question': 'Let the group draw something on your face in permanent marker.'
			},
			{
				'question': 'Let the group take over your main social media account for ten minutes.'
			},
			{
				'question': 'Let the group text what they want to the last person you texted to.'
			},
			{
				'question': 'Let the group have access to your phone for ten minutes.'
			},
			{
				'question': 'Put your forehead on the end of a bat and spin around it ten times as fast as you can and then walk in a straight line.'
			},
			{
				'question': 'Crush an egg against your forehead.'
			},
			{
				'question': 'Read your last text conversation out loud to the group.'
			},
			{
				'question': 'Wear your underwear over your pants for the rest of the day.'
			},
			{
				'question': 'Let the group decide a Snapchat for you to perform and post.'
			},
			{
				'question': 'Let the group paint your nails.'
			},
			{
				'question': 'Text the person you have a crush on and tell them.'
			},
			{
				'question': 'Let the group decide on something you have to text your parents.'
			},
			{
				'question': 'Empty your wallet or purse in front of the group.'
			},
			{
				'question': 'Do 50 pushups and 50 situps.'
			},
			{
				'question': 'Soak a t-shirt in water, put it in the freezer for 15 minutes and then put it on.'
			},
			{
				'question': 'Eat a spoonful of mayonnaise.'
			},
			{
				'question': 'Let the group do your face with makeup'
			},
			{
				'question': 'Condition your hair with an egg and leave it in for the rest of the game.'
			},
			{
				'question': 'Let the group give you a permanent marker mustache.'
			},
			{
				'question': 'Let the group blindfold you and give you three objects to kiss.'
			},
			{
				'question': 'Shave your eyebrows.'
			},
			{
				'question': 'Let someone in the group cut off a piece of your hair.'
			},
			{
				'question': 'Let the group film you doing a makeup tutorial and post it to your social media.'
			},
			{
				'question': 'Let the group make you a smoothie out of anything they want that you must drink.'
			},
			{
				'question': 'Try to swallow a spoonful of flour with no liquid.'
			},
			{
				'question': 'Eat 6 saltine crackers in one minute without liquid.'
			},
			{
				'question': 'Let the group draw a tattoo on you in permanent marker.'
			},
			{
				'question': 'Shave the hair off of one arm.'
			},
			{
				'question': 'Put all your clothes on backward for the rest of the day.'
			},
			{
				'question': 'Announce to the group your last 10 searches.'
			},
			{
				'question': 'Eat a spoonful of wasabi.'
			},
			{
				'question': 'Use lipstick to color your front two teeth and leave it like that for the rest of the day.'
			},
			{
				'question': 'Make a diaper out of a t-shirt and wear it outside your pants for the rest of the day.'
			},
			{
				'question': 'Make a tinfoil hat and wear it for the rest of the day.'
			},
			{
				'question': 'Make a wet toilet paper mask, have the group take a photo and post it to social media.'
			},
			{
				'question': 'Let the group pour ice down the back of your shirt.'
			},
			{
				'question': 'Let each person in the group spank you as hard as they can.'
			},
			{
				'question': 'Let the group put a collar and leash on your and walk you down the street.'
			},
			{
				'question': 'Let the group give you a wedgie.'
			},
			{
				'question': 'Put your hair in the toilet and flush while the group watches.'
			},
			{
				'question': 'Make a video of you singing your favorite song and post it to social media.'
			},
			{
				'question': 'Pour a glass of water over your head.'
			},
			{
				'question': 'Let each member of the group give you a wet willy.'
			},
			{
				'question': 'Take a deep breath of the socks of every person in the group.'
			},
			{
				'question': 'Do a handstand and drink a glass of water.'
			},
			{
				'question': 'Chew gum with the gum wrapper still on it.'
			},
			{
				'question': 'Lick your own armpit.'
			},
			{
				'question': 'Let the group squeeze toothpaste into your mouth.'
			},
			{
				'question': 'Wash your mouth out with soap and water.'
			},
			{
				'question': 'Let the group make you a shot out of anything in the refrigerator that you must take.'
			},
			{
				'question': 'Sing your favorite song with your mouth full of water.'
			},
			{
				'question': 'Pick your nose and eat it.'
			},
			{
				'question': 'Take ear wax out of your ear and taste it.'
			},
			{
				'question': 'Take a shot of lemon or lime juice.'
			},
			{
				'question': 'Eat part of a crayon.'
			},
			{
				'question': 'Make the ugliest face you can, then post it to social media.'
			},
			{
				'question': 'See how many marshmallows you can shove into your mouth.'
			},
			{
				'question': 'Eat a banana without peeling it.'
			},
			{
				'question': 'Eat an orange without peeling it.'
			},
			{
				'question': 'Make a sandwich blindfolded, then take a bite.'
			},
			{
				'question': 'Call your mom to say that you\'ve gotten engaged or divorced.'
			},
			{
				'question': 'Peel a potato, orange or banana with your teeth.'
			},
			{
				'question': 'Chew on a piece of aluminum foil for 1 minute.'
			},
			{
				'question': 'Eat an entire clove of garlic.'
			},
			{
				'question': 'Eat a raw onion.'
			},
			{
				'question': 'Gargle with mayonnaise.'
			},
			{
				'question': 'Cut the toenails of a member of the group\'s choosing.'
			},
			{
				'question': 'Let the group cover your face in whip cream.'
			},
			{
				'question': 'Send a text message to your boss only using your tongue.'
			},
			{
				'question': 'Pull out a minimum of 5 nose hairs.'
			},
			{
				'question': 'Drink something frozen until you get brain freeze.'
			},
			{
				'question': 'Keep calling random phone numbers until you can keep someone on the phone for 5+ minutes.'
			},
			{
				'question': 'Do a cartwheel and a backbend.'
			},
			{
				'question': 'Do a shot of soy sauce.'
			},
			{
				'question': 'Let a group member pluck 10 of your eyebrows.'
			},
			{
				'question': 'Walk barefoot for 10 feet over Legos.'
			},
			{
				'question': 'Blow your nose into your hands.'
			},
			{
				'question': 'Call your parents and tell them you accidentally broke something they greatly value.'
			},
			{
				'question': 'Pop the zit of someone in the group.'
			},
			{
				'question': 'Let everyone in the group burp in your face.'
			},
			{
				'question': 'Listen to a song of the group\'s choosing 10 times in a row.'
			},
			{
				'question': 'Talk the rest of the game without opening your mouth.'
			},
			{
				'question': 'Give everyone in the group a 5-minute foot massage.'
			},
			{
				'question': 'Put a piece of green food in your teeth and keep it there for the rest of the day.'
			},
			{
				'question': 'Put a dab of toothpaste on your shirt and leave it there for the rest of the day.'
			},
			{
				'question': 'Wear your shirt inside out for the rest of the day.'
			},
			{
				'question': 'Put a piece of food up your nose and then eat it.'
			},
			{
				'question': 'Do 10 yoga poses of the group\'s choosing.'
			},
			{
				'question': 'Drink water out your shoe.'
			}
		];


		//* Send a random truth and dare to the user.
		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(`**Truth**\n${truths[Math.floor(Math.random() * truths.length)].question}\n**Dare**\n${dares[Math.floor(Math.random() * dares.length)].question}`)
			]
		});
	}
};