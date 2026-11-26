/** Category -> subcategory -> words. Subcategories power the first-speaker bonus hint. */
export const TREE: Record<string, Record<string, string[]>> = {
  "Champions": {
    "Top lane": ["Darius", "Garen", "Malphite", "Sett", "Riven", "Fiora", "Jax", "Nasus", "Renekton", "Aatrox", "Mordekaiser", "Illaoi", "Gwen", "Ornn", "Singed", "K'Sante", "Ambessa", "Cho'Gath", "Sion", "Tryndamere", "Kled", "Urgot", "Teemo"],
    "Jungle": ["Lee Sin", "Master Yi", "Kha'Zix", "Rengar", "Evelynn", "Shaco", "Amumu", "Viego", "Kindred", "Gragas", "Bel'Veth", "Briar", "Ivern", "Warwick", "Vi", "Rammus", "Ekko"],
    "Mid lane": ["Ahri", "Yasuo", "Yone", "Zed", "Katarina", "Annie", "Akali", "Veigar", "Kassadin", "Twisted Fate", "Ryze", "LeBlanc", "Sylas", "Zoe", "Viktor", "Hwei", "Aurora", "Vex", "Mel", "Ziggs", "Xerath", "Heimerdinger"],
    "Bot lane (marksman)": ["Jinx", "Ezreal", "Vayne", "Ashe", "Draven", "Kai'Sa", "Aphelios", "Jhin", "Caitlyn", "Miss Fortune", "Samira", "Lucian", "Smolder", "Zeri", "Kog'Maw"],
    "Support": ["Thresh", "Blitzcrank", "Leona", "Nautilus", "Pyke", "Morgana", "Soraka", "Janna", "Lulu", "Nami", "Yuumi", "Bard", "Vel'Koz", "Lux", "Rell", "Sona", "Zilean"],
  },
  "Items": {
    "Starters, wards & potions": ["Doran's Blade", "Doran's Ring", "Health Potion", "Control Ward", "Stealth Ward", "Oracle Lens"],
    "Boots": ["Mercury's Treads", "Berserker's Greaves", "Boots of Swiftness"],
    "Fighter & marksman items": ["Infinity Edge", "Blade of the Ruined King", "Bloodthirster", "Lord Dominik's Regards", "Statikk Shiv", "Rapid Firecannon", "Kraken Slayer", "Mercurial Scimitar", "Edge of Night", "Black Cleaver", "Trinity Force", "Spear of Shojin", "Sterak's Gage", "Guardian Angel"],
    "Mage items": ["Rabadon's Deathcap", "Zhonya's Hourglass", "Lich Bane", "Mejai's Soulstealer", "Void Staff", "Rylai's Crystal Scepter", "Morellonomicon", "Hextech Rocketbelt", "Luden's Companion", "Banshee's Veil"],
    "Tank items": ["Thornmail", "Warmog's Armor", "Sunfire Aegis", "Randuin's Omen", "Frozen Heart", "Heartsteel"],
  },
  "Spells & Runes": {
    "Summoner spells": ["Flash", "Ignite", "Teleport", "Smite", "Exhaust", "Ghost", "Barrier", "Heal", "Cleanse", "Clarity", "Mark (Snowball)"],
    "Keystone runes": ["Press the Attack", "Lethal Tempo", "Fleet Footwork", "Conqueror", "Electrocute", "Dark Harvest", "Hail of Blades", "Summon Aery", "Arcane Comet", "Phase Rush", "Grasp of the Undying", "Aftershock", "Guardian", "Glacial Augment", "Unsealed Spellbook", "First Strike"],
    "Rune paths & minor runes": ["Precision", "Domination", "Sorcery", "Resolve", "Inspiration", "Triumph", "Coup de Grace", "Cut Down", "Last Stand", "Presence of Mind", "Taste of Blood", "Sudden Impact", "Treasure Hunter", "Nimbus Cloak", "Manaflow Band", "Transcendence", "Gathering Storm", "Scorch", "Demolish", "Second Wind", "Bone Plating", "Overgrowth", "Unflinching", "Magical Footwear", "Cash Back", "Biscuit Delivery", "Cosmic Insight", "Hextech Flashtraption"],
  },
  "Monsters & Objectives": {
    "Epic monsters": ["Baron Nashor", "Elder Dragon", "Rift Herald", "Voidgrubs", "Atakhan", "Infernal Drake", "Ocean Drake", "Mountain Drake", "Cloud Drake"],
    "Jungle camps": ["Scuttle Crab", "Red Buff", "Blue Buff", "Raptors", "Krugs", "Gromp", "Wolves"],
    "Structures & minions": ["Inhibitor", "Nexus", "Turret", "Cannon Minion", "Super Minion"],
  },
  "Map & Modes": {
    "Places on the Rift": ["Fountain", "River", "Brush", "Mid Lane", "Top Lane", "Bot Lane", "Baron Pit", "Dragon Pit", "Jungle", "Base", "Tribush"],
    "Maps & game modes": ["Summoner's Rift", "Howling Abyss", "ARAM", "Arena", "Swiftplay", "URF", "One for All", "Nexus Blitz"],
  },
  "Game Terms": {
    "Fights & plays": ["Pentakill", "First Blood", "Ace", "Dive", "Kite", "Gank", "Shutdown Gold", "Animation Cancel", "Skill Shot", "Smite Steal"],
    "Laning & macro": ["Backdoor", "Recall", "Freeze", "Proxy Farm", "Turret Plating", "Dragon Soul", "Minion Wave", "Last Hit", "Split Push", "Roam", "Wave Clear", "Cheese"],
    "Ranked & queue life": ["Ranked", "LP", "Challenger", "Iron IV", "Promos", "Duo Queue", "Dodge", "Ban Phase", "Counter Pick", "Surrender Vote", "Inting", "Tilt"],
  },
  "Regions": {
    "Nations & cities": ["Demacia", "Noxus", "Ionia", "Piltover", "Zaun", "Bilgewater", "Bandle City"],
    "Wild & mystic lands": ["Freljord", "Shurima", "Targon", "Shadow Isles", "Ixtal", "The Void"],
  },
  "Lore & Esports": {
    "Lore & magic": ["Runeterra", "Hextech", "Shimmer", "Darkin", "Black Mist", "Poros", "Zaun Undercity"],
    "Esports": ["Worlds", "MSI", "Faker", "T1", "LEC", "LCK", "Summoner's Cup", "Rift Rivals"],
    "Shows, games & skins": ["Arcane", "Ruined King", "Star Guardian", "Spirit Blossom", "K/DA"],
  },
};

/** Deadlock pools. Category names must not collide with League ones. */
export const DEADLOCK_TREE: Record<string, Record<string, string[]>> = {
  "Heroes": {
    "Heroes": ["Abrams", "Bebop", "Calico", "Dynamo", "Grey Talon", "Haze", "Holliday", "Infernus", "Ivy", "Kelvin", "Lady Geist", "Lash", "McGinnis", "Mirage", "Mo & Krill", "Paradox", "Pocket", "Seven", "Shiv", "Sinclair", "Vindicta", "Viscous", "Vyper", "Warden", "Wraith", "Yamato"],
  },
  "Shop Items": {
    "Weapon items": ["Basic Magazine", "Close Quarters", "Headshot Booster", "High-Velocity Mag", "Monster Rounds", "Rapid Rounds", "Restorative Shot", "Active Reload", "Kinetic Dash", "Long Range", "Melee Charge", "Mystic Shot", "Slowing Bullets", "Swift Striker", "Berserker", "Burst Fire", "Headhunter", "Hunter's Aura", "Intensifying Magazine", "Sharpshooter", "Tesla Bullets", "Titanic Magazine", "Toxic Bullets", "Alchemical Fire", "Crippling Headshot", "Glass Cannon", "Lucky Shot", "Ricochet", "Silencer", "Vampiric Burst"],
    "Vitality items": ["Extra Health", "Extra Regen", "Extra Stamina", "Healing Rite", "Melee Lifesteal", "Sprint Boots", "Bullet Lifesteal", "Combat Barrier", "Debuff Reducer", "Enduring Speed", "Healbane", "Healing Booster", "Reactive Barrier", "Spirit Lifesteal", "Bullet Armor", "Spirit Armor", "Divine Barrier", "Fortitude", "Lifestrike", "Majestic Leap", "Metal Skin", "Rescue Beam", "Veil Walker", "Colossus", "Diviner's Kevlar", "Inhibitor", "Leech", "Phantom Strike", "Siphon Bullets", "Unstoppable"],
    "Spirit items": ["Extra Charge", "Extra Spirit", "Mystic Burst", "Mystic Reach", "Spirit Strike", "Infuser", "Cold Front", "Decay", "Duration Extender", "Improved Cooldown", "Mystic Vulnerability", "Quicksilver Reload", "Slowing Hex", "Suppressor", "Withering Whip", "Ethereal Shift", "Improved Burst", "Improved Spirit", "Knockdown", "Rapid Recharge", "Silence Glyph", "Superior Cooldown", "Superior Duration", "Torment Pulse", "Boundless Spirit", "Curse", "Echo Shard", "Magic Carpet", "Mystic Reverb", "Refresher"],
  },
  "Map & Objectives": {
    "Objectives & bosses": ["Guardian", "Walker", "Base Guardian", "Shrine", "Patron", "Weakened Patron", "Mid Boss", "Rejuvenator", "Soul Urn", "Sinner's Sacrifice"],
    "Map & creatures": ["Troopers", "Denizens", "Zipline", "Lane", "Jungle Camp", "Breakable Crate", "Golden Statue", "Shop", "Curiosity Shop", "Teleporter", "Base", "Bridge"],
  },
  "Mechanics & Slang": {
    "Movement & combat": ["Parry", "Dash Jump", "Wall Jump", "Slide", "Heavy Melee", "Light Melee", "Headshot", "Stamina", "Bullet Velocity", "Ultimate", "Stun", "Silence", "Ability Upgrade"],
    "Economy & macro": ["Souls", "Deny", "Last Hit", "Soul Orb", "Flex Slot", "Ability Points", "Spirit Power", "Push", "Rotate", "Lane Swap", "Team Fight", "Rejuv Steal", "Comeback Bounty"],
  },
  "Factions & Lore": {
    "Factions & lore": ["Amber Hand", "Sapphire Flame", "Hidden King", "Archmother", "The Cursed Apple", "The Oracle", "Rituals", "Occult"],
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
