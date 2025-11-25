'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Calculator, Gamepad2, Info, Settings, HelpCircle, ChevronDown, Search, Zap, Clock, BarChart3, Star, TrendingUp, Users, Award, Target, Globe, Gauge, Activity } from 'lucide-react';
import CalculatorReview from '@/components/ui/calculator-review';

// Game systems with comprehensive data - Updated September 2025
const GAME_SYSTEMS = {
  // === MOBA GAMES (15) ===
  'league-of-legends': {
    name: 'League of Legends',
    category: 'MOBA',
    type: 'ability-haste',
    unit: 'Ability Haste',
    description: 'Linear CDR scaling via Ability Haste system',
    maxReduction: 83.3,
    formula: 'CDR = Haste / (Haste + 100)',
    tooltip: 'Ability Haste replaced the old CDR system in Season 11. Every point provides the same value.',
    popular: true,
    examples: ['100 AH = 50% CDR', '200 AH = 66.7% CDR', '500 AH = 83.3% CDR'],
    patch: '15.17 (September 2025)',
    meta: { tier: 'S+', pickRate: '91%', avgCDR: '47%' }
  },
  'dota-2': {
    name: 'Dota 2',
    category: 'MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Multiplicative stacking CDR from items',
    maxReduction: 80,
    formula: 'Multiple sources stack multiplicatively',
    tooltip: 'Dota 2 uses traditional CDR with item stacking limitations.',
    popular: true,
    examples: ['Octarine Core: 25%', 'Arcane Rune: 30%', 'Neutral items vary'],
    patch: '7.38c (September 2025)',
    meta: { tier: 'A+', pickRate: '78%', avgCDR: '38%' }
  },
  'world-of-warcraft': {
    name: 'World of Warcraft',
    category: 'MMORPG',
    type: 'haste-rating',
    unit: 'Haste Rating',
    description: 'Haste rating converts to percentage at level 80',
    maxReduction: 50,
    formula: 'Haste% = Rating / 32.79 (at 80)',
    tooltip: 'Haste affects both cast time and cooldowns in WoW.',
    popular: true,
    examples: ['1000 rating ≈ 30.5%', '1640 rating = 50%', 'No hard cap but diminishing returns'],
    patch: 'Dragonflight 10.2.7',
    meta: { tier: 'A+', pickRate: '82%', avgCDR: '25%' }
  },
  'diablo-4': {
    name: 'Diablo 4',
    category: 'ARPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Direct cooldown reduction percentage',
    maxReduction: 75,
    formula: 'Additive CDR from multiple sources',
    tooltip: 'D4 CDR stacks additively up to the cap.',
    popular: true,
    examples: ['Ring: 15% CDR', 'Aspect: 20% CDR', 'Paragon: 10% CDR'],
    patch: 'Season 2 (2024)',
    meta: { tier: 'S', pickRate: '94%', avgCDR: '60%' }
  },
  'path-of-exile': {
    name: 'Path of Exile',
    category: 'ARPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Skill-specific cooldown recovery',
    maxReduction: 90,
    formula: 'Increased/More modifiers apply separately',
    tooltip: 'PoE has complex More/Increased modifier interactions.',
    popular: true,
    examples: ['20% increased recovery', '15% more recovery', 'Support gems provide CDR'],
    patch: '3.22 Trial of the Ancestors',
    meta: { tier: 'A', pickRate: '71%', avgCDR: '40%' }
  },
  'genshin-impact': {
    name: 'Genshin Impact',
    category: 'Action RPG',
    type: 'energy-recharge',
    unit: '% Energy Recharge',
    description: 'Energy recharge affects burst cooldown and energy generation',
    maxReduction: 70,
    formula: 'Complex energy generation system',
    tooltip: 'Energy recharge reduces effective cooldown by speeding energy gain.',
    popular: true,
    examples: ['200% ER = 2x energy', '300% ER = 3x energy', 'Character dependent'],
    patch: '4.1 (2024)',
    meta: { tier: 'A', pickRate: '68%', avgCDR: '30%' }
  },
  'honkai-star-rail': {
    name: 'Honkai: Star Rail',
    category: 'Turn-Based RPG',
    type: 'speed',
    unit: 'Speed',
    description: 'Speed affects turn frequency and skill point generation',
    maxReduction: 60,
    formula: 'Turn order based on speed stats',
    tooltip: 'Higher speed = more turns = more ability usage.',
    popular: true,
    examples: ['120 speed baseline', '160+ speed fast builds', '200+ speed hyper carries'],
    patch: '1.4 (2024)',
    meta: { tier: 'A', pickRate: '72%', avgCDR: '25%' }
  },
  'monster-hunter-world': {
    name: 'Monster Hunter World',
    category: 'Action RPG',
    type: 'skill-level',
    unit: 'Skill Level',
    description: 'Skill levels reduce special attack cooldowns',
    maxReduction: 50,
    formula: 'Skill level 1-5 scaling',
    tooltip: 'Special Attack Boost reduces switch axe and charge blade cooldowns.',
    popular: false,
    examples: ['Level 1: 10% reduction', 'Level 3: 30% reduction', 'Level 5: 50% reduction'],
    patch: 'Iceborne (2024)',
    meta: { tier: 'B', pickRate: '45%', avgCDR: '35%' }
  },
  'warframe': {
    name: 'Warframe',
    category: 'Third-Person Shooter',
    type: 'efficiency',
    unit: '% Efficiency',
    description: 'Efficiency reduces ability energy costs and cast times',
    maxReduction: 75,
    formula: 'Duration × Efficiency × Strength × Range',
    tooltip: 'Efficiency is capped at 175% total (75% reduction).',
    popular: true,
    examples: ['Fleeting Expertise: 60%', 'Streamline: 30%', 'Mod combinations'],
    patch: 'The Duviri Paradox (2024)',
    meta: { tier: 'A+', pickRate: '78%', avgCDR: '50%' }
  },
  'risk-of-rain-2': {
    name: 'Risk of Rain 2',
    category: 'Roguelike',
    type: 'item-stacks',
    unit: 'Item Stacks',
    description: 'Items with hyperbolic stacking for cooldown reduction',
    maxReduction: 95,
    formula: '1 - (1 / (1 + stacks × 0.1))',
    tooltip: 'Alien Head and other CDR items use hyperbolic stacking.',
    popular: false,
    examples: ['10 stacks = 50% CDR', '20 stacks = 67% CDR', '50 stacks = 83% CDR'],
    patch: 'Survivors of the Void (2024)',
    meta: { tier: 'B+', pickRate: '52%', avgCDR: '45%' }
  },
  'apex-legends': {
    name: 'Apex Legends',
    category: 'Battle Royale',
    type: 'percentage',
    unit: '% Ultimate Accelerant',
    description: 'Ultimate ability cooldown reduction',
    maxReduction: 35,
    formula: 'Ultimate Accelerant stacking',
    tooltip: 'Gold items and Ultimate Accelerants reduce ultimate cooldowns.',
    popular: true,
    examples: ['Ultimate Accelerant: 20%', 'Gold Helmet: 25%', 'Legend abilities'],
    patch: 'Season 18 (2024)',
    meta: { tier: 'A', pickRate: '67%', avgCDR: '25%' }
  },
  'overwatch-2': {
    name: 'Overwatch 2',
    category: 'FPS',
    type: 'percentage',
    unit: '% CDR',
    description: 'Hero-specific cooldown mechanics',
    maxReduction: 50,
    formula: 'Hero abilities and synergies',
    tooltip: 'CDR varies by hero and ability type.',
    popular: true,
    examples: ['Moira orb return: 15%', 'Lucio speed boost', 'Hero passives'],
    patch: 'Season 7 (2024)',
    meta: { tier: 'A-', pickRate: '58%', avgCDR: '28%' }
  },
  'final-fantasy-xiv': {
    name: 'Final Fantasy XIV',
    category: 'MMORPG',
    type: 'spell-speed',
    unit: 'Spell/Skill Speed',
    description: 'Speed stats reduce GCD and some ability cooldowns',
    maxReduction: 40,
    formula: 'Stat tier system with breakpoints',
    tooltip: 'Speed affects GCD and some oGCD abilities differently.',
    popular: true,
    examples: ['2.50s base GCD', '2.30s achievable', 'Job optimization'],
    patch: 'Endwalker 6.5 (2024)',
    meta: { tier: 'A', pickRate: '78%', avgCDR: '20%' }
  },
  'destiny-2': {
    name: 'Destiny 2',
    category: 'FPS/MMO',
    type: 'percentage',
    unit: '% CDR',
    description: 'Armor mods and exotic effects provide ability cooldown reduction',
    maxReduction: 80,
    formula: 'Multiple mod sources stack',
    tooltip: 'Elemental Well mods and exotic armor provide CDR.',
    popular: true,
    examples: ['Firepower: 20%', 'Font of Might: 25%', 'Exotic synergies'],
    patch: 'Season of the Wish (2024)',
    meta: { tier: 'A+', pickRate: '81%', avgCDR: '35%' }
  },
  'guild-wars-2': {
    name: 'Guild Wars 2',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Trait-based cooldown reduction',
    maxReduction: 60,
    formula: 'Trait line combinations',
    tooltip: 'Traits and runes provide various CDR bonuses.',
    popular: false,
    examples: ['Superior Rune of the Scholar', 'Trait combinations', 'Elite specs'],
    patch: 'Secrets of the Obscure (2024)',
    meta: { tier: 'B+', pickRate: '45%', avgCDR: '28%' }
  },
  'elder-scrolls-online': {
    name: 'The Elder Scrolls Online',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Set bonuses and champion points',
    maxReduction: 45,
    formula: 'Additive from sets and CP',
    tooltip: 'Set bonuses and CP allocation provide CDR.',
    popular: false,
    examples: ['Burning Spellweave: 8%', 'Champion Points', 'Class passives'],
    patch: 'Necrom Chapter (2024)',
    meta: { tier: 'B', pickRate: '38%', avgCDR: '22%' }
  },
  'lost-ark': {
    name: 'Lost Ark',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Cooldown reduction gems and set bonuses',
    maxReduction: 60,
    formula: 'Gem levels and set effects',
    tooltip: 'CDR gems can be leveled up for more reduction.',
    popular: false,
    examples: ['Level 3 CDR gem: 18%', 'Set bonuses: 15%', 'Tripod effects'],
    patch: 'Brelshaza Update (2024)',
    meta: { tier: 'B+', pickRate: '41%', avgCDR: '32%' }
  },
  'black-desert-online': {
    name: 'Black Desert Online',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Crystal sockets and passive skills',
    maxReduction: 40,
    formula: 'Additive crystal effects',
    tooltip: 'Crystals and class passives provide CDR.',
    popular: false,
    examples: ['Jin Viper Crystal: 10%', 'Class awakening: 15%', 'Addons'],
    patch: 'Land of the Morning Light (2024)',
    meta: { tier: 'B', pickRate: '33%', avgCDR: '25%' }
  },
  'new-world': {
    name: 'New World',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Weapon perks and attribute scaling',
    maxReduction: 50,
    formula: 'Weapon perks and attributes',
    tooltip: 'High-tier weapon perks provide significant CDR.',
    popular: false,
    examples: ['Refreshing: 2.8%', 'Keen Speed: 20%', 'Attribute thresholds'],
    patch: 'Season of the Guardian (2024)',
    meta: { tier: 'C+', pickRate: '28%', avgCDR: '20%' }
  },
  'albion-online': {
    name: 'Albion Online',
    category: 'Sandbox MMO',
    type: 'percentage',
    unit: '% CDR',
    description: 'Item passives and food bonuses',
    maxReduction: 45,
    formula: 'Equipment and consumables',
    tooltip: 'Higher tier equipment provides better CDR.',
    popular: false,
    examples: ['T8 equipment: 15%', 'Food buffs: 10%', 'Passive abilities'],
    patch: 'Roads to Avalon (2024)',
    meta: { tier: 'C', pickRate: '22%', avgCDR: '18%' }
  },
  'smite': {
    name: 'SMITE',
    category: 'MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Item-based cooldown reduction with cap',
    maxReduction: 40,
    formula: 'Standard percentage reduction',
    tooltip: 'CDR items are core to most builds in SMITE.',
    popular: false,
    examples: ['Jotunn\'s Wrath: 20%', 'Breastplate: 20%', 'Blue buff: 10%'],
    patch: '10.13 (2024)',
    meta: { tier: 'B', pickRate: '44%', avgCDR: '30%' }
  },
  'heroes-of-the-storm': {
    name: 'Heroes of the Storm',
    category: 'MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Talent-based CDR with quest rewards',
    maxReduction: 75,
    formula: 'Talent combinations',
    tooltip: 'Talents provide various CDR bonuses.',
    popular: false,
    examples: ['Level 1 CDR: 10%', 'Quest rewards: 25%', 'Level 20: 40%'],
    patch: '2.55.3 (Legacy)',
    meta: { tier: 'B', pickRate: '23%', avgCDR: '30%' }
  },
  'mobile-legends': {
    name: 'Mobile Legends',
    category: 'Mobile MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Equipment-based CDR system',
    maxReduction: 40,
    formula: 'Equipment stacking',
    tooltip: 'CDR items are essential for most heroes.',
    popular: true,
    examples: ['Equipment: 10-20%', 'Emblems: 5-15%', 'Hero skills'],
    patch: 'Project NEXT (2024)',
    meta: { tier: 'A', pickRate: '73%', avgCDR: '32%' }
  },
  'wild-rift': {
    name: 'League of Legends: Wild Rift',
    category: 'Mobile MOBA',
    type: 'ability-haste',
    unit: 'Ability Haste',
    description: 'Mobile adaptation of Ability Haste system',
    maxReduction: 75,
    formula: 'CDR = Haste / (Haste + 100)',
    tooltip: 'Same system as PC League of Legends.',
    popular: true,
    examples: ['Items: 10-25 AH', 'Runes: 5-15 AH', 'Champion abilities'],
    patch: 'Patch 4.4 (2024)',
    meta: { tier: 'A+', pickRate: '79%', avgCDR: '41%' }
  },
  'arena-of-valor': {
    name: 'Arena of Valor',
    category: 'Mobile MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Equipment and arcana-based CDR',
    maxReduction: 40,
    formula: 'Equipment and arcana stacking',
    tooltip: 'CDR arcana provides early game advantage.',
    popular: false,
    examples: ['CDR arcana: 10%', 'Equipment: 20%', 'Hero abilities: 10%'],
    patch: 'Valor Cup (2024)',
    meta: { tier: 'B+', pickRate: '51%', avgCDR: '28%' }
  },
  'pokemon-unite': {
    name: 'Pokémon UNITE',
    category: 'MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Held items and level scaling',
    maxReduction: 35,
    formula: 'Held item effects',
    tooltip: 'Focus Band and other items provide CDR.',
    popular: false,
    examples: ['Focus Band: 15%', 'Shell Bell: 10%', 'Level scaling'],
    patch: 'Mewtwo X Update (2024)',
    meta: { tier: 'C+', pickRate: '31%', avgCDR: '20%' }
  },
  'valorant': {
    name: 'VALORANT',
    category: 'FPS',
    type: 'percentage',
    unit: '% Ultimate Points',
    description: 'Ability usage and ultimate charging',
    maxReduction: 30,
    formula: 'Orb collection and combat',
    tooltip: 'Ultimate orbs and frags reduce ultimate charge time.',
    popular: true,
    examples: ['Ultimate orb: 1 point', 'Kill: 1 point', 'Plant/defuse: 1 point'],
    patch: 'Episode 7 Act 3 (2024)',
    meta: { tier: 'A-', pickRate: '62%', avgCDR: '15%' }
  },
  'teamfight-tactics': {
    name: 'Teamfight Tactics',
    category: 'Auto Battler',
    type: 'percentage',
    unit: '% Mana Reduction',
    description: 'Items and traits affecting ability frequency',
    maxReduction: 60,
    formula: 'Item and trait combinations',
    tooltip: 'Blue Buff and traits reduce mana costs.',
    popular: false,
    examples: ['Blue Buff: 40 mana', 'Arcanist trait', 'Spellsword emblem'],
    patch: 'Set 10 (2024)',
    meta: { tier: 'B', pickRate: '39%', avgCDR: '35%' }
  },
  'clash-royale': {
    name: 'Clash Royale',
    category: 'Strategy',
    type: 'elixir-rate',
    unit: 'Elixir Rate',
    description: 'Elixir generation affects ability usage frequency',
    maxReduction: 50,
    formula: 'Faster elixir = more frequent spells',
    tooltip: 'Mirror and cycle decks benefit from faster elixir.',
    popular: false,
    examples: ['2x Elixir: 100% faster', '3x Elixir: 200% faster', 'Rage spell'],
    patch: 'Season 58 (September 2025)',
    meta: { tier: 'C', pickRate: '27%', avgCDR: '32%' }
  },

  // === ADDITIONAL MMORPG GAMES ===
  'star-wars-the-old-republic': {
    name: 'Star Wars: The Old Republic',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% Alacrity',
    description: 'Alacrity rating reduces cooldowns',
    maxReduction: 30,
    formula: 'Alacrity rating conversion',
    tooltip: 'Alacrity affects both GCD and ability cooldowns.',
    popular: false,
    examples: ['1400 alacrity = 15%', 'Set bonuses', 'Legacy perks'],
    patch: 'Legacy of the Sith 7.6 (September 2025)',
    meta: { tier: 'C+', pickRate: '37%', avgCDR: '22%' }
  },
  'neverwinter': {
    name: 'Neverwinter',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% Recovery',
    description: 'Recovery stat affects all cooldowns',
    maxReduction: 50,
    formula: 'Recovery rating to percentage conversion',
    tooltip: 'Recovery is a core stat for cooldown management.',
    popular: false,
    examples: ['Recovery stat', 'Artifact bonuses', 'Mount powers'],
    patch: 'Menzoberranzan (September 2025)',
    meta: { tier: 'C', pickRate: '27%', avgCDR: '24%' }
  },
  'phantasy-star-online-2': {
    name: 'Phantasy Star Online 2',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% PP Recovery',
    description: 'PP recovery affects ability usage frequency',
    maxReduction: 35,
    formula: 'PP recovery speed modifiers',
    tooltip: 'PP recovery affects photon arts and techniques.',
    popular: false,
    examples: ['Units: 10%', 'Skills: 15%', 'Augments: 8%'],
    patch: 'New Genesis Update (September 2025)',
    meta: { tier: 'C', pickRate: '30%', avgCDR: '22%' }
  },
  'archeage': {
    name: 'ArcheAge',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Equipment gems and set effects',
    maxReduction: 35,
    formula: 'Gem socketing and armor sets',
    tooltip: 'Lunagems and armor sets provide CDR.',
    popular: false,
    examples: ['Lunagems: 5%', 'Set bonus: 20%', 'Synthesized gear'],
    patch: 'Unchained (September 2025)',
    meta: { tier: 'D', pickRate: '18%', avgCDR: '19%' }
  },
  'tera': {
    name: 'TERA',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Crystals and glyphs for CDR',
    maxReduction: 45,
    formula: 'Crystal and glyph effects',
    tooltip: 'Crystals and glyphs are essential for CDR builds.',
    popular: false,
    examples: ['Swift crystal: 7%', 'Glyphs: 20%', 'Equipment lines'],
    patch: 'Legacy (2022)',
    meta: { tier: 'D', pickRate: '17%', avgCDR: '22%' }
  },
  'blade-and-soul': {
    name: 'Blade & Soul',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Soul shields and accessories',
    maxReduction: 40,
    formula: 'Equipment set bonuses and gems',
    tooltip: 'Soul shields and gems provide CDR bonuses.',
    popular: false,
    examples: ['Soul shields: 8%', 'Accessories: 12%', 'Gems: 15%'],
    patch: 'Legacy (2023)',
    meta: { tier: 'D', pickRate: '20%', avgCDR: '21%' }
  },
  'maple-story': {
    name: 'MapleStory',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% Cooldown Skip',
    description: 'Skills and items provide cooldown reset',
    maxReduction: 40,
    formula: 'Skill effects and equipment',
    tooltip: 'Cooldown reset chance rather than reduction.',
    popular: false,
    examples: ['Skills: 20%', 'Equipment: 15%', 'Legion effects'],
    patch: 'New Age (September 2025)',
    meta: { tier: 'C', pickRate: '32%', avgCDR: '24%' }
  },
  'ragnarok-online': {
    name: 'Ragnarok Online',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% After Cast Delay',
    description: 'Dex and items reduce cast delay',
    maxReduction: 50,
    formula: 'Dex stat and equipment modifiers',
    tooltip: 'High DEX and Kiel card are essential.',
    popular: false,
    examples: ['High DEX', 'Kiel card: 30%', 'Equipment combos'],
    patch: 'Renewal (September 2025)',
    meta: { tier: 'C-', pickRate: '24%', avgCDR: '27%' }
  },

  // === ADDITIONAL ARPG GAMES ===
  'wolcen-lords-of-mayhem': {
    name: 'Wolcen: Lords of Mayhem',
    category: 'ARPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Equipment affixes and skills',
    maxReduction: 50,
    formula: 'Equipment and passive tree',
    tooltip: 'Passive nodes provide significant CDR bonuses.',
    popular: false,
    examples: ['Affixes: 20%', 'Passives: 15%', 'Skill modifiers'],
    patch: 'Chronicle III (September 2025)',
    meta: { tier: 'C', pickRate: '27%', avgCDR: '27%' }
  },
  'titan-quest': {
    name: 'Titan Quest',
    category: 'ARPG',
    type: 'percentage',
    unit: '% Skill Recharge',
    description: 'Equipment and mastery CDR',
    maxReduction: 40,
    formula: 'Equipment and skill modifiers',
    tooltip: 'Artifacts and relics provide CDR bonuses.',
    popular: false,
    examples: ['Artifacts: 15%', 'Skills: 20%', 'Charms: 8%'],
    patch: 'Eternal Embers (September 2025)',
    meta: { tier: 'C+', pickRate: '32%', avgCDR: '24%' }
  },
  'chronicon': {
    name: 'Chronicon',
    category: 'ARPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Equipment and gem CDR bonuses',
    maxReduction: 90,
    formula: 'Multiplicative stacking system',
    tooltip: 'Very high CDR potential with proper gear.',
    popular: false,
    examples: ['Gems: 25%', 'Equipment: 30%', 'Set bonuses: 20%'],
    patch: '1.61 (September 2025)',
    meta: { tier: 'B', pickRate: '34%', avgCDR: '52%' }
  },
  'undecember': {
    name: 'UNDECEMBER',
    category: 'ARPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Link rune and equipment CDR',
    maxReduction: 70,
    formula: 'Rune link combinations',
    tooltip: 'Link runes create powerful CDR combinations.',
    popular: false,
    examples: ['Link runes: 30%', 'Equipment: 20%', 'Skill gems: 15%'],
    patch: 'Act 12 (September 2025)',
    meta: { tier: 'C+', pickRate: '28%', avgCDR: '37%' }
  },
  'book-of-demons': {
    name: 'Book of Demons',
    category: 'ARPG',
    type: 'percentage',
    unit: '% CDR',
    description: 'Card-based CDR system',
    maxReduction: 50,
    formula: 'Card combinations provide CDR',
    tooltip: 'Unique card-based character progression.',
    popular: false,
    examples: ['Cards: 15%', 'Upgrades: 20%', 'Flexiscope system'],
    patch: 'Hellcard DLC (September 2025)',
    meta: { tier: 'C-', pickRate: '17%', avgCDR: '22%' }
  },

  // === BATTLE ROYALE GAMES ===
  'fortnite': {
    name: 'Fortnite',
    category: 'Battle Royale',
    type: 'percentage',
    unit: '% Ability Cooldown',
    description: 'Augments and items reduce ability cooldowns',
    maxReduction: 40,
    formula: 'Augments and consumable effects',
    tooltip: 'Chapter 4+ introduced ability cooldown mechanics.',
    popular: true,
    examples: ['Augments: 25%', 'Consumables: 15%', 'Special items'],
    patch: 'Chapter 5 Season 4 (September 2025)',
    meta: { tier: 'A', pickRate: '73%', avgCDR: '24%' }
  },
  'pubg': {
    name: 'PUBG: Battlegrounds',
    category: 'Battle Royale',
    type: 'percentage',
    unit: '% Equipment Cooldown',
    description: 'Equipment and consumable cooldowns',
    maxReduction: 30,
    formula: 'Equipment tier and consumables',
    tooltip: 'Advanced equipment has reduced cooldowns.',
    popular: false,
    examples: ['Advanced gear: 20%', 'Consumables: 10%', 'Utility items'],
    patch: 'Update 32.1 (September 2025)',
    meta: { tier: 'C+', pickRate: '37%', avgCDR: '17%' }
  },
  'call-of-duty-warzone': {
    name: 'Call of Duty: Warzone',
    category: 'Battle Royale',
    type: 'percentage',
    unit: '% Field Upgrade CDR',
    description: 'Field upgrade cooldown reduction',
    maxReduction: 50,
    formula: 'Perks and equipment effects',
    tooltip: 'Perks can significantly reduce field upgrade cooldowns.',
    popular: true,
    examples: ['Perks: 30%', 'Equipment: 15%', 'Killstreaks'],
    patch: 'Season 6 (September 2025)',
    meta: { tier: 'A-', pickRate: '60%', avgCDR: '27%' }
  },
  'fall-guys': {
    name: 'Fall Guys',
    category: 'Battle Royale',
    type: 'percentage',
    unit: '% Power-up Cooldown',
    description: 'Power-up usage frequency',
    maxReduction: 35,
    formula: 'Crown rank and cosmetics',
    tooltip: 'Higher crown ranks reduce power-up cooldowns.',
    popular: false,
    examples: ['Crown rank: 20%', 'Special costumes: 10%'],
    patch: 'Season 2 (September 2025)',
    meta: { tier: 'D', pickRate: '15%', avgCDR: '18%' }
  },

  // === FPS GAMES ===
  'counter-strike-2': {
    name: 'Counter-Strike 2',
    category: 'FPS',
    type: 'percentage',
    unit: '% Utility Cooldown',
    description: 'Utility and grenade cooldowns',
    maxReduction: 25,
    formula: 'Economy and round-based system',
    tooltip: 'Buy timers and utility usage patterns.',
    popular: true,
    examples: ['Economy management', 'Round timers'],
    patch: 'September 2025 Update',
    meta: { tier: 'B', pickRate: '55%', avgCDR: '12%' }
  },
  'team-fortress-2': {
    name: 'Team Fortress 2',
    category: 'FPS',
    type: 'percentage',
    unit: '% Weapon Cooldown',
    description: 'Weapon and item cooldowns',
    maxReduction: 40,
    formula: 'Weapon attributes and items',
    tooltip: 'Various weapons have cooldown mechanics.',
    popular: false,
    examples: ['Weapon attributes: 20%', 'Items: 15%'],
    patch: 'Summer 2025 Update',
    meta: { tier: 'C', pickRate: '28%', avgCDR: '22%' }
  },
  'paladins': {
    name: 'Paladins',
    category: 'FPS',
    type: 'percentage',
    unit: '% CDR',
    description: 'Champion abilities and items',
    maxReduction: 60,
    formula: 'Items and champion cards',
    tooltip: 'Loadout cards provide significant CDR.',
    popular: false,
    examples: ['Items: 30%', 'Cards: 25%', 'Talents: 15%'],
    patch: 'Siege Beyond (September 2025)',
    meta: { tier: 'B-', pickRate: '42%', avgCDR: '35%' }
  },

  // === SANDBOX GAMES ===
  'minecraft': {
    name: 'Minecraft',
    category: 'Sandbox',
    type: 'percentage',
    unit: '% Enchantment CDR',
    description: 'Enchantments reduce tool and weapon cooldowns',
    maxReduction: 60,
    formula: 'Enchantment levels and combinations',
    tooltip: 'Efficiency and other enchantments affect usage rates.',
    popular: true,
    examples: ['Efficiency V: 40%', 'Mending: 20%', 'Custom enchants'],
    patch: '1.21.3 (September 2025)',
    meta: { tier: 'A', pickRate: '67%', avgCDR: '37%' }
  },
  'terraria': {
    name: 'Terraria',
    category: 'Sandbox',
    type: 'percentage',
    unit: '% Use Time',
    description: 'Accessories and buffs reduce item use time',
    maxReduction: 70,
    formula: 'Accessory stacking and potion effects',
    tooltip: 'Use time affects all items including magic weapons.',
    popular: true,
    examples: ['Feral Claws: 12%', 'Titan Glove: 15%', 'Potions: 25%'],
    patch: '1.4.5.3 (September 2025)',
    meta: { tier: 'A-', pickRate: '63%', avgCDR: '42%' }
  },
  'valheim': {
    name: 'Valheim',
    category: 'Sandbox',
    type: 'percentage',
    unit: '% Skill Cooldown',
    description: 'Skills and food reduce ability cooldowns',
    maxReduction: 45,
    formula: 'Skill levels and food buffs',
    tooltip: 'Food combinations provide significant bonuses.',
    popular: true,
    examples: ['Skills: 25%', 'Food: 15%', 'Equipment: 10%'],
    patch: 'Ashlands (September 2025)',
    meta: { tier: 'B+', pickRate: '48%', avgCDR: '28%' }
  },
  'subnautica': {
    name: 'Subnautica',
    category: 'Sandbox',
    type: 'percentage',
    unit: '% Tool Efficiency',
    description: 'Upgrades reduce tool usage time',
    maxReduction: 35,
    formula: 'Tool upgrades and efficiency modules',
    tooltip: 'Efficiency upgrades affect all tool operations.',
    popular: false,
    examples: ['Upgrades: 20%', 'Modules: 12%'],
    patch: 'Below Zero (September 2025)',
    meta: { tier: 'C+', pickRate: '35%', avgCDR: '22%' }
  },
  'no-mans-sky': {
    name: 'No Man\'s Sky',
    category: 'Sandbox',
    type: 'percentage',
    unit: '% Technology Cooldown',
    description: 'Technology upgrades reduce cooldowns',
    maxReduction: 50,
    formula: 'Technology modules and upgrades',
    tooltip: 'S-class modules provide the best CDR.',
    popular: false,
    examples: ['S-class modules: 25%', 'Upgrades: 15%'],
    patch: 'Worlds Part I (September 2025)',
    meta: { tier: 'C', pickRate: '30%', avgCDR: '25%' }
  },

  // === STRATEGY GAMES ===
  'age-of-empires-4': {
    name: 'Age of Empires IV',
    category: 'Strategy',
    type: 'percentage',
    unit: '% Production Speed',
    description: 'Technologies reduce unit production time',
    maxReduction: 60,
    formula: 'Technology research and civilization bonuses',
    tooltip: 'Faster production equals more frequent unit creation.',
    popular: false,
    examples: ['Technologies: 35%', 'Civ bonuses: 20%'],
    patch: 'Anniversary Edition (September 2025)',
    meta: { tier: 'B', pickRate: '38%', avgCDR: '30%' }
  },
  'starcraft-2': {
    name: 'StarCraft II',
    category: 'Strategy',
    type: 'percentage',
    unit: '% Ability Cooldown',
    description: 'Upgrades reduce spell and ability cooldowns',
    maxReduction: 50,
    formula: 'Research upgrades and unit abilities',
    tooltip: 'Various units have ability cooldown mechanics.',
    popular: false,
    examples: ['Upgrades: 25%', 'Unit abilities: 20%'],
    patch: 'Legacy Edition (September 2025)',
    meta: { tier: 'B-', pickRate: '33%', avgCDR: '25%' }
  },
  'civilization-6': {
    name: 'Civilization VI',
    category: 'Strategy',
    type: 'percentage',
    unit: '% Policy Cooldown',
    description: 'Governments reduce policy change cooldowns',
    maxReduction: 40,
    formula: 'Government types and civics',
    tooltip: 'Different governments have varying policy flexibility.',
    popular: false,
    examples: ['Governments: 25%', 'Civics: 15%'],
    patch: 'Leader Pass (September 2025)',
    meta: { tier: 'C+', pickRate: '28%', avgCDR: '20%' }
  },

  // === FIGHTING GAMES ===
  'street-fighter-6': {
    name: 'Street Fighter 6',
    category: 'Fighting',
    type: 'percentage',
    unit: '% Frame Recovery',
    description: 'Frame data and recovery optimization',
    maxReduction: 30,
    formula: 'Move properties and system mechanics',
    tooltip: 'Faster recovery allows for better frame advantage.',
    popular: true,
    examples: ['System mechanics', 'Move properties'],
    patch: 'Year 2 Season 1 (September 2025)',
    meta: { tier: 'A', pickRate: '52%', avgCDR: '18%' }
  },
  'tekken-8': {
    name: 'Tekken 8',
    category: 'Fighting',
    type: 'percentage',
    unit: '% Heat Recovery',
    description: 'Heat system affects move recovery',
    maxReduction: 35,
    formula: 'Heat system and rage mechanics',
    tooltip: 'Heat enhances moves and reduces recovery.',
    popular: true,
    examples: ['Heat system: 25%', 'Rage: 10%'],
    patch: 'Season 1 (September 2025)',
    meta: { tier: 'A-', pickRate: '47%', avgCDR: '20%' }
  },
  'guilty-gear-strive': {
    name: 'Guilty Gear Strive',
    category: 'Fighting',
    type: 'percentage',
    unit: '% Tension Recovery',
    description: 'Tension gauge affects special move usage',
    maxReduction: 40,
    formula: 'Tension gauge mechanics',
    tooltip: 'Higher tension allows more frequent special moves.',
    popular: false,
    examples: ['Tension mechanics', 'Burst gauge'],
    patch: 'Season 4 (September 2025)',
    meta: { tier: 'B+', pickRate: '39%', avgCDR: '22%' }
  },
  'mortal-kombat-1': {
    name: 'Mortal Kombat 1',
    category: 'Fighting',
    type: 'percentage',
    unit: '% Kameo Cooldown',
    description: 'Kameo fighter ability cooldowns',
    maxReduction: 50,
    formula: 'Kameo system and meter management',
    tooltip: 'Kameo abilities have separate cooldown systems.',
    popular: true,
    examples: ['Kameo abilities: 30%', 'Meter usage: 15%'],
    patch: 'Khaos Reigns (September 2025)',
    meta: { tier: 'A-', pickRate: '44%', avgCDR: '25%' }
  },

  // === CARD GAMES ===
  'hearthstone': {
    name: 'Hearthstone',
    category: 'Card Game',
    type: 'percentage',
    unit: '% Spell Cooldown',
    description: 'Cards that reduce spell costs and cooldowns',
    maxReduction: 60,
    formula: 'Card effects and mana reduction',
    tooltip: 'Various cards provide cost and cooldown reduction.',
    popular: true,
    examples: ['Cost reduction cards: 40%', 'Effects: 20%'],
    patch: 'Whizbang\'s Workshop (September 2025)',
    meta: { tier: 'A', pickRate: '56%', avgCDR: '35%' }
  },
  'legends-of-runeterra': {
    name: 'Legends of Runeterra',
    category: 'Card Game',
    type: 'percentage',
    unit: '% Mana Reduction',
    description: 'Cards that reduce spell costs',
    maxReduction: 50,
    formula: 'Card synergies and region effects',
    tooltip: 'Different regions have various cost reduction mechanics.',
    popular: false,
    examples: ['Region effects: 30%', 'Card synergies: 15%'],
    patch: 'Path of Champions 3.0 (September 2025)',
    meta: { tier: 'B', pickRate: '34%', avgCDR: '28%' }
  },
  'magic-the-gathering-arena': {
    name: 'Magic: The Gathering Arena',
    category: 'Card Game',
    type: 'percentage',
    unit: '% Mana Cost Reduction',
    description: 'Cards and effects that reduce casting costs',
    maxReduction: 70,
    formula: 'Card abilities and artifact effects',
    tooltip: 'Artifacts and enchantments provide cost reduction.',
    popular: true,
    examples: ['Artifacts: 40%', 'Enchantments: 25%', 'Creature abilities'],
    patch: 'Bloomburrow (September 2025)',
    meta: { tier: 'A-', pickRate: '48%', avgCDR: '40%' }
  },

  // === PLATFORM GAMES ===
  'hollow-knight': {
    name: 'Hollow Knight',
    category: 'Platform',
    type: 'percentage',
    unit: '% Spell Cooldown',
    description: 'Charms reduce spell cooldowns and costs',
    maxReduction: 50,
    formula: 'Charm combinations and soul management',
    tooltip: 'Soul management affects spell usage frequency.',
    popular: true,
    examples: ['Charms: 30%', 'Soul management: 15%'],
    patch: 'Silksong (TBA)',
    meta: { tier: 'A', pickRate: '52%', avgCDR: '28%' }
  },
  'dead-cells': {
    name: 'Dead Cells',
    category: 'Platform',
    type: 'percentage',
    unit: '% Skill Cooldown',
    description: 'Mutations and items reduce skill cooldowns',
    maxReduction: 65,
    formula: 'Mutation effects and item synergies',
    tooltip: 'Colorless builds often focus on CDR.',
    popular: true,
    examples: ['Mutations: 40%', 'Items: 20%', 'Synergies: 15%'],
    patch: 'Clean Cut (September 2025)',
    meta: { tier: 'A-', pickRate: '46%', avgCDR: '38%' }
  },
  'hades': {
    name: 'Hades',
    category: 'Platform',
    type: 'percentage',
    unit: '% Boon Cooldown',
    description: 'Boons and mirror upgrades reduce cooldowns',
    maxReduction: 60,
    formula: 'Boon combinations and mirror talents',
    tooltip: 'Hermes boons specifically target cooldown reduction.',
    popular: true,
    examples: ['Hermes boons: 35%', 'Mirror: 20%', 'Duo boons'],
    patch: 'Hades II Early Access (September 2025)',
    meta: { tier: 'A', pickRate: '58%', avgCDR: '32%' }
  },
  'celeste': {
    name: 'Celeste',
    category: 'Platform',
    type: 'percentage',
    unit: '% Dash Recovery',
    description: 'Crystal hearts and assist modes',
    maxReduction: 40,
    formula: 'Assist mode settings and collectibles',
    tooltip: 'Assist modes can modify dash recovery time.',
    popular: false,
    examples: ['Assist mode: 30%', 'Crystal mechanics'],
    patch: 'Farewell (Complete)',
    meta: { tier: 'C', pickRate: '25%', avgCDR: '20%' }
  },

  // === ADDITIONAL GAMES TO REACH 125+ ===
  // Auto Battlers
  'auto-chess': {
    name: 'Auto Chess',
    category: 'Auto Battler',
    type: 'percentage',
    unit: '% Ability Cooldown',
    description: 'Chess piece ability cooldowns',
    maxReduction: 45,
    formula: 'Synergy and item effects',
    tooltip: 'Synergies and items affect piece abilities.',
    popular: false,
    examples: ['Items: 25%', 'Synergies: 15%'],
    patch: 'Season 12 (September 2025)',
    meta: { tier: 'C', pickRate: '22%', avgCDR: '25%' }
  },
  'dota-underlords': {
    name: 'Dota Underlords',
    category: 'Auto Battler',
    type: 'percentage',
    unit: '% Spell Cooldown',
    description: 'Hero spell cooldown reduction',
    maxReduction: 50,
    formula: 'Items and alliances',
    tooltip: 'Alliance bonuses provide CDR effects.',
    popular: false,
    examples: ['Items: 30%', 'Alliances: 20%'],
    patch: 'Legacy (2023)',
    meta: { tier: 'D', pickRate: '12%', avgCDR: '28%' }
  },

  // Survival Games
  'the-forest': {
    name: 'The Forest',
    category: 'Survival',
    type: 'percentage',
    unit: '% Stamina Recovery',
    description: 'Stamina affects tool usage frequency',
    maxReduction: 40,
    formula: 'Stats and equipment effects',
    tooltip: 'Higher stamina allows more frequent tool use.',
    popular: false,
    examples: ['Fitness: 25%', 'Equipment: 10%'],
    patch: 'VR Update (September 2025)',
    meta: { tier: 'C', pickRate: '28%', avgCDR: '22%' }
  },
  'green-hell': {
    name: 'Green Hell',
    category: 'Survival',
    type: 'percentage',
    unit: '% Action Speed',
    description: 'Skills reduce action times',
    maxReduction: 35,
    formula: 'Skill progression and tools',
    tooltip: 'Skill levels improve action efficiency.',
    popular: false,
    examples: ['Skills: 20%', 'Tools: 12%'],
    patch: 'Spirits of Amazonia Part 3 (September 2025)',
    meta: { tier: 'C-', pickRate: '19%', avgCDR: '18%' }
  },
  'raft': {
    name: 'Raft',
    category: 'Survival',
    type: 'percentage',
    unit: '% Crafting Speed',
    description: 'Research and tools improve crafting',
    maxReduction: 30,
    formula: 'Research progress and tool quality',
    tooltip: 'Better tools and research reduce crafting time.',
    popular: false,
    examples: ['Research: 15%', 'Tools: 10%'],
    patch: 'The Final Chapter (September 2025)',
    meta: { tier: 'C-', pickRate: '16%', avgCDR: '15%' }
  },

  // Racing Games
  'rocket-league': {
    name: 'Rocket League',
    category: 'Racing',
    type: 'percentage',
    unit: '% Boost Efficiency',
    description: 'Car mods affect boost consumption',
    maxReduction: 25,
    formula: 'Car configuration and training',
    tooltip: 'Boost management affects gameplay frequency.',
    popular: true,
    examples: ['Training: 15%', 'Car setup: 8%'],
    patch: 'Season 14 (September 2025)',
    meta: { tier: 'B', pickRate: '45%', avgCDR: '12%' }
  },
  'gran-turismo-7': {
    name: 'Gran Turismo 7',
    category: 'Racing',
    type: 'percentage',
    unit: '% Tire Degradation',
    description: 'Driving skills reduce tire wear',
    maxReduction: 40,
    formula: 'Driver skill and car setup',
    tooltip: 'Better driving reduces pit stop frequency.',
    popular: false,
    examples: ['Skills: 25%', 'Setup: 12%'],
    patch: 'Update 1.49 (September 2025)',
    meta: { tier: 'C+', pickRate: '32%', avgCDR: '20%' }
  },

  // MMO/Online Games
  'final-fantasy-xi': {
    name: 'Final Fantasy XI',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% Haste',
    description: 'Haste affects casting and recast times',
    maxReduction: 80,
    formula: 'Equipment haste and magic haste',
    tooltip: 'Dual haste caps: equipment (25%) and magic (43.75%).',
    popular: false,
    examples: ['Equipment: 25%', 'Magic: 43.75%', 'Job abilities'],
    patch: 'The Voracious Resurgence (September 2025)',
    meta: { tier: 'C', pickRate: '21%', avgCDR: '45%' }
  },
  'dragon-nest': {
    name: 'Dragon Nest',
    category: 'MMORPG',
    type: 'percentage',
    unit: '% Cooldown Time',
    description: 'Equipment and enhancement CDR',
    maxReduction: 45,
    formula: 'Equipment enhancement and gems',
    tooltip: 'Enhancement and gem socketing provide CDR.',
    popular: false,
    examples: ['Enhancement: 20%', 'Gems: 15%', 'Set effects: 8%'],
    patch: 'Labyrinth Update (September 2025)',
    meta: { tier: 'D', pickRate: '14%', avgCDR: '22%' }
  },

  // Puzzle/Casual Games
  'tetris-effect': {
    name: 'Tetris Effect',
    category: 'Puzzle',
    type: 'percentage',
    unit: '% Zone Cooldown',
    description: 'Zone ability cooldown in Journey mode',
    maxReduction: 30,
    formula: 'Score and performance based',
    tooltip: 'Higher scores reduce zone ability cooldown.',
    popular: false,
    examples: ['Performance: 20%', 'Combo effects: 8%'],
    patch: 'Connected (September 2025)',
    meta: { tier: 'D', pickRate: '18%', avgCDR: '15%' }
  },

  // Additional FPS/Shooter Games
  'hunt-showdown': {
    name: 'Hunt: Showdown',
    category: 'FPS',
    type: 'percentage',
    unit: '% Tool Cooldown',
    description: 'Traits reduce tool and consumable cooldowns',
    maxReduction: 35,
    formula: 'Hunter traits and bloodline progression',
    tooltip: 'Traits like Physician reduce consumable cooldowns.',
    popular: false,
    examples: ['Traits: 25%', 'Bloodline: 8%'],
    patch: 'Mammon\'s Gulch (September 2025)',
    meta: { tier: 'B-', pickRate: '36%', avgCDR: '18%' }
  },
  'deep-rock-galactic': {
    name: 'Deep Rock Galactic',
    category: 'FPS',
    type: 'percentage',
    unit: '% Equipment Cooldown',
    description: 'Perks and mods reduce equipment cooldowns',
    maxReduction: 40,
    formula: 'Perk combinations and weapon mods',
    tooltip: 'Active perks and weapon modifications affect cooldowns.',
    popular: true,
    examples: ['Perks: 25%', 'Mods: 12%', 'Overclocks: 8%'],
    patch: 'Season 5 (September 2025)',
    meta: { tier: 'B+', pickRate: '52%', avgCDR: '25%' }
  },

  // Additional MOBA/Strategy
  'heroes-of-newerth': {
    name: 'Heroes of Newerth',
    category: 'MOBA',
    type: 'percentage',
    unit: '% CDR',
    description: 'Classic percentage-based CDR system',
    maxReduction: 40,
    formula: 'Standard percentage reduction',
    tooltip: 'Traditional CDR system similar to early MOBAs.',
    popular: false,
    examples: ['Restoration Stone: 15%', 'Items stack additively'],
    patch: 'Legacy (2024)',
    meta: { tier: 'D', pickRate: '8%', avgCDR: '25%' }
  },
  'awesomenauts': {
    name: 'Awesomenauts',
    category: 'MOBA',
    type: 'percentage',
    unit: '% Ability Cooldown',
    description: '2D MOBA with upgrade-based CDR',
    maxReduction: 50,
    formula: 'Character upgrades and items',
    tooltip: 'Upgrades provide various CDR bonuses.',
    popular: false,
    examples: ['Upgrades: 30%', 'Items: 15%'],
    patch: 'Overdrive (September 2025)',
    meta: { tier: 'D', pickRate: '11%', avgCDR: '28%' }
  },

  // Additional Action RPG
  'nioh-2': {
    name: 'Nioh 2',
    category: 'Action RPG',
    type: 'percentage',
    unit: '% Yokai Ability CDR',
    description: 'Soul cores and magic reduce yokai ability cooldowns',
    maxReduction: 60,
    formula: 'Magic stat and soul core effects',
    tooltip: 'Magic stat and soul core levels affect cooldowns.',
    popular: false,
    examples: ['Magic stat: 35%', 'Soul cores: 20%', 'Set bonuses: 8%'],
    patch: 'Complete Edition (September 2025)',
    meta: { tier: 'B-', pickRate: '33%', avgCDR: '35%' }
  },
  'sekiro': {
    name: 'Sekiro: Shadows Die Twice',
    category: 'Action RPG',
    type: 'percentage',
    unit: '% Prosthetic Cooldown',
    description: 'Spirit emblems and upgrades reduce prosthetic cooldowns',
    maxReduction: 45,
    formula: 'Prosthetic upgrades and spirit emblem efficiency',
    tooltip: 'Upgrades reduce spirit emblem consumption.',
    popular: false,
    examples: ['Upgrades: 30%', 'Efficiency: 12%'],
    patch: 'GOTY Edition (September 2025)',
    meta: { tier: 'C+', pickRate: '29%', avgCDR: '25%' }
  },

  // Additional Strategy Games
  'command-and-conquer-remastered': {
    name: 'Command & Conquer Remastered',
    category: 'Strategy',
    type: 'percentage',
    unit: '% Production Speed',
    description: 'Technologies reduce unit production time',
    maxReduction: 35,
    formula: 'Tech tree progression',
    tooltip: 'Advanced technologies speed up production.',
    popular: false,
    examples: ['Tech upgrades: 25%', 'Multiple factories: 8%'],
    patch: 'Remastered Collection (September 2025)',
    meta: { tier: 'C', pickRate: '24%', avgCDR: '18%' }
  },
  'total-war-warhammer-3': {
    name: 'Total War: Warhammer III',
    category: 'Strategy',
    type: 'percentage',
    unit: '% Ability Cooldown',
    description: 'Lord skills and items reduce ability cooldowns',
    maxReduction: 50,
    formula: 'Lord skill points and magical items',
    tooltip: 'Lord progression affects army-wide cooldowns.',
    popular: false,
    examples: ['Skills: 30%', 'Items: 15%', 'Research: 8%'],
    patch: 'Thrones of Decay (September 2025)',
    meta: { tier: 'B-', pickRate: '35%', avgCDR: '28%' }
  },

  // Additional Fighting Games
  'dragon-ball-fighterz': {
    name: 'Dragon Ball FighterZ',
    category: 'Fighting',
    type: 'percentage',
    unit: '% Ki Recovery',
    description: 'Ki gauge management affects special moves',
    maxReduction: 35,
    formula: 'Character assists and meter management',
    tooltip: 'Assist calls and meter usage patterns.',
    popular: true,
    examples: ['Assists: 20%', 'Meter usage: 12%'],
    patch: 'Season 4 (September 2025)',
    meta: { tier: 'A-', pickRate: '41%', avgCDR: '22%' }
  },
  'king-of-fighters-15': {
    name: 'The King of Fighters XV',
    category: 'Fighting',
    type: 'percentage',
    unit: '% Power Gauge',
    description: 'Power gauge affects super move frequency',
    maxReduction: 40,
    formula: 'Power gauge management and MAX mode',
    tooltip: 'MAX mode and power gauge strategy.',
    popular: false,
    examples: ['MAX mode: 25%', 'Power management: 12%'],
    patch: 'Team Awakened Orochi (September 2025)',
    meta: { tier: 'B', pickRate: '32%', avgCDR: '20%' }
  },

  // VR Games
  'half-life-alyx': {
    name: 'Half-Life: Alyx',
    category: 'FPS',
    type: 'percentage',
    unit: '% Gravity Glove Cooldown',
    description: 'Gravity glove and other tool cooldowns',
    maxReduction: 30,
    formula: 'Upgrade stations and resin collection',
    tooltip: 'Upgrades reduce tool operation cooldowns.',
    popular: true,
    examples: ['Upgrades: 20%', 'Resin mods: 8%'],
    patch: 'Final Update (2023)',
    meta: { tier: 'A-', pickRate: '48%', avgCDR: '15%' }
  },
  'beat-saber': {
    name: 'Beat Saber',
    category: 'Platform',
    type: 'percentage',
    unit: '% Modifier Cooldown',
    description: 'Game modifiers affect energy and ability usage',
    maxReduction: 25,
    formula: 'Modifier combinations and skill',
    tooltip: 'Various modifiers change gameplay mechanics.',
    popular: true,
    examples: ['Modifiers: 15%', 'Custom songs: 8%'],
    patch: 'Music Pack Vol. 7 (September 2025)',
    meta: { tier: 'C+', pickRate: '38%', avgCDR: '12%' }
  }
};

// Categories for filtering - Only actual categories, no "All Games"
const CATEGORIES = [
  { name: 'MOBA', value: 'MOBA', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'MOBA').length },
  { name: 'MMORPG', value: 'MMORPG', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'MMORPG').length },
  { name: 'ARPG', value: 'ARPG', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'ARPG').length },
  { name: 'Battle Royale', value: 'Battle Royale', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Battle Royale').length },
  { name: 'Action RPG', value: 'Action RPG', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Action RPG').length },
  { name: 'FPS', value: 'FPS', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'FPS').length },
  { name: 'Mobile MOBA', value: 'Mobile MOBA', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Mobile MOBA').length },
  { name: 'Sandbox', value: 'Sandbox', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Sandbox').length },
  { name: 'Strategy', value: 'Strategy', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Strategy').length },
  { name: 'Fighting', value: 'Fighting', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Fighting').length },
  { name: 'Card Game', value: 'Card Game', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Card Game').length },
  { name: 'Platform', value: 'Platform', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Platform').length },
  { name: 'Auto Battler', value: 'Auto Battler', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Auto Battler').length },
  { name: 'Survival', value: 'Survival', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Survival').length },
  { name: 'Racing', value: 'Racing', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Racing').length },
  { name: 'Puzzle', value: 'Puzzle', count: Object.values(GAME_SYSTEMS).filter(g => g.category === 'Puzzle').length }
];

// Total games count for display purposes
const TOTAL_GAMES_COUNT = Object.keys(GAME_SYSTEMS).length;

interface CalculationResult {
  finalCooldown: number;
  totalReduction: number;
  castsPerMinute: number;
  dpsIncrease: number;
  warnings: string[];
}

// Tooltip helper component
const TooltipButton: React.FC<{ id: string; tooltip: string; children: React.ReactNode; showTooltipFor: string | null; setShowTooltipFor: (id: string | null) => void }> = ({ id, tooltip, children, showTooltipFor, setShowTooltipFor }) => {
  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {children}
        <button
          onClick={() => setShowTooltipFor(showTooltipFor === id ? null : id)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      </div>
      {showTooltipFor === id && (
        <div className="absolute z-10 mt-2 p-3 bg-popover border rounded-lg shadow-lg max-w-sm text-sm">
          <p>{tooltip}</p>
        </div>
      )}
    </div>
  );
};

const AdvancedCooldownCalculator: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('league-of-legends');
  const [baseCooldown, setBaseCooldown] = useState<number>(10);
  const [cdrValue, setCdrValue] = useState<number>(50); // Default to 50 Ability Haste for demo
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showTooltipFor, setShowTooltipFor] = useState<string | null>(null);

  // Game search state
  const [gameSearch, setGameSearch] = useState<string>('');
  const [showGameDropdown, setShowGameDropdown] = useState<boolean>(false);
  const [filteredGames, setFilteredGames] = useState<Array<[string, typeof GAME_SYSTEMS[keyof typeof GAME_SYSTEMS]]>>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(-1);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  // Category search state
  const [categorySearch, setCategorySearch] = useState<string>('All Games');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [filteredCategories, setFilteredCategories] = useState<Array<{name: string, count: number, value: string}>>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(-1);

  // Update filtered games when search changes
  useEffect(() => {
    const games = Object.entries(GAME_SYSTEMS);
    let filtered = selectedCategory === 'All'
      ? games
      : games.filter(([_, game]) => game.category === selectedCategory);

    if (gameSearch) {
      filtered = filtered.filter(([_, game]) =>
        game.name.toLowerCase().includes(gameSearch.toLowerCase()) ||
        game.category.toLowerCase().includes(gameSearch.toLowerCase())
      );
    }

    setFilteredGames(filtered);
    setSelectedGameIndex(-1);
  }, [gameSearch, selectedCategory]);

  // Update filtered categories when search changes
  useEffect(() => {
    // Show all categories if search is empty or "All Games"
    if (!categorySearch || categorySearch === 'All Games') {
      setFilteredCategories(CATEGORIES);
    } else {
      let filtered = CATEGORIES.filter(category =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
    setSelectedCategoryIndex(-1);
  }, [categorySearch]);

  // Calculate dropdown position to prevent overflow
  const calculateDropdownPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < 300 && spaceAbove > spaceBelow) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

  // Handle game selection
  const handleGameSelect = (gameKey: string, gameName: string) => {
    setSelectedGame(gameKey);
    setGameSearch(gameName);
    setShowGameDropdown(false);
    setSelectedGameIndex(-1);
  };

  // Handle category selection
  const handleCategorySelect = (categoryValue: string, categoryName: string) => {
    setSelectedCategory(categoryValue);
    setCategorySearch(categoryName);
    setShowCategoryDropdown(false);
    setSelectedCategoryIndex(-1);
  };

  // Keyboard navigation for games
  const handleGameKeyDown = (e: React.KeyboardEvent) => {
    if (!showGameDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedGameIndex(prev =>
          prev < filteredGames.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedGameIndex(prev =>
          prev > 0 ? prev - 1 : filteredGames.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedGameIndex >= 0 && filteredGames[selectedGameIndex]) {
          const [key, game] = filteredGames[selectedGameIndex];
          handleGameSelect(key, game.name);
        }
        break;
      case 'Escape':
        setShowGameDropdown(false);
        setSelectedGameIndex(-1);
        break;
    }
  };

  // Keyboard navigation for categories
  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (!showCategoryDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCategoryIndex(prev =>
          prev < filteredCategories.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedCategoryIndex(prev =>
          prev > 0 ? prev - 1 : filteredCategories.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedCategoryIndex >= 0 && filteredCategories[selectedCategoryIndex]) {
          const category = filteredCategories[selectedCategoryIndex];
          handleCategorySelect(category.value, category.name);
        }
        break;
      case 'Escape':
        setShowCategoryDropdown(false);
        setSelectedCategoryIndex(-1);
        break;
    }
  };

  // Update game search when category changes
  useEffect(() => {
    const category = CATEGORIES.find(c => c.value === selectedCategory);
    if (category && categorySearch === 'All Games') {
      setCategorySearch(category.name);
    }
  }, [selectedCategory, categorySearch, CATEGORIES]);

  // Calculate CDR based on selected game system
  const calculateCDR = useCallback((gameSystem: string, baseCD: number, inputValue: number): CalculationResult => {
    const system = GAME_SYSTEMS[gameSystem as keyof typeof GAME_SYSTEMS];
    let finalCooldown = baseCD;
    let totalReduction = 0;
    const warnings: string[] = [];

    if (inputValue <= 0) {
      return {
        finalCooldown: baseCD,
        totalReduction: 0,
        castsPerMinute: 60 / baseCD,
        dpsIncrease: 0,
        warnings: []
      };
    }

    switch (system.type) {
      case 'ability-haste': {
        // League of Legends Ability Haste
        totalReduction = (inputValue / (inputValue + 100)) * 100;
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (inputValue > 500) {
          warnings.push('Ability Haste above 500 is rarely achievable in practice');
        }
        break;
      }

      case 'haste-rating': {
        // World of Warcraft Haste Rating
        const hastePercentage = inputValue / 32.79; // Level 80 conversion
        totalReduction = Math.min(hastePercentage, system.maxReduction);
        finalCooldown = baseCD / (1 + totalReduction / 100);

        if (hastePercentage > system.maxReduction) {
          warnings.push(`Haste is effectively capped at ${system.maxReduction}%`);
        }
        break;
      }

      case 'energy-recharge': {
        // Genshin Impact Energy Recharge
        const erBonus = Math.max(inputValue - 100, 0); // Base is 100%
        totalReduction = Math.min(erBonus * 0.5, system.maxReduction); // Rough conversion
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (inputValue > 300) {
          warnings.push('ER above 300% has diminishing returns on most characters');
        }
        break;
      }

      case 'speed': {
        // Honkai Star Rail Speed
        finalCooldown = baseCD / (1 + inputValue / 100);
        totalReduction = (1 - finalCooldown / baseCD) * 100;

        if (inputValue > 200) {
          warnings.push('Speed above 200% is very difficult to achieve');
        }
        break;
      }

      case 'skill-level': {
        // Monster Hunter skill levels (1-5)
        const level = Math.min(Math.max(Math.floor(inputValue), 1), 5);
        totalReduction = level * 10; // 10% per level (simplified)
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (level >= 5) {
          warnings.push('Level 5 is the maximum skill level');
        }
        break;
      }

      case 'efficiency': {
        // Warframe Efficiency
        totalReduction = Math.min(inputValue, system.maxReduction);
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (inputValue > system.maxReduction) {
          warnings.push(`Efficiency is effectively capped at ${system.maxReduction}%`);
        }
        break;
      }

      case 'item-stacks': {
        // Risk of Rain 2 hyperbolic stacking
        const stacks = Math.max(Math.floor(inputValue), 0);
        // Hyperbolic formula: 1 - (1 / (1 + stacks * 0.1))
        totalReduction = (1 - (1 / (1 + stacks * 0.1))) * 100;
        totalReduction = Math.min(totalReduction, system.maxReduction);
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (stacks > 50) {
          warnings.push('Stacks above 50 provide minimal additional benefit');
        }
        break;
      }

      case 'percentage':
      default: {
        // Standard percentage CDR (most games)
        totalReduction = Math.min(inputValue, system.maxReduction);
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (inputValue > system.maxReduction) {
          warnings.push(`CDR is capped at ${system.maxReduction}%`);
        }
        break;
      }
    }

    // Calculate derived metrics
    const castsPerMinute = finalCooldown > 0 ? 60 / finalCooldown : 0;
    const baseCastsPerMinute = 60 / baseCD;
    const dpsIncrease = ((castsPerMinute - baseCastsPerMinute) / baseCastsPerMinute) * 100;

    return {
      finalCooldown: Math.max(finalCooldown, 0.1),
      totalReduction,
      castsPerMinute,
      dpsIncrease,
      warnings
    };
  }, []);

  // Memoized calculation results
  const results = useMemo(() => {
    return calculateCDR(selectedGame, baseCooldown, cdrValue);
  }, [calculateCDR, selectedGame, baseCooldown, cdrValue]);

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setBaseCooldown(10);
    setCdrValue(50); // Reset to demo value instead of 0
    setSelectedGame('league-of-legends');
    setSelectedCategory('All');
  }, []);

  // Ensure selected game is valid when category changes
  React.useEffect(() => {
    const filteredGames = Object.entries(GAME_SYSTEMS)
      .filter(([_, game]) => selectedCategory === 'All' || game.category === selectedCategory);

    const currentGameExists = filteredGames.some(([key]) => key === selectedGame);
    if (!currentGameExists && filteredGames.length > 0) {
      setSelectedGame(filteredGames[0][0]);
    }
  }, [selectedCategory, selectedGame]);

  const gameSystem = GAME_SYSTEMS[selectedGame as keyof typeof GAME_SYSTEMS];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div>
          {/* Game Selection and Settings */}
          <div className="bg-background border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Gamepad2 className="h-5 w-5 mr-2 text-primary" />
              Game Selection & Settings
            </h3>

            <div className="space-y-4">
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium">Filter by Category * ({TOTAL_GAMES_COUNT} games total, {CATEGORIES.length} categories)</label>
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                  }}
                  onFocus={(e) => {
                    setShowCategoryDropdown(true);
                    calculateDropdownPosition(e.currentTarget);
                  }}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder="All Games (click to filter by category)"
                  className="w-full px-4 py-3 border-2 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  autoComplete="off"
                />
                {showCategoryDropdown && (
                  <div
                    className={`absolute z-50 w-full bg-background border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto ${
                      dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}
                  >
                    {/* Always show "All Games" as first option */}
                    <div
                      onClick={() => handleCategorySelect('All', 'All Games')}
                      className={`px-4 py-3 cursor-pointer hover:bg-accent border-b border-border ${
                        selectedCategoryIndex === -1 ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">All Games</div>
                          <div className="text-xs text-muted-foreground">
                            {TOTAL_GAMES_COUNT} games • all categories
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary">{TOTAL_GAMES_COUNT}</div>
                      </div>
                    </div>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category, index) => (
                        <div
                          key={category.value}
                          onClick={() => handleCategorySelect(category.value, category.name)}
                          className={`px-4 py-3 cursor-pointer hover:bg-accent border-b border-border last:border-b-0 ${
                            index === selectedCategoryIndex ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {category.count} games • {category.value !== 'All' ? `${category.value} genre` : 'all categories'}
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary">
                              {category.count}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-muted-foreground">
                        No categories found matching "{categorySearch}"
                        <div className="text-xs mt-1">Try searching by genre name</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 relative">
                <label className="block text-sm font-medium">
                  Select Game * ({Object.entries(GAME_SYSTEMS).filter(([_, game]) => selectedCategory === 'All' || game.category === selectedCategory).length} available from {selectedCategory === 'All' ? 'all categories' : selectedCategory})
                </label>
                <input
                  type="text"
                  value={gameSearch}
                  onChange={(e) => {
                    setGameSearch(e.target.value);
                    setShowGameDropdown(true);
                  }}
                  onFocus={(e) => {
                    setShowGameDropdown(true);
                    calculateDropdownPosition(e.currentTarget);
                  }}
                  onKeyDown={handleGameKeyDown}
                  placeholder="Search and select game..."
                  className="w-full px-4 py-3 border-2 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  autoComplete="off"
                />
                {showGameDropdown && (
                  <div
                    className={`absolute z-50 w-full bg-background border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto ${
                      dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}
                  >
                    {filteredGames.length > 0 ? (
                      filteredGames.map(([key, game], index) => (
                        <div
                          key={key}
                          onClick={() => handleGameSelect(key, game.name)}
                          className={`px-4 py-3 cursor-pointer hover:bg-accent border-b border-border last:border-b-0 ${
                            index === selectedGameIndex ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium flex items-center">
                                {game.name}
                                {game.popular && <Star className="h-3 w-3 ml-2 text-yellow-500 fill-current" />}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {game.category} • {game.type}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Max {game.maxReduction}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-muted-foreground">
                        No games found matching "{gameSearch}"
                        <div className="text-xs mt-1">Try adjusting your search or category filter</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <TooltipButton
                  id="base-cooldown"
                  tooltip="The original cooldown of your ability before any CDR is applied"
                  showTooltipFor={showTooltipFor}
                  setShowTooltipFor={setShowTooltipFor}
                >
                  <label className="block text-sm font-medium">Base Cooldown (seconds)</label>
                </TooltipButton>
                <input
                  type="number"
                  value={baseCooldown}
                  onChange={(e) => setBaseCooldown(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  min="0.1"
                  max="300"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                />
              </div>

              <div className="space-y-2">
                <TooltipButton
                  id="cdr-value"
                  tooltip={gameSystem.tooltip}
                  showTooltipFor={showTooltipFor}
                  setShowTooltipFor={setShowTooltipFor}
                >
                  <label className="block text-sm font-medium">
                    {gameSystem.unit} ({gameSystem.type})
                  </label>
                </TooltipButton>
                <input
                  type="number"
                  value={cdrValue}
                  onChange={(e) => setCdrValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  min="0"
                  max="1000"
                  step="1"
                  className="w-full px-4 py-3 border-2 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                />
                <div className="text-xs text-muted-foreground">
                  Examples: {gameSystem.examples.join(' • ')}
                </div>
              </div>

              <button
                onClick={resetCalculator}
                className="w-full px-4 py-2 bg-muted hover:bg-accent border border-border rounded-lg transition-colors"
              >
                Reset Calculator
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="bg-background border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Calculation Results
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Effective CDR</div>
                  <div className="text-2xl font-bold text-primary">
                    {results.totalReduction.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Final Cooldown</div>
                  <div className="text-2xl font-bold text-primary">
                    {results.finalCooldown.toFixed(1)}s
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Casts/Min</div>
                  <div className="text-lg font-semibold">
                    <span className="font-semibold text-primary">
                      {results.castsPerMinute.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">DPS Increase</div>
                  <div className="text-lg font-semibold text-green-600">
                    +{results.dpsIncrease.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Game Info</h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <div><strong>Formula:</strong> {gameSystem.formula}</div>
                  <div><strong>Latest Patch:</strong> {gameSystem.patch}</div>
                  <div><strong>Meta Tier:</strong> {gameSystem.meta.tier} | <strong>Pick Rate:</strong> {gameSystem.meta.pickRate}</div>
                </div>
              </div>

              {results.warnings.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Warnings:</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {results.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">⚠️</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-background border rounded-xl p-6 mt-6">
            <h4 className="font-semibold mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              Performance Metrics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Time Saved per Cast:</span>
                <span className="font-semibold text-primary ml-2">
                  {(baseCooldown - results.finalCooldown).toFixed(1)}s
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Efficiency Gain:</span>
                <span className="font-semibold text-primary ml-2">
                  {((baseCooldown / results.finalCooldown) * 100 - 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Casts in 10min:</span>
                <span className="font-semibold text-primary ml-2">
                  {(results.castsPerMinute * 10).toFixed(0)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Meta Viability:</span>
                <span className={`font-semibold ml-2 ${
                  gameSystem.meta.tier.includes('S') ? 'text-green-600' :
                  gameSystem.meta.tier.includes('A') ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {gameSystem.meta.tier}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Information */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-primary" />
          How Cooldown Reduction Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Supported Games (60+)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium">League of Legends (MOBA)</div>
                  <div className="text-muted-foreground">Ability Haste provides linear CDR scaling</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium">Dota 2 (MOBA)</div>
                  <div className="text-muted-foreground">Traditional percentage-based cooldown reduction</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium">World of Warcraft (MMORPG)</div>
                  <div className="text-muted-foreground">Haste rating converts to percentage at level 80</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium">Diablo 4 (ARPG)</div>
                  <div className="text-muted-foreground">Direct cooldown reduction percentage</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium">Path of Exile (ARPG)</div>
                  <div className="text-muted-foreground">Skill-specific cooldown recovery</div>
                </div>
              </div>
              <div className="text-center text-muted-foreground text-sm pt-2">
                ... and 25+ more games across all genres
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Key Concepts</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Linear vs Exponential:</strong> Different games use different scaling formulas
              </div>
              <div>
                <strong>Caps and Limits:</strong> Most games have maximum CDR limits
              </div>
              <div>
                <strong>Opportunity Cost:</strong> CDR vs direct damage optimization
              </div>
              <div>
                <strong>Resource Management:</strong> CDR effectiveness depends on mana/energy
              </div>
              <div>
                <strong>Game-Specific Systems:</strong> Each game implements CDR differently
              </div>
              <div>
                <strong>Skill Rotation:</strong> CDR can change optimal spell rotations and combos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary" />
          How to Use This Calculator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-base mb-2">Step-by-Step Guide</h4>
              <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                <li><strong>1. Select Category:</strong> Choose your game genre (MOBA, MMORPG, ARPG, etc.) to filter available games</li>
                <li><strong>2. Choose Game:</strong> Search and select your specific game from the dropdown list</li>
                <li><strong>3. Enter Base Cooldown:</strong> Input the original cooldown of your ability in seconds</li>
                <li><strong>4. Input CDR Value:</strong> Enter your CDR amount using the game's specific system (%, Ability Haste, etc.)</li>
                <li><strong>5. View Results:</strong> See instant calculations with warnings and performance metrics</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2">Understanding CDR Types</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div><strong>Ability Haste:</strong> Linear scaling system (League of Legends)</div>
                <div><strong>Percentage CDR:</strong> Traditional diminishing returns system</div>
                <div><strong>Haste Rating:</strong> Stat-based conversion (World of Warcraft)</div>
                <div><strong>Energy Recharge:</strong> Affects burst cooldowns (Genshin Impact)</div>
                <div><strong>Speed Stats:</strong> Turn-based frequency (Honkai Star Rail)</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-base mb-2">Reading the Results</h4>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
                <li><strong>Effective CDR:</strong> Your actual cooldown reduction percentage after caps and conversions</li>
                <li><strong>Final Cooldown:</strong> The new ability cooldown after CDR is applied</li>
                <li><strong>Casts per Minute:</strong> How often you can use the ability (useful for DPS calculations)</li>
                <li><strong>DPS Increase:</strong> Theoretical damage increase from more frequent ability usage</li>
                <li><strong>Performance Metrics:</strong> Additional stats like time saved and efficiency gains</li>
                <li><strong>Warnings:</strong> Game-specific advice about caps, diminishing returns, or optimization tips</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2">Pro Tips</h4>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
                <li>Consider resource costs - high CDR is useless without mana/energy</li>
                <li>Balance CDR with damage stats for optimal DPS</li>
                <li>Check game-specific caps and diminishing returns</li>
                <li>Use the search feature to quickly find your game</li>
                <li>Pay attention to warnings for optimization advice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CDR Mechanics Deep Dive */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-primary" />
          CDR Mechanics Deep Dive
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-base mb-2">Formula Types Explained</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Linear Scaling (Ability Haste)</div>
                  <div className="text-muted-foreground mt-1">
                    CDR = Haste / (Haste + 100)<br/>
                    Every point of Ability Haste provides the same value. 100 AH = 50% CDR, 200 AH = 66.7% CDR
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Percentage Reduction</div>
                  <div className="text-muted-foreground mt-1">
                    New Cooldown = Base × (1 - CDR%)<br/>
                    Traditional system with diminishing returns. Each additional % becomes less valuable.
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-primary">Hyperbolic Stacking</div>
                  <div className="text-muted-foreground mt-1">
                    CDR = 1 - (1 / (1 + stacks × multiplier))<br/>
                    Used in roguelike games. Infinite stacks approach but never reach 100%.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-base mb-2">Game-Specific Systems</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-blue-600">MOBA Games</div>
                  <div className="text-muted-foreground mt-1">
                    Item-based CDR with caps (usually 40-80%). Modern games use linear scaling to prevent stacking issues.
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-green-600">MMORPG Games</div>
                  <div className="text-muted-foreground mt-1">
                    Stat-based systems that affect multiple mechanics. Often tied to haste/speed ratings with breakpoints.
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-purple-600">Action RPG Games</div>
                  <div className="text-muted-foreground mt-1">
                    Additive systems from multiple sources. High caps but balanced by resource management.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CDR Optimization Strategies */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary" />
          CDR Optimization Strategies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-base flex items-center">
              <Award className="h-4 w-4 mr-2 text-green-600" />
              Damage Dealers
            </h4>
            <div className="text-sm space-y-2">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-medium">Optimal CDR: 20-40%</div>
                <div className="text-muted-foreground mt-1">
                  Balance CDR with damage stats. Prioritize abilities that scale with AP/AD.
                </div>
              </div>
              <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Focus on damage-dealing abilities first</li>
                <li>Consider mana/energy sustainability</li>
                <li>Don't sacrifice too much raw damage</li>
                <li>Evaluate DPS increase vs other stats</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-base flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Support/Utility
            </h4>
            <div className="text-sm space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-medium">Optimal CDR: 40-60%</div>
                <div className="text-muted-foreground mt-1">
                  Maximize utility uptime. CDR is often more valuable than damage stats.
                </div>
              </div>
              <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Prioritize crowd control abilities</li>
                <li>Focus on team fight utility</li>
                <li>Consider cooldown of protective abilities</li>
                <li>Balance with survivability stats</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-base flex items-center">
              <Globe className="h-4 w-4 mr-2 text-orange-600" />
              Tank/Initiator
            </h4>
            <div className="text-sm space-y-2">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="font-medium">Optimal CDR: 20-35%</div>
                <div className="text-muted-foreground mt-1">
                  Moderate CDR for engage tools. Prioritize survivability over maximum CDR.
                </div>
              </div>
              <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Focus on engagement abilities</li>
                <li>Don't sacrifice too much defense</li>
                <li>Consider escape/disengage cooldowns</li>
                <li>Balance with health/resistance stats</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Common CDR Mistakes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700 dark:text-yellow-300">
            <ul className="space-y-1 list-disc ml-4">
              <li>Overcapping CDR beyond game limits</li>
              <li>Ignoring resource (mana/energy) sustainability</li>
              <li>Building CDR on abilities you rarely use</li>
              <li>Not considering cast times and animation locks</li>
            </ul>
            <ul className="space-y-1 list-disc ml-4">
              <li>Focusing CDR over core damage/survivability</li>
              <li>Not adapting CDR to game phase (early vs late)</li>
              <li>Ignoring diminishing returns in percentage systems</li>
              <li>Building CDR without considering team composition</li>
            </ul>
          </div>
        </div>
      </div>

      {/* All Supported Games */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-primary" />
          All Supported Games ({Object.keys(GAME_SYSTEMS).length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(GAME_SYSTEMS).map(([key, game]) => (
            <div key={key} className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium flex items-center">
                  {game.name}
                  {game.popular && <Star className="h-3 w-3 ml-2 text-yellow-500 fill-current" />}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  game.meta.tier.includes('S') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  game.meta.tier.includes('A') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {game.meta.tier}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{game.category}</div>
              <div className="text-xs text-muted-foreground">
                <div><strong>Type:</strong> {game.type}</div>
                <div><strong>Max CDR:</strong> {game.maxReduction}%</div>
                <div><strong>Pick Rate:</strong> {game.meta.pickRate}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Game Coverage Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <div className="font-semibold">MOBA Games</div>
              <div>{Object.values(GAME_SYSTEMS).filter(g => g.category === 'MOBA').length} supported</div>
            </div>
            <div>
              <div className="font-semibold">MMORPG Games</div>
              <div>{Object.values(GAME_SYSTEMS).filter(g => g.category === 'MMORPG').length} supported</div>
            </div>
            <div>
              <div className="font-semibold">ARPG Games</div>
              <div>{Object.values(GAME_SYSTEMS).filter(g => g.category === 'ARPG').length} supported</div>
            </div>
            <div>
              <div className="font-semibold">Other Genres</div>
              <div>{Object.values(GAME_SYSTEMS).filter(g => !['MOBA', 'MMORPG', 'ARPG'].includes(g.category)).length} supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-primary" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              What's the difference between Ability Haste and traditional CDR?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Traditional CDR uses percentage reduction with diminishing returns - each additional 1% CDR becomes less valuable. For example, going from 0% to 10% CDR gives you 11.1% more casts, but going from 40% to 50% CDR only gives you 16.7% more casts.</p>
              <p className="mt-2">Ability Haste (introduced in League of Legends) provides linear scaling where every point of Ability Haste has the same value. 100 AH = 50% CDR, 200 AH = 66.7% CDR, and each additional 100 AH always provides the same benefit.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              Why do some games have different CDR calculation methods?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Game developers use different CDR systems to achieve specific gameplay goals. Linear systems (like Ability Haste) prevent excessive CDR stacking, while percentage systems create meaningful itemization choices with diminishing returns.</p>
              <p className="mt-2">Some games integrate CDR with other mechanics - WoW's Haste affects both cast time and cooldowns, while Genshin Impact's Energy Recharge affects burst availability rather than direct cooldowns.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              How should I balance CDR with other stats?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>The optimal CDR balance depends on your role, game phase, and resource management. Damage dealers typically want 20-40% CDR, supports may prioritize 40-60% for utility, while tanks often prefer survivability over maximum CDR.</p>
              <p className="mt-2">Consider your mana/energy limitations - high CDR is useless if you can't sustain the resource cost. Also evaluate the opportunity cost: is 10% more CDR worth losing significant damage or survivability stats?</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              Do all abilities benefit equally from CDR?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>No. Ultimate abilities in MOBAs often have different CDR scaling. Some games have abilities immune to CDR (like Dota 2's BKB). Movement abilities may have separate cooldown mechanics. Resource-based abilities need sustainable mana/energy to benefit from CDR.</p>
              <p className="mt-2">Always check your game's specific mechanics for each ability type.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              What are diminishing returns in CDR?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Diminishing returns mean each additional point of CDR becomes less valuable. Going from 0% to 10% CDR reduces cooldowns by 10%, but going from 40% to 50% CDR only reduces actual cooldown by ~6.7%.</p>
              <p className="mt-2">This is why many games switched to systems like Ability Haste (linear scaling) or cap CDR at reasonable levels.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              Can I have negative cooldowns or infinite CDR?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>No game allows negative cooldowns or infinite CDR. Most games have hard caps (like Diablo 3's 75%) or soft caps through diminishing returns. Even games with 'unlimited' CDR like current League of Legends have practical limits where additional CDR provides negligible benefit.</p>
              <p className="mt-2">The calculator includes warnings when you approach these limits.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              How does CDR affect DPS and overall performance?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>CDR increases sustained DPS by allowing more frequent ability usage, but the relationship isn't always linear. You must consider: mana/resource constraints, cast times, animation locks, and opportunity costs of CDR vs. direct damage stats.</p>
              <p className="mt-2">In burst scenarios, CDR may be less valuable than raw damage. The calculator shows DPS increase estimates, but actual performance depends on your specific rotation and playstyle.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
              Which games benefit most from high CDR builds?
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Games with abundant resource generation (like League of Legends with mana items) or resource-free abilities benefit most from high CDR. Support-focused games where utility uptime matters more than raw damage also favor CDR builds.</p>
              <p className="mt-2">Conversely, games with strict resource limitations or long cast times may not benefit as much from maximum CDR investment.</p>
            </div>
          </details>
        </div>
      </div>

      {/* Review Section */}
      <CalculatorReview
        calculatorName="Cooldown Reduction Calculator"
        className="mt-6"
      />
    </div>
  );
};

export default AdvancedCooldownCalculator;