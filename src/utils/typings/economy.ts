export interface EconomyUser {
  userId: string;
  walletCoins: number;
  bankCoins: number;
  walletSize: number;
  passive: boolean;
  lastRobbedBy: number; //* Users can only be robbed once every 5 minutes.
  lastRobbed: number; //* Users can only be rob once every 2 minutes.
  achievements: {
    id: Achievement;
    unlocked: boolean;
    unlockedAt: number;
  }[];
  inventory: {
    item: Item;
    uses: number;
    active: boolean;
  }[];
  boosts: { type: Boost; endsAt: number }[];
  job: {
    job: Job;
    strikes: { reason: number; timestamp: number }[];
    performance: number;
  };
}

//* Server settings for economy.
export interface EconomyGuild {
  guildId: string;
  enabled: boolean;
  robbing: boolean;
  passive: boolean;
}

//* List of all possible bank sizes.
export const BankSizes = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 10000000];

//* List of achievements that users can unlock.
export const Achievements = [
  {
    id: '1000-coins',
    name: 'Rich boii',
    description: 'Reach 1.000 total coins.',
    reward: {
      type: 'item',
      item: 'lock',
      amount: 1,
      uses: 0,
    },
  },
  {
    id: '10000-coins',
    name: "I'm basically a millionaire now, right?",
    description: 'Reach 10.000 total coins.',
    reward: {
      type: 'item',
      item: 'cookie',
      amount: 1,
      uses: 0,
    },
  },
  {
    id: '100000-coins',
    name: 'Time to buy a yacht',
    description: 'Reach 100.000 total coins.',
    reward: {
      type: 'item',
      item: 'landmine',
      amount: 1,
      uses: 0,
    },
  },
  {
    id: '1000000-coins',
    name: "It's a billon! Or was it a trillion?",
    description: 'Reach 1.000.000 total coins.',
    reward: {
      type: 'boost',
      boost: '2x-all-15min',
    },
  },
  {
    id: '100000000-coins',
    name: 'Time to buy Twitter',
    description: 'Reach 100.000.000 total coins.',
    reward: {
      type: 'coins',
      amount: 1000000,
    },
  },
  {
    id: 'complete-hack',
    name: "I'll leak all of this to WikiLeaks",
    description: 'Complete a hack.',
    reward: {
      type: 'item',
      item: 'landmine',
      amount: 2,
      uses: 0,
    },
  },
  {
    id: 'catch-fish',
    name: "It's so big!",
    description: 'Catch a fish.',
    reward: {
      type: 'item',
      item: 'fish',
      amount: 1,
      uses: 0,
    },
  },
  {
    id: 'consume-cookie',
    name: 'Nom nom',
    description: 'Consume a cookie.',
    reward: {
      type: 'item',
      item: 'apple',
      amount: 1,
      uses: 0,
    },
  },
  {
    id: 'robbed-beg',
    name: "But I'm broke, how can you rob me?",
    description: 'Get robbed whilst begging.',
    reward: {
      type: 'coins',
      amount: 500,
    },
  },
  {
    id: 'lose-gamble',
    name: "I swear I'll win next time",
    description: 'Lose all your money when gambling.',
    reward: {
      type: 'coins',
      amount: 1000,
    },
  },
  {
    id: 'complete-trade',
    name: 'Capitalism at its finest',
    description: 'Complete a trade.',
    reward: {
      type: 'item',
      item: 'apple',
      amount: 1,
      uses: 0,
    },
  },
  {
    id: 'win-gaming',
    name: 'Engineer gaming',
    description: 'Win 500 coins from gaming.',
    reward: {
      type: 'item',
      item: 'controller',
      amount: 1,
      uses: 0,
    },
  },
];

export type Achievement = (typeof Achievements)[number]['id'];

//* List of all possible items that are available.
export const Items = [
  //? Equipment Items
  {
    id: 'cutters',
    name: 'Wire Cutters',
    description: 'Improves the chances of successfully robbing a user or bank.',
    icon: '[cutter_icon]',
    maxUses: 5,
    type: 'equipment',
    can_activate: false,
    max: 10,
    canBuy: true,
    buyPrice: 500,
    canSell: true,
    sellPrice: 200,
  },
  {
    id: 'laptop',
    name: 'Laptop',
    description: 'Used to hack users, companies and to start gaming.',
    icon: '[laptop_icon]',
    maxUses: 20, //? Can break before the 20 uses mark, when hacking, getting robbed or gaming (rage quit).
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 1000,
    canSell: true,
    sellPrice: 300,
  },
  {
    id: 'mask',
    name: 'Mask',
    description: 'Improves the chances of not getting caught fined whilst robbing a bank.',
    icon: '[mask_icon]',
    maxUses: 4,
    type: 'equipment',
    can_activate: false,
    max: 5,
    canBuy: true,
    buyPrice: 500,
    canSell: true,
    sellPrice: 50,
  },
  {
    id: 'bomb-disarmer',
    name: 'Bomb Disarmer',
    description: 'Can be used to disarm a landmine. (100% success rate not included)',
    icon: '[bomb_disarmer_icon]',
    maxUses: 1,
    type: 'equipment',
    can_activate: false,
    max: 5,
    canBuy: true,
    buyPrice: 500,
    canSell: true,
    sellPrice: 200,
  },
  {
    id: 'bomb-vest',
    name: 'Bomb Vest',
    description: 'Protects you from a landmine.',
    icon: '[bomb_vest_icon]',
    maxUses: 1,
    type: 'equipment',
    can_activate: false,
    max: 5,
    canBuy: true,
    buyPrice: 500,
    canSell: true,
    sellPrice: 50,
  },
  {
    id: 'fishing-rod',
    name: 'Fishing Rod',
    description: 'Used to catch fish (and possibly other loot).',
    icon: '[fishing_rod_icon]',
    maxUses: 10,
    type: 'equipment',
    can_activate: false,
    max: 5,
    canBuy: true,
    buyPrice: 150,
    canSell: true,
    sellPrice: 50,
  },
  {
    id: 'video-camera',
    name: 'Video Camera',
    description: 'Used to record content for social media.',
    icon: '[video_camera_icon]',
    maxUses: 12,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 750,
    canSell: true,
    sellPrice: 200,
  },
  {
    id: 'microphone',
    name: 'Microphone',
    description: 'Used to record content for social media, and for streaming.',
    icon: '[microphone_icon]',
    maxUses: 20,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 500,
    canSell: true,
    sellPrice: 150,
  },
  {
    id: 'controller',
    name: 'Controller',
    description: 'Used to game or streaming gaming content.',
    icon: '[controller_icon]',
    maxUses: 10,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 250,
    canSell: true,
    sellPrice: 50,
  },
  {
    id: 'lock',
    name: 'Lock',
    description: 'Can be placed to protect your wallet or bank and can lock out some robbers.',
    icon: '[lock_icon]',
    maxUses: 3, //? can be destroyed by cutters too
    type: 'equipment',
    can_activate: true,
    max: 10,
    canBuy: true,
    buyPrice: 200,
    canSell: true,
    sellPrice: 50,
  },
  {
    id: 'security-camera',
    name: 'Security Camera',
    description: 'Can be placed to protect your wallet or bank, and can catch robbers or fine them.',
    icon: '[security_camera_icon]',
    maxUses: 1000,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 1250,
    canSell: true,
    sellPrice: 500,
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    description: 'Used to game or streaming gaming content.',
    icon: '[keyboard_icon]',
    maxUses: 25,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 400,
    canSell: true,
    sellPrice: 100,
  },
  {
    id: 'mouse',
    name: 'Mouse',
    description: 'Used to game or streaming gaming content.',
    icon: '[mouse_icon]',
    maxUses: 20,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 300,
    canSell: true,
    sellPrice: 75,
  },
  {
    id: 'pc',
    name: 'PC',
    description: 'Used to game or streaming gaming content.',
    icon: '[pc_icon]',
    maxUses: 50,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 5000,
    canSell: true,
    sellPrice: 500,
  },
  {
    id: 'headset',
    name: 'Headset',
    description: 'Used to game or streaming gaming content.',
    icon: '[headset_icon]',
    maxUses: 15,
    type: 'equipment',
    can_activate: false,
    max: 1,
    canBuy: true,
    buyPrice: 200,
    canSell: true,
    sellPrice: 50,
  },
  {
    id: 'landmine',
    name: 'Landmine',
    description: 'Can be placed to protect your wallet or bank.',
    icon: '[landmine_icon]',
    maxUses: 1,
    type: 'equipment',
    can_activate: true,
    max: 5,
    canBuy: true,
    buyPrice: 350,
    canSell: true,
  },

  //? Consumable Items
  {
    id: 'cookie',
    name: 'Cookie',
    description: 'A cookie gives a 2x income boost (excluding robberies) for 1 hour.',
    icon: '[cookie_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: true,
    max: 10,
    activation: {
      type: 'boost',
      boost: '2x-passive-1h',
    },
    canBuy: true,
    buyPrice: 10000,
    canSell: true,
    sellPrice: 1500,
  },
  {
    id: 'apple',
    name: 'Apple',
    description: 'A beautiful red apple',
    icon: '[apple_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: true,
    max: 10,
    activation: {
      type: 'random',
      options: [
        {
          type: 'boost',
          boost: '1.5x-passive-15min',
          chance: 0.08,
        },
        {
          type: 'boost',
          boost: '0.5x-all-15min',
          chance: 0.05,
        },
        {
          type: 'coins',
          amount: 500,
          chance: 0.12,
        },
        {
          type: 'none',
          chance: 0.8,
        },
        {
          type: 'medical-bill',
          chance: 0.05,
          bill: 10000,
        },
      ],
    },
    canBuy: true,
    buyPrice: 300,
    canSell: true,
    sellPrice: 5,
  },
  {
    id: 'bread',
    name: 'Bread',
    description: 'A nice loaf of bread.',
    icon: '[bread_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: true,
    max: 10,
    activation: {
      type: 'random',
      options: [
        {
          type: 'boost',
          boost: '1.5x-passive-15min',
          chance: 0.08,
        },
        {
          type: 'boost',
          boost: '0.5x-all-15min',
          chance: 0.05,
        },
        {
          type: 'coins',
          amount: 500,
          chance: 0.14,
        },
        {
          type: 'none',
          chance: 0.8,
        },
        {
          type: 'medical-bill',
          chance: 0.03,
          bill: 10000,
        },
      ],
    },
    canBuy: true,
    buyPrice: 400,
    canSell: true,
    sellPrice: 10,
  },
  {
    id: 'fish',
    name: 'Fish',
    description: 'A sea creature.',
    icon: '[fish_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: false,
    max: 15,
    activation: {
      type: 'none',
    },
    canBuy: false,
    buyPrice: 0,
    canSell: true,
    sellPrice: 0,
  },
  {
    id: 'stick',
    name: 'Stick',
    description: 'A stick.',
    icon: '[stick_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: false,
    max: 10,
    activation: {
      type: 'none',
    },
    sellPrice: 1,
    buyPrice: 0,
    canBuy: false,
    canSell: true,
  },
  {
    id: 'rock',
    name: 'Rock',
    description: 'A rock.',
    icon: '[rock_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: false,
    max: 10,
    activation: {
      type: 'none',
    },
    sellPrice: [0, 1, 5, 10],
    buyPrice: 0,
    canBuy: false,
    canSell: true,
  },
  {
    id: 'clothes',
    name: 'Clothes',
    description: 'A set of clothes.',
    icon: '[clothes_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: false,
    max: 10,
    activation: {
      type: 'none',
    },
    sellPrice: [0, 5, 10, 25, 50, 75],
    buyPrice: 0,
    canBuy: false,
    canSell: true,
  },
  {
    id: 'old-jar',
    name: 'Old Jar',
    description: 'An old jar that can be sold or opened.',
    icon: '[old_jar_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: true,
    max: 5,
    activation: {
      type: 'random',
      options: [
        {
          type: 'coins',
          amount: 1000,
          chance: 0.5,
        },
        {
          type: 'coins',
          amount: 500,
          chance: 0.25,
        },
        {
          type: 'coins',
          amount: 250,
          chance: 0.1,
        },
        {
          type: 'coins',
          amount: 100,
          chance: 0.05,
        },
        {
          type: 'coins',
          amount: 50,
          chance: 0.05,
        },
        {
          type: 'coins',
          amount: 25,
          chance: 0.05,
        },
      ],
    },
    sellPrice: [0, 1, 5, 10],
    buyPrice: 0,
    canBuy: false,
    canSell: true,
  },
  {
    id: 'old-coin',
    name: 'Old Coin',
    description: 'An old coin..',
    icon: '[old_coin_icon]',
    maxUses: 1,
    type: 'consumable',
    can_active: false,
    max: 5,
    activation: {
      type: 'none',
    },
    sellPrice: [0, 1, 5, 10, 25, 50, 500],
    buyPrice: 0,
    canBuy: false,
    canSell: true,
  },
  {
    id: 'water-bottle',
    name: 'Water Bottle',
    description: 'A bottle of water.',
    icon: '[water_bottle_icon]',
    maxUses: 1,
    type: 'consumable',
    can_activate: true,
    max: 10,
    activation: {
      type: 'none'
    },
    canBuy: true,
    canSell: true,
    buyPrice: 20,
    sellPrice: 5,
  }
];

export type Item = (typeof Items)[number]['id'];

export const Boosts = [
  {
    type: '2x-passive-1h',
    name: '2x multiplier for 1 hour',
    description: 'Receive 2x the amount of coins from income (excluding robberies) for 1 hour.',
    duration: 3600000,
    multiplier: 2,
    appliesTo: 'passive',
  },
  {
    type: '1.5x-passive-15min',
    name: '1.5x multiplier for 15 minutes',
    description: 'Receive 1.5x the amount of coins from income (excluding robberies) for 15 minutes.',
    duration: 900000,
    multiplier: 1.5,
    appliesTo: 'passive',
  },
  {
    type: '2x-all-15min',
    name: '2x multiplier for 15 minutes',
    description: 'Receive 2.5x the amount of coins from all income for 15 minutes.',
    duration: 900000,
    multiplier: 2.5,
    appliesTo: 'all',
  },
  {
    type: '0.5x-all-15min',
    name: '0.5x multiplier for 15 minutes',
    description: 'Receive 0.5x the amount of coins from all income for 15 minutes.',
    duration: 900000,
  },
];
export type Boost = (typeof Boosts)[number]['type'];

export const Jobs = [
  {
    id: 'cleaner',
  },
];
export type Job = (typeof Jobs)[number]['id'];
