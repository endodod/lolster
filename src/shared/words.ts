/**
 * League words: category -> subcategory -> words. Subcategories power the first-speaker bonus hint.
 * Champions (by class), items, runes and summoner spells come from Riot Data Dragon 16.23.
 */
export const TREE: Record<string, Record<string, string[]>> = {
  "Champions": {
    "Fighters": ["Aatrox", "Ambessa", "Bel'Veth", "Briar", "Camille", "Darius", "Diana", "Fiora", "Gangplank", "Garen", "Gnar", "Gragas", "Gwen", "Hecarim", "Illaoi", "Irelia", "Jarvan IV", "Jax", "Jayce", "Kayn", "Kled", "Lee Sin", "Lillia", "Master Yi", "Mordekaiser", "Nasus", "Nilah", "Nocturne", "Olaf", "Pantheon", "Rek'Sai", "Renekton", "Riven", "Rumble", "Sett", "Shyvana", "Trundle", "Tryndamere", "Udyr", "Urgot", "Vi", "Viego", "Volibear", "Warwick", "Wukong", "Xin Zhao", "Yasuo", "Yone", "Yorick", "Zaahen"],
    "Tanks": ["Alistar", "Amumu", "Blitzcrank", "Braum", "Cho'Gath", "Dr. Mundo", "Galio", "K'Sante", "Leona", "Malphite", "Maokai", "Nautilus", "Nunu & Willump", "Ornn", "Poppy", "Rammus", "Rell", "Sejuani", "Shen", "Singed", "Sion", "Skarner", "Tahm Kench", "Zac"],
    "Mages": ["Ahri", "Anivia", "Annie", "Aurelion Sol", "Aurora", "Azir", "Brand", "Cassiopeia", "Fiddlesticks", "Heimerdinger", "Hwei", "Karma", "Karthus", "Kennen", "Lissandra", "Lux", "Malzahar", "Mel", "Neeko", "Orianna", "Ryze", "Swain", "Sylas", "Syndra", "Taliyah", "Twisted Fate", "Veigar", "Vel'Koz", "Vex", "Viktor", "Vladimir", "Xerath", "Ziggs", "Zoe", "Zyra"],
    "Assassins": ["Akali", "Ekko", "Elise", "Evelynn", "Fizz", "Kassadin", "Katarina", "Kha'Zix", "LeBlanc", "Locke", "Naafiri", "Nidalee", "Qiyana", "Rengar", "Shaco", "Talon", "Zed"],
    "Marksmen": ["Akshan", "Aphelios", "Ashe", "Caitlyn", "Corki", "Draven", "Ezreal", "Graves", "Jhin", "Jinx", "Kai'Sa", "Kalista", "Kayle", "Kindred", "Kog'Maw", "Lucian", "Miss Fortune", "Quinn", "Samira", "Sivir", "Smolder", "Teemo", "Tristana", "Twitch", "Varus", "Vayne", "Xayah", "Yunara", "Zeri"],
    "Supports": ["Bard", "Ivern", "Janna", "Lulu", "Milio", "Morgana", "Nami", "Pyke", "Rakan", "Renata Glasc", "Senna", "Seraphine", "Sona", "Soraka", "Taric", "Thresh", "Yuumi", "Zilean"],
  },
  "Items": {
    "Starters, wards & consumables": ["Control Ward", "Cull", "Dark Seal", "Doran's Blade", "Doran's Bow", "Doran's Helm", "Doran's Ring", "Doran's Shield", "Elixir of Iron", "Elixir of Sorcery", "Elixir of Wrath", "Farsight Alteration", "Gustwalker Hatchling", "Health Potion", "Mosstomper Seedling", "Oracle Lens", "Refillable Potion", "Scorchclaw Pup", "Stealth Ward"],
    "Boots": ["Armored Advance", "Berserker's Greaves", "Boots", "Boots of Swiftness", "Chainlaced Crushers", "Crimson Lucidity", "Gluttonous Greaves", "Gunmetal Greaves", "Immortal Path", "Ionian Boots of Lucidity", "Mercury's Treads", "Plated Steelcaps", "Sorcerer's Shoes", "Spellslinger's Shoes", "Swiftmarch"],
    "Components": ["Aether Wisp", "Amplifying Tome", "B. F. Sword", "Bami's Cinder", "Bandleglass Mirror", "Blasting Wand", "Blighting Jewel", "Bramble Vest", "Catalyst of Aeons", "Caulfield's Warhammer", "Chain Vest", "Cloak of Agility", "Cloth Armor", "Crystalline Bracer", "Dagger", "Executioner's Calling", "Faerie Charm", "Fated Ashes", "Fiendish Codex", "Forbidden Idol", "Giant's Belt", "Glacial Buckler", "Glowing Mote", "Haunting Guise", "Hearthbound Axe", "Hexdrinker", "Hextech Alternator", "Kindlegem", "Last Whisper", "Long Sword", "Lost Chapter", "Needlessly Large Rod", "Negatron Cloak", "Noonquiver", "Null-Magic Mantle", "Oblivion Orb", "Phage", "Pickaxe", "Quicksilver Sash", "Rectrix", "Recurve Bow", "Rejuvenation Bead", "Ruby Crystal", "Sapphire Crystal", "Scout's Slingshot", "Seeker's Armguard", "Serrated Dirk", "Sheen", "Spectre's Cowl", "Steel Sigil", "Tear of the Goddess", "The Brutalizer", "Tiamat", "Tunneler", "Vampiric Scepter", "Verdant Barrier", "Warden's Mail", "Whispering Circlet", "Winged Moonplate", "Zeal"],
    "Fighter & marksman items": ["Axiom Arc", "Bastionbreaker", "Black Cleaver", "Blade of The Ruined King", "Bloodthirster", "Chempunk Chainsword", "Death's Dance", "Eclipse", "Edge of Night", "Endless Hunger", "Essence Reaver", "Experimental Hexplate", "Fiendhunter Bolts", "Gambler's Blade", "Guardian Angel", "Guinsoo's Rageblade", "Hexoptics C44", "Hubris", "Hullbreaker", "Iceborn Gauntlet", "Immortal Shieldbow", "Infinity Edge", "Kraken Slayer", "Lord Dominik's Regards", "Manamune", "Maw of Malmortius", "Mercurial Scimitar", "Mortal Reminder", "Navori Flickerblade", "Overlord's Bloodmail", "Phantom Dancer", "Profane Hydra", "Rapid Firecannon", "Ravenous Hydra", "Runaan's Hurricane", "Serpent's Fang", "Serylda's Grudge", "Spear of Shojin", "Statikk Shiv", "Sterak's Gage", "Stormrazor", "Stridebreaker", "Sundered Sky", "Terminus", "The Collector", "Titanic Hydra", "Trinity Force", "Umbral Glaive", "Voltaic Cyclosword", "Wit's End", "Youmuu's Ghostblade", "Yun Tal Wildarrows", "Zephyr"],
    "Mage items": ["Actualizer", "Archangel's Staff", "Banshee's Veil", "Blackfire Torch", "Bloodletter's Curse", "Cosmic Drive", "Crown of the Shattered Queen", "Cruelty", "Cryptbloom", "Demon King's Crown", "Dusk and Dawn", "Flesheater", "Hextech Gunblade", "Hextech Rocketbelt", "Horizon Focus", "Liandry's Torment", "Lich Bane", "Luden's Echo", "Malignance", "Mejai's Soulstealer", "Morellonomicon", "Nashor's Tooth", "Rabadon's Deathcap", "Riftmaker", "Rod of Ages", "Rylai's Crystal Scepter", "Shadowflame", "Stormsurge", "Sword of the Divine", "Void Staff", "Zhonya's Hourglass"],
    "Tank items": ["Abyssal Mask", "Cloak of Starry Night", "Dead Man's Plate", "Force of Nature", "Frozen Heart", "Gargoyle Stoneplate", "Heartsteel", "Hollow Radiance", "Jak'Sho, The Protean", "Kaenic Rookern", "Protoplasm Harness", "Randuin's Omen", "Shield of Molten Stone", "Spirit Visage", "Sunfire Aegis", "Thornmail", "Unending Despair", "Warmog's Armor", "Winter's Approach"],
    "Support items": ["Ardent Censer", "Atma's Reckoning", "Bandlepipes", "Bloodsong", "Celestial Opposition", "Dawncore", "Dream Maker", "Echoes of Helia", "Imperial Mandate", "Knight's Vow", "Locket of the Iron Solari", "Mikael's Blessing", "Moonstone Renewer", "Redemption", "Shurelya's Battlesong", "Solstice Sleigh", "Staff of Flowing Water", "Sword of Blossoming Dawn", "Veigar's Talisman of Ascension", "World Atlas", "Zaz'Zak's Realmspike", "Zeke's Convergence"],
  },
  "Spells & Runes": {
    "Summoner spells": ["Barrier", "Clarity", "Cleanse", "Exhaust", "Flash", "Ghost", "Heal", "Ignite", "Mark (Snowball)", "Smite", "Teleport"],
    "Keystone runes": ["Aftershock", "Arcane Comet", "Conqueror", "Dark Harvest", "Deathfire Touch", "Electrocute", "First Strike", "Fleet Footwork", "Glacial Augment", "Grasp of the Undying", "Guardian", "Hail of Blades", "Lethal Tempo", "Press the Attack", "Stormraider's Surge", "Summon Aery", "Unsealed Spellbook"],
    "Rune paths & minor runes": ["Domination", "Inspiration", "Precision", "Resolve", "Sorcery", "Absolute Focus", "Absorb Life", "Approach Velocity", "Axiom Arcanist", "Biscuit Delivery", "Bone Plating", "Cash Back", "Celerity", "Cheap Shot", "Conditioning", "Cosmic Insight", "Coup de Grace", "Cut Down", "Deep Ward", "Demolish", "Font of Life", "Gathering Storm", "Grisly Mementos", "Hextech Flashtraption", "Jack Of All Trades", "Last Stand", "Legend: Alacrity", "Legend: Bloodline", "Legend: Haste", "Magical Footwear", "Manaflow Band", "Nimbus Cloak", "Overgrowth", "Presence of Mind", "Relentless Hunter", "Revitalize", "Scorch", "Second Wind", "Shield Bash", "Sixth Sense", "Sudden Impact", "Taste of Blood", "Time Warp Tonic", "Transcendence", "Treasure Hunter", "Triple Tonic", "Triumph", "Ultimate Hunter", "Unflinching", "Waterwalking"],
  },
  "Monsters & Objectives": {
    "Epic monsters": ["Baron Nashor", "Elder Dragon", "Rift Herald", "Voidgrubs", "Atakhan", "Infernal Drake", "Ocean Drake", "Mountain Drake", "Cloud Drake", "Hextech Drake", "Chemtech Drake"],
    "Jungle camps & plants": ["Scuttle Crab", "Red Buff", "Blue Buff", "Raptors", "Krugs", "Gromp", "Wolves", "Blast Cone", "Scryer's Bloom", "Honeyfruit"],
    "Structures & minions": ["Outer Turret", "Inner Turret", "Inhibitor Turret", "Nexus Turret", "Inhibitor", "Nexus", "Melee Minion", "Caster Minion", "Cannon Minion", "Super Minion"],
  },
  "Map & Modes": {
    "Places on the Rift": ["Fountain", "River", "Brush", "Mid Lane", "Top Lane", "Bot Lane", "Baron Pit", "Dragon Pit", "Jungle", "Base", "Tribush", "Pixel Brush", "Fog of War"],
    "Maps & game modes": ["Summoner's Rift", "Howling Abyss", "ARAM", "Arena", "Swiftplay", "URF", "ARURF", "One for All", "Nexus Blitz", "Ultimate Spellbook", "Doom Bots", "Clash", "Co-op vs. AI", "Practice Tool", "Ranked Flex", "Twisted Treeline", "Dominion", "Brawl"],
  },
  "Game Terms": {
    "Fights & plays": ["Pentakill", "Quadra Kill", "Triple Kill", "Double Kill", "First Blood", "Ace", "Shutdown Gold", "Dive", "Kite", "Gank", "Teamfight", "Engage", "Disengage", "Peel", "Flank", "Poke", "Burst", "Zoning", "Outplay", "Bait", "Pick", "Smite Steal", "Baron Steal", "Flash Juke", "Animation Cancel", "Skill Shot", "Stutter Step"],
    "Laning & macro": ["Backdoor", "Recall", "Freeze", "Proxy Farm", "Turret Plating", "Dragon Soul", "Minion Wave", "Last Hit", "Split Push", "Roam", "Wave Clear", "Cheese", "Slow Push", "Fast Push", "Crash Wave", "Lane Swap", "Counter Jungle", "Invade", "Ward Hop", "Vision Control", "Power Spike", "Level 6", "Leash", "Full Clear", "Siege", "Side Lane", "Bounty", "Tempo", "Lane Priority"],
    "Stats & effects": ["Attack Damage", "Ability Power", "Armor", "Magic Resist", "Lethality", "Armor Penetration", "Magic Penetration", "Ability Haste", "Attack Speed", "Critical Strike", "Life Steal", "Omnivamp", "Movement Speed", "Tenacity", "Crowd Control", "Grievous Wounds", "True Damage", "Shield", "Stun", "Knock-up", "Root", "Silence", "Slow", "Taunt", "Charm", "Fear", "Stasis", "Untargetable", "Stealth", "Mana", "Energy", "Passive", "Ultimate", "Auto Attack", "Cooldown", "Dash", "Blink", "On-hit"],
    "Ranked & player life": ["Solo Queue", "LP", "Challenger", "Grandmaster", "Master", "Diamond", "Emerald", "Platinum", "Gold", "Silver", "Bronze", "Iron IV", "Promos", "Duo Queue", "Dodge", "Ban Phase", "Champ Select", "Counter Pick", "Autofill", "Surrender Vote", "Inting", "Tilt", "Feeding", "Smurf", "Elo Hell", "Hardstuck", "One-trick", "Main", "Carry", "Jungle Diff", "MMR", "Honor", "Report", "Remake", "AFK", "Ping", "Mute All", "GG", "Placement Games", "Season Reset"],
  },
  "Regions & Factions": {
    "Nations & cities": ["Demacia", "Noxus", "Ionia", "Piltover", "Zaun", "Bilgewater", "Bandle City", "Immortal Bastion"],
    "Wild & mystic lands": ["Freljord", "Shurima", "Targon", "Shadow Isles", "Ixtal", "The Void", "Blessed Isles", "Icathia", "Kumungu", "Serpent Isles"],
    "Factions & orders": ["Black Rose", "Kinkou Order", "Order of Shadow", "Solari", "Lunari", "Mageseekers", "Frostguard", "Avarosa", "Winter's Claw", "Watchers", "Ascended", "Darkin", "Trifarix", "Chem-Barons", "Enforcers", "Firelights"],
  },
  "Lore & Esports": {
    "Lore & magic": ["Runeterra", "Hextech", "Shimmer", "Black Mist", "Poros", "Undercity", "Petricite", "Ruination", "Harrowing", "Spirit Realm", "Aspects", "Hextech Crystal", "Chemtech"],
    "Esports": ["Worlds", "MSI", "First Stand", "Faker", "T1", "G2 Esports", "Fnatic", "Gen.G", "JD Gaming", "Cloud9", "Team Liquid", "LEC", "LCK", "LPL", "LCS", "Summoner's Cup", "Rift Rivals", "All-Stars", "Worlds Anthem", "Uzi", "Caps"],
    "Shows, games & skins": ["Arcane", "Ruined King", "Star Guardian", "Spirit Blossom", "K/DA", "Coven", "PROJECT", "Pulsefire", "Blood Moon", "High Noon", "Pool Party", "Battle Academia", "Arcade", "Odyssey", "Elderwood", "Prestige Edition", "Teamfight Tactics", "Legends of Runeterra", "2XKO", "Song of Nunu", "Hextech Mayhem"],
  },
};

/**
 * Deadlock words. Category names must not collide with League ones.
 * Heroes (by hero type) and shop items come from the deadlock-api.com assets API.
 */
export const DEADLOCK_TREE: Record<string, Record<string, string[]>> = {
  "Heroes": {
    "Brawlers": ["Abrams", "Bebop", "Billy", "Mo & Krill", "Rat King", "Shiv", "Silver", "Victor", "Viscous", "Warden"],
    "Mystics": ["Celeste", "Graves", "Grey Talon", "Infernus", "Lady Geist", "McGinnis", "Mina", "Seven", "Sinclair", "Solomon", "The Doorman"],
    "Marksmen": ["Deadman Danny", "Holliday", "Paradox", "Venator", "Vindicta", "Wraith"],
    "Assassins": ["Apollo", "Calico", "Drifter", "Haze", "Lash", "Mirage", "Pocket", "Vyper", "Yamato"],
    "Healers": ["Dynamo", "Ivy", "Kelvin", "Nurse Harrow", "Paige", "Rem"],
  },
  "Shop Items": {
    "Weapon items": ["Active Reload", "Alchemical Fire", "Armor Piercer", "Ballistic Enchantment", "Berserker", "Blood Tribute", "Burst Fire", "Capacitor", "Close Quarters", "Crippling Headshot", "Crushing Fists", "Cultist Sacrifice", "Escalating Resilience", "Express Shot", "Extended Magazine", "Fleetfoot", "Frenzy", "Glass Cannon", "Haunting Shot", "Headhunter", "Headshot Booster", "Heroic Aura", "High-Velocity Rounds", "Hollow Point", "Hunter's Aura", "Infinite Rounds", "Intensifying Magazine", "Kinetic Dash", "Long Range", "Lucky Shot", "Melee Charge", "Monster Rounds", "Mystic Shot", "Opening Rounds", "Point Blank", "Rapid Rounds", "Recharging Rush", "Restorative Shot", "Ricochet", "Runed Gauntlets", "Shadow Weave", "Sharpshooter", "Silencer", "Slowing Bullets", "Spellslinger", "Spirit Rend", "Spirit Shredder", "Spiritual Overflow", "Split Shot", "Stalker", "Swift Striker", "Tesla Bullets", "Titanic Magazine", "Toxic Bullets", "Weakening Headshot", "Weighted Shots"],
    "Vitality items": ["Battle Vest", "Bullet Lifesteal", "Bullet Resilience", "Celestial Blessing", "Cheat Death", "Cloak of Opportunity", "Colossus", "Counterspell", "Debuff Reducer", "Dispel Magic", "Divine Barrier", "Diviner's Kevlar", "Electric Slippers", "Enchanter's Emblem", "Enduring Speed", "Eternal Gift", "Extra Health", "Extra Regen", "Extra Stamina", "Fortitude", "Fury Trance", "Grit", "Guardian Ward", "Healbane", "Healing Booster", "Healing Nova", "Healing Rite", "Healing Tempo", "Indomitable", "Infuser", "Inhibitor", "Juggernaut", "Leech", "Lifestrike", "Majestic Leap", "Melee Lifesteal", "Metal Skin", "Nullification Burst", "Phantom Strike", "Plated Armor", "Reactive Barrier", "Rebuttal", "Rescue Beam", "Restorative Locket", "Return Fire", "Seraphim Wings", "Shadow Strike", "Siphon Bullets", "Spellbreaker", "Spirit Lifesteal", "Spirit Resilience", "Spirit Shielding", "Sprint Boots", "Stamina Mastery", "Trophy Collector", "Unstoppable", "Vampiric Burst", "Veil Walker", "Warp Stone", "Weapon Shielding", "Witchmail"],
    "Spirit items": ["Arcane Surge", "Arctic Blast", "Boundless Spirit", "Bullet Resist Shredder", "Cold Front", "Compress Cooldown", "Cursed Relic", "Decay", "Disarming Hex", "Duration Extender", "Echo Shard", "Escalating Exposure", "Ethereal Shift", "Extra Charge", "Extra Spirit", "Focus Lens", "Frostbite Charm", "Golden Goose Egg", "Greater Expansion", "Improved Spirit", "Knockdown", "Lightning Scroll", "Magic Carpet", "Mercurial Magnum", "Mystic Burst", "Mystic Conduit", "Mystic Expansion", "Mystic Regeneration", "Mystic Reverb", "Mystic Slow", "Mystic Vulnerability", "Mystical Piano", "Omnicharge Signet", "Prism Blast", "Quicksilver Reload", "Radiant Regeneration", "Rapid Recharge", "Refresher", "Rusted Barrel", "Scourge", "Shrink Ray", "Silence Wave", "Slowing Hex", "Spirit Burn", "Spirit Sap", "Spirit Snatch", "Spirit Strike", "Superior Cooldown", "Superior Duration", "Suppressor", "Surge of Power", "Tankbuster", "Torment Pulse", "Transcendent Cooldown", "Unstable Concoction", "Vortex Web"],
  },
  "World & Objectives": {
    "Objectives & bosses": ["Guardian", "Walker", "Base Guardian", "Shrine", "Patron", "Weakened Patron", "Mid Boss", "Rejuvenator", "Soul Urn", "Sinner's Sacrifice", "Vault"],
    "Map & creatures": ["Troopers", "Medic Trooper", "Denizens", "Zipline", "Lane", "Jungle Camp", "Breakable Crate", "Golden Statue", "Shop", "Curiosity Shop", "Teleporter", "Base", "Bridge", "Powerup"],
    "Factions & lore": ["Amber Hand", "Sapphire Flame", "Hidden King", "Archmother", "The Cursed Apple", "The Oracle", "Rituals", "Occult"],
  },
  "Mechanics & Slang": {
    "Movement & combat": ["Parry", "Dash Jump", "Wall Jump", "Slide", "Heavy Melee", "Light Melee", "Headshot", "Stamina", "Zipline Boost", "Reload", "Ultimate", "Ability Upgrade", "Ability Charges", "Melee Spam", "Bunny Hop", "Air Dash", "Team Fight", "Gank", "Dive", "Kite", "Peel", "Burst", "Poke", "Ambush", "Wave Clear"],
    "Economy & macro": ["Souls", "Deny", "Last Hit", "Soul Orb", "Flex Slot", "Ability Points", "Push", "Rotate", "Lane Swap", "Rejuv Steal", "Comeback Bounty", "Secure", "Laning Phase", "Split Push", "Urn Delivery", "Item Build", "Sell Item", "Power Spike", "Snowball", "Throw", "Backdoor", "Base Race", "Farm", "Jungle Farm"],
    "Stats & effects": ["Weapon Damage", "Spirit Damage", "Spirit Power", "Fire Rate", "Ammo", "Bullet Velocity", "Bullet Resist", "Spirit Resist", "Max Health", "Health Regen", "Move Speed", "Sprint Speed", "Cooldown", "Lifesteal", "Stun", "Silence", "Slow", "Disarm", "Sleep", "Immobilize", "Knockup", "Debuff", "Barrier", "Heal", "Invisibility", "Ability Range", "Crit"],
  },
};

export type Game = "lol" | "deadlock";
export const GAMES: Record<Game, { label: string; tree: Record<string, Record<string, string[]>> }> = {
  lol: { label: "League of Legends", tree: TREE },
  deadlock: { label: "Deadlock", tree: DEADLOCK_TREE },
};
export const isGame = (g: unknown): g is Game => g === "lol" || g === "deadlock";
export const poolNames = (g: Game) => Object.keys(GAMES[g].tree);

const ALL: Record<string, Record<string, string[]>> = { ...TREE, ...DEADLOCK_TREE };

export const POOLS: Record<string, string[]> = Object.fromEntries(
  Object.entries(ALL).map(([cat, subs]) => [cat, Object.values(subs).flat()]),
);

export const subOf = (cat: string, word: string) =>
  Object.entries(ALL[cat] ?? {}).find(([, ws]) => ws.includes(word))?.[0];

/** League pool names (the default game). */
export const POOL_NAMES = poolNames("lol");

export function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Choose a category and word from the enabled pools, avoiding recently used words. */
export function drawWord(cats: string[], recent: string[] = [], game: Game = "lol"): { cat: string; word: string } {
  const valid = cats.filter((c) => GAMES[game].tree[c]);
  const use = valid.length ? valid : poolNames(game);
  const all = use.flatMap((cat) => POOLS[cat].map((word) => ({ cat, word })));
  const fresh = all.filter((w) => !recent.includes(w.word));
  return pick(fresh.length ? fresh : all);
}

/** The word plus decoys from the same category, shuffled — what an accused imposter chooses from. */
export function guessOptions(cat: string, word: string, n = 8): string[] {
  const decoys = shuffle(POOLS[cat].filter((w) => w !== word)).slice(0, n - 1);
  return shuffle([word, ...decoys]);
}

/**
 * What an imposter is told. Speaking first is a disadvantage (no clues to copy),
 * so the first speaker's hint is one notch more precise:
 *   hints off: nothing   -> first speaker: category
 *   hints on:  category  -> first speaker: category + subcategory (e.g. Champions › Support)
 */
export function imposterIntel(cat: string, word: string, hint: boolean, first: boolean) {
  const tier = (hint ? 1 : 0) + (first ? 1 : 0);
  const sub = subOf(cat, word);
  const sharp =
    tier >= 2 && !!sub && Object.keys(ALL[cat]).length > 1 && ALL[cat][sub].length >= MIN_SUB_SIZE;
  return {
    /** True when speaking first actually improved the hint. */
    bonus: first && (hint ? sharp : true),
    cat: tier >= 1 ? cat : undefined,
    // Tiny subcategories (e.g. Boots: 3 words) would nearly give the word away, so skip them.
    // A category with a single subcategory (Deadlock heroes) has nothing sharper to give.
    sub: sharp ? sub : undefined,
  };
}

/** Subcategories smaller than this are never used as a hint. */
export const MIN_SUB_SIZE = 5;
