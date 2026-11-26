/** Category -> subcategory -> words. Subcategories power the first-speaker bonus hint. */
export const TREE: Record<string, Record<string, string[]>> = {
  "Champions": {
    "Top lane": [
      "Darius",
      "Garen",
      "Malphite",
      "Sett",
      "Riven",
      "Fiora",
      "Jax",
      "Nasus",
      "Renekton",
      "Aatrox",
      "Mordekaiser",
      "Illaoi",
      "Gwen",
      "Ornn",
      "Singed",
      "K'Sante",
      "Ambessa",
      "Cho'Gath",
      "Sion",
      "Tryndamere",
      "Kled",
      "Urgot",
      "Teemo"
    ],
    "Jungle": [
      "Lee Sin",
      "Master Yi",
      "Kha'Zix",
      "Rengar",
      "Evelynn",
      "Shaco",
      "Amumu",
      "Viego",
      "Kindred",
      "Gragas",
      "Bel'Veth",
      "Briar",
      "Ivern",
      "Warwick",
      "Vi",
      "Rammus",
      "Ekko"
    ],
    "Mid lane": [
      "Ahri",
      "Yasuo",
      "Yone",
      "Zed",
      "Katarina",
      "Annie",
      "Akali",
      "Veigar",
      "Kassadin",
      "Twisted Fate",
      "Ryze",
      "LeBlanc",
      "Sylas",
      "Zoe",
      "Viktor",
      "Hwei",
      "Aurora",
      "Vex",
      "Mel",
      "Ziggs",
      "Xerath",
      "Heimerdinger"
    ],
    "Bot lane (marksman)": [
      "Jinx",
      "Ezreal",
      "Vayne",
      "Ashe",
      "Draven",
      "Kai'Sa",
      "Aphelios",
      "Jhin",
      "Caitlyn",
      "Miss Fortune",
      "Samira",
      "Lucian",
      "Smolder",
      "Zeri",
      "Kog'Maw"
    ],
    "Support": [
      "Thresh",
      "Blitzcrank",
      "Leona",
      "Nautilus",
      "Pyke",
      "Morgana",
      "Soraka",
      "Janna",
      "Lulu",
      "Nami",
      "Yuumi",
      "Bard",
      "Vel'Koz",
      "Lux",
      "Rell",
      "Sona",
      "Zilean"
    ]
  },
  "Items": {
    "Starters, wards & potions": [
      "Doran's Blade",
      "Doran's Ring",
      "Health Potion",
      "Control Ward",
      "Stealth Ward",
      "Oracle Lens"
    ],
    "Boots": [
      "Mercury's Treads",
      "Berserker's Greaves",
      "Boots of Swiftness"
    ],
    "Fighter & marksman items": [
      "Infinity Edge",
      "Blade of the Ruined King",
      "Bloodthirster",
      "Lord Dominik's Regards",
      "Statikk Shiv",
      "Rapid Firecannon",
      "Kraken Slayer",
      "Mercurial Scimitar",
      "Edge of Night",
      "Black Cleaver",
      "Trinity Force",
      "Spear of Shojin",
      "Sterak's Gage",
      "Guardian Angel"
    ],
    "Mage items": [
      "Rabadon's Deathcap",
      "Zhonya's Hourglass",
      "Lich Bane",
      "Mejai's Soulstealer",
      "Void Staff",
      "Rylai's Crystal Scepter",
      "Morellonomicon",
      "Hextech Rocketbelt",
      "Luden's Companion",
      "Banshee's Veil"
    ],
    "Tank items": [
      "Thornmail",
      "Warmog's Armor",
      "Sunfire Aegis",
      "Randuin's Omen",
      "Frozen Heart",
      "Heartsteel"
    ]
  },
  "Summoner Spells": {
    "Offensive spells": [
      "Ignite",
      "Smite",
      "Exhaust"
    ],
    "Movement spells": [
      "Flash",
      "Ghost",
      "Teleport",
      "Mark (Snowball)"
    ],
    "Defensive & sustain spells": [
      "Barrier",
      "Heal",
      "Cleanse",
      "Clarity"
    ]
  },
  "Monsters & Objectives": {
    "Epic monsters": [
      "Baron Nashor",
      "Elder Dragon",
      "Rift Herald",
      "Voidgrubs",
      "Atakhan",
      "Infernal Drake",
      "Ocean Drake",
      "Mountain Drake",
      "Cloud Drake"
    ],
    "Jungle camps": [
      "Scuttle Crab",
      "Red Buff",
      "Blue Buff",
      "Raptors",
      "Krugs",
      "Gromp",
      "Wolves"
    ],
    "Structures & minions": [
      "Inhibitor",
      "Nexus",
      "Turret",
      "Cannon Minion",
      "Super Minion"
    ]
  },
  "Map & Modes": {
    "Places on the Rift": [
      "Fountain",
      "River",
      "Brush",
      "Mid Lane",
      "Top Lane",
      "Bot Lane",
      "Baron Pit",
      "Dragon Pit",
      "Jungle",
      "Base",
      "Tribush"
    ],
    "Maps & game modes": [
      "Summoner's Rift",
      "Howling Abyss",
      "ARAM",
      "Arena",
      "Swiftplay",
      "URF",
      "One for All",
      "Nexus Blitz"
    ]
  },
  "Game Terms": {
    "Fights & plays": [
      "Pentakill",
      "First Blood",
      "Ace",
      "Dive",
      "Kite",
      "Gank",
      "Shutdown Gold",
      "Animation Cancel",
      "Skill Shot",
      "Smite Steal"
    ],
    "Laning & macro": [
      "Backdoor",
      "Recall",
      "Freeze",
      "Proxy Farm",
      "Turret Plating",
      "Dragon Soul",
      "Minion Wave",
      "Last Hit",
      "Split Push",
      "Roam",
      "Wave Clear",
      "Cheese"
    ],
    "Ranked & queue life": [
      "Ranked",
      "LP",
      "Challenger",
      "Iron IV",
      "Promos",
      "Duo Queue",
      "Dodge",
      "Ban Phase",
      "Counter Pick",
      "Surrender Vote",
      "Inting",
      "Tilt"
    ]
  },
  "Regions": {
    "Nations & cities": [
      "Demacia",
      "Noxus",
      "Ionia",
      "Piltover",
      "Zaun",
      "Bilgewater",
      "Bandle City"
    ],
    "Wild & mystic lands": [
      "Freljord",
      "Shurima",
      "Targon",
      "Shadow Isles",
      "Ixtal",
      "The Void"
    ]
  },
  "Lore & Esports": {
    "Lore & magic": [
      "Runeterra",
      "Hextech",
      "Shimmer",
      "Darkin",
      "Black Mist",
      "Poros",
      "Zaun Undercity"
    ],
    "Esports": [
      "Worlds",
      "MSI",
      "Faker",
      "T1",
      "LEC",
      "LCK",
      "Summoner's Cup",
      "Rift Rivals"
    ],
    "Shows, games & skins": [
      "Arcane",
      "Ruined King",
      "Star Guardian",
      "Spirit Blossom",
      "K/DA"
    ]
  }
};

export const POOLS: Record<string, string[]> = Object.fromEntries(
  Object.entries(TREE).map(([cat, subs]) => [cat, Object.values(subs).flat()]),
);

export const subOf = (cat: string, word: string) =>
  Object.entries(TREE[cat] ?? {}).find(([, ws]) => ws.includes(word))?.[0];

export const POOL_NAMES = Object.keys(POOLS);

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
export function drawWord(cats: string[], recent: string[] = []): { cat: string; word: string } {
  const valid = cats.filter((c) => POOLS[c]);
  const use = valid.length ? valid : POOL_NAMES;
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
  return {
    cat: tier >= 1 ? cat : undefined,
    // Tiny subcategories (e.g. Boots: 3 words) would nearly give the word away, so skip them.
    sub: tier >= 2 && sub && TREE[cat][sub].length >= MIN_SUB_SIZE ? sub : undefined,
  };
}

/** Subcategories smaller than this are never used as a hint. */
export const MIN_SUB_SIZE = 5;
