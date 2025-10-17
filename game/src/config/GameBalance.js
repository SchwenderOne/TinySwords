// ============================================================
// Game Balance Configuration
// ============================================================
// Central location for all game tuning values
// Modify these to adjust gameplay without hunting through code

export const GameBalance = {
  // ============================================================
  // PLAYER STATS
  // ============================================================
  player: {
    warrior: {
      startHealth: 100,
      startDamage: 20,
      moveSpeed: 200,
      healthPerLevel: 20,
      damagePerLevel: 5,
      attackRange: 60,
      guardDamageReduction: 0.5 // 50% damage reduction when guarding
    }
  },
  
  // ============================================================
  // ALLY STATS (for future phases)
  // ============================================================
  allies: {
    warrior: {
      health: 80,
      damage: 12,
      moveSpeed: 150,
      attackRange: 80,
      followDistance: 120,
      assistRadius: 200
    },
    monk: {
      health: 60,
      healAmount: 20,
      moveSpeed: 140,
      healRange: 160,
      healCooldown: 4000,
      followDistance: 100,
      assistRadius: 200
    }
  },
  
  // ============================================================
  // ENEMY STATS
  // ============================================================
  enemies: {
    warrior: {
      health: 100,
      damage: 10,
      moveSpeed: 120,
      attackRange: 100,
      detectionRange: 300,
      attackCooldown: 1500,
      xpReward: 50
    },
    archer: {
      health: 60,
      damage: 8,
      moveSpeed: 0, // Stationary
      attackRange: 400,
      detectionRange: 450,
      attackCooldown: 2000,
      projectileSpeed: 300,
      xpReward: 30
    }
  },
  
  // ============================================================
  // PROGRESSION SYSTEM
  // ============================================================
  progression: {
    maxLevel: 20,
    xpPerLevel: 100, // Multiplied by level (100, 200, 300, etc.)
    abilityUnlockLevels: [3, 5, 8, 10, 13, 16, 18, 20] // Levels that unlock abilities
  },
  
  // ============================================================
  // BUILDINGS
  // ============================================================
  buildings: {
    interactionRadius: 100, // Distance to show "Press E" prompt
    spawnCooldown: 20000 // 20 seconds in milliseconds
  },
  
  // ============================================================
  // ENEMY ARCHETYPES (12 types with stat multipliers)
  // ============================================================
  // Base: Red Warrior = 100 HP, 8 DMG, 100 MS
  enemyArchetypes: {
    E1_GRUNT: {
      name: 'Grunt',
      baseUnit: 'warrior',
      hpMultiplier: 1.0,
      dmgMultiplier: 1.0,
      msMultiplier: 1.0,
      arMultiplier: 1.0,
      scale: 1.0,
      tint: 0xff0000,
      special: 'none',
      xpWeight: 1.0
    },
    E2_SPEARMAN: {
      name: 'Spearman',
      baseUnit: 'warrior',
      hpMultiplier: 1.1,
      dmgMultiplier: 1.1,
      msMultiplier: 0.95,
      arMultiplier: 1.0,
      scale: 1.0,
      tint: 0xff3300,
      special: 'reach', // +20px range
      xpWeight: 1.1
    },
    E3_ARCHER: {
      name: 'Archer',
      baseUnit: 'archer',
      hpMultiplier: 0.8,
      dmgMultiplier: 0.9,
      msMultiplier: 0.95,
      arMultiplier: 1.0,
      scale: 0.95,
      tint: 0xff0000,
      special: 'ranged',
      xpWeight: 1.0
    },
    E4_ROGUE: {
      name: 'Rogue',
      baseUnit: 'warrior',
      hpMultiplier: 0.6,
      dmgMultiplier: 1.1,
      msMultiplier: 1.2,
      arMultiplier: 1.0,
      scale: 0.85,
      tint: 0xff6600,
      special: 'speed',
      xpWeight: 1.0
    },
    E5_SHIELDBEARER: {
      name: 'Shieldbearer',
      baseUnit: 'warrior',
      hpMultiplier: 1.6,
      dmgMultiplier: 0.8,
      msMultiplier: 0.75,
      arMultiplier: 2.0, // 2 armor reduction
      scale: 1.2,
      tint: 0x996633,
      special: 'armor',
      xpWeight: 1.2
    },
    E6_HEAVY_KNIGHT: {
      name: 'Heavy Knight',
      baseUnit: 'warrior',
      hpMultiplier: 2.2,
      dmgMultiplier: 1.6,
      msMultiplier: 0.6,
      arMultiplier: 1.0,
      scale: 1.4,
      tint: 0x333333,
      special: 'knockback',
      xpWeight: 1.6
    },
    E7_BOMBER: {
      name: 'Bomber',
      baseUnit: 'archer',
      hpMultiplier: 0.9,
      dmgMultiplier: 2.5,
      msMultiplier: 1.1,
      arMultiplier: 1.0,
      scale: 0.9,
      tint: 0xff0000,
      special: 'bomber', // Explodes on death
      xpWeight: 1.5
    },
    E8_MAGE: {
      name: 'Mage',
      baseUnit: 'archer',
      hpMultiplier: 0.9,
      dmgMultiplier: 1.2,
      msMultiplier: 0.9,
      arMultiplier: 1.0,
      scale: 0.95,
      tint: 0x3366ff,
      special: 'mage', // AoE projectiles
      xpWeight: 1.1
    },
    E9_HEALER: {
      name: 'Healer',
      baseUnit: 'archer',
      hpMultiplier: 0.9,
      dmgMultiplier: 0.4,
      msMultiplier: 0.9,
      arMultiplier: 1.0,
      scale: 0.95,
      tint: 0x00ff00,
      special: 'healer', // Heals nearby enemies
      xpWeight: 1.2
    },
    E10_SUMMONER: {
      name: 'Summoner',
      baseUnit: 'archer',
      hpMultiplier: 1.4,
      dmgMultiplier: 0.7,
      msMultiplier: 0.85,
      arMultiplier: 1.0,
      scale: 1.0,
      tint: 0xff00ff,
      special: 'summoner', // Spawns adds
      xpWeight: 1.3
    },
    E11_CAPTAIN: {
      name: 'Captain',
      baseUnit: 'warrior',
      hpMultiplier: 2.0,
      dmgMultiplier: 1.6,
      msMultiplier: 0.95,
      arMultiplier: 1.0,
      scale: 1.2,
      tint: 0xffcc00,
      special: 'captain', // Buffs nearby enemies +10% DMG
      xpWeight: 2.0
    },
    E12_COLOSSUS: {
      name: 'Colossus',
      baseUnit: 'warrior',
      hpMultiplier: 8.0,
      dmgMultiplier: 3.0,
      msMultiplier: 0.55,
      arMultiplier: 1.0,
      scale: 2.0,
      tint: 0x9900ff,
      special: 'colossus', // Massive knockback, slow
      xpWeight: 8.0
    }
  },

  // ============================================================
  // WAVE SCALING SYSTEM
  // ============================================================
  waveScaling: {
    baseEnemyHealth: 100, // Grunt wave 1
    baseEnemyDamage: 8,
    hpPerWave: 1.12, // Multiplicative: 1.12^wave
    dmgPerWave: 0.6, // Additive: base + (0.6 * wave)
    msBoostWaves: [6, 11, 16], // Waves where MS increases +1%
    eliteStartWave: 5,
    eliteSpawnChance: 0.2, // 20% chance per enemy to be elite
    eliteMultipliers: {
      hp: 1.6,
      dmg: 1.25,
      xpBonus: 1.5
    }
  },

  // ============================================================
  // WAVE SYSTEM
  // ============================================================
  waves: {
    maxWaves: 21,
    restPeriod: 5000, // 5 seconds between waves
    castleGatePosition: { x: 2310, y: 1850 }, // Front of castle
    spawnRadius: 150, // Radius around castle gate for spawns
    difficultyScaling: {
      warriorBaseCount: 2,
      warriorPerWave: 0.5, // +0.5 warriors per wave
      archerBaseCount: 1,
      archerPerWave: 0.33, // +0.33 archers per wave
      maxWarriors: 6,
      maxArchers: 4
    }
  },
  
  // ============================================================
  // ITEMS
  // ============================================================
  items: {
    healthPotion: {
      healAmount: 30,
      dropChance: 0.3 // 30% chance
    }
  },
  
  // ============================================================
  // MAP & SPAWNS
  // ============================================================
  map: {
    width: 6496,
    height: 6640,
    playerSpawn: { x: 2310, y: 2040 },
    cameraZoom: 1.5
  }
};

