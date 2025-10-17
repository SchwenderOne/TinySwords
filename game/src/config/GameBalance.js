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
    maxLevel: 10,
    xpPerLevel: 100, // Multiplied by level (100, 200, 300, etc.)
    abilityUnlockLevels: [3, 5, 8, 10] // Levels that unlock abilities
  },
  
  // ============================================================
  // BUILDINGS (for future phases)
  // ============================================================
  buildings: {
    interactionRadius: 100, // Distance to show "Press E" prompt
    spawnCooldown: 30000 // 30 seconds in milliseconds
  },
  
  // ============================================================
  // WAVE SYSTEM
  // ============================================================
  waves: {
    maxWaves: 5,
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

