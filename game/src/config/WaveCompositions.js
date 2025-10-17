// ============================================================
// Wave Compositions - All 20 Waves with Enemy Compositions
// ============================================================
// Each wave defines which enemies spawn and how many
// Format: { archetype: 'E#_NAME', count: number }
// Waves are spawned in 2-4 pulses to avoid all-at-once blobs

export const WaveCompositions = {
  // ============================================================
  // PHASE 1: INTRODUCTION (Waves 1-5)
  // Focus: Single unit type, player learning
  // ============================================================

  wave1: {
    phase: 'Introduction',
    notes: 'Tutorial pressure - Grunts only',
    enemies: [
      { archetype: 'E1_GRUNT', count: 10 }
    ],
    spawningPulses: 2,
    hasMini: false,
    difficulty: 'Very Easy'
  },

  wave2: {
    phase: 'Introduction',
    notes: 'Introduce ranged pressure',
    enemies: [
      { archetype: 'E1_GRUNT', count: 12 },
      { archetype: 'E3_ARCHER', count: 4 }
    ],
    spawningPulses: 2,
    hasMini: false,
    difficulty: 'Easy'
  },

  wave3: {
    phase: 'Introduction',
    notes: 'Density increases',
    enemies: [
      { archetype: 'E1_GRUNT', count: 18 },
      { archetype: 'E3_ARCHER', count: 4 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Easy'
  },

  wave4: {
    phase: 'Introduction',
    notes: 'First speed threat - Rogues',
    enemies: [
      { archetype: 'E1_GRUNT', count: 20 },
      { archetype: 'E3_ARCHER', count: 6 },
      { archetype: 'E4_ROGUE', count: 2 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Medium'
  },

  wave5: {
    phase: 'Introduction',
    notes: 'First mini-boss: Captain',
    enemies: [
      { archetype: 'E11_CAPTAIN', count: 1, isMini: true },
      { archetype: 'E1_GRUNT', count: 18 },
      { archetype: 'E3_ARCHER', count: 6 }
    ],
    spawningPulses: 4,
    hasMini: true,
    miniBosses: ['E11_CAPTAIN'],
    difficulty: 'Medium-Hard'
  },

  // ============================================================
  // PHASE 2: ESCALATION (Waves 6-10)
  // Focus: New archetypes introduced, mixed combat
  // ============================================================

  wave6: {
    phase: 'Escalation',
    notes: 'Reach melee joins - Spearmen',
    enemies: [
      { archetype: 'E2_SPEARMAN', count: 14 },
      { archetype: 'E3_ARCHER', count: 8 },
      { archetype: 'E4_ROGUE', count: 4 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Medium-Hard'
  },

  wave7: {
    phase: 'Escalation',
    notes: 'Mixed frontlines - Shields introduced',
    enemies: [
      { archetype: 'E1_GRUNT', count: 16 },
      { archetype: 'E2_SPEARMAN', count: 8 },
      { archetype: 'E4_ROGUE', count: 6 },
      { archetype: 'E5_SHIELDBEARER', count: 2 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Medium-Hard'
  },

  wave8: {
    phase: 'Escalation',
    notes: 'AoE pressure - Mages introduced',
    enemies: [
      { archetype: 'E2_SPEARMAN', count: 12 },
      { archetype: 'E3_ARCHER', count: 8 },
      { archetype: 'E8_MAGE', count: 4 },
      { archetype: 'E5_SHIELDBEARER', count: 4 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Hard'
  },

  wave9: {
    phase: 'Escalation',
    notes: 'Focus fire test - Healers introduced',
    enemies: [
      { archetype: 'E4_ROGUE', count: 14 },
      { archetype: 'E5_SHIELDBEARER', count: 6 },
      { archetype: 'E8_MAGE', count: 6 },
      { archetype: 'E9_HEALER', count: 2 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Hard'
  },

  wave10: {
    phase: 'Escalation',
    notes: 'Dodge & burst check - Colossus boss arrives',
    enemies: [
      { archetype: 'E12_COLOSSUS', count: 1, isMini: true },
      { archetype: 'E7_BOMBER', count: 8 },
      { archetype: 'E1_GRUNT', count: 14 },
      { archetype: 'E3_ARCHER', count: 6 }
    ],
    spawningPulses: 4,
    hasMini: true,
    miniBosses: ['E12_COLOSSUS'],
    difficulty: 'Very Hard'
  },

  // ============================================================
  // PHASE 3: COMPLEXITY (Waves 11-15)
  // Focus: All unit types present, varied tactics
  // ============================================================

  wave11: {
    phase: 'Complexity',
    notes: 'Bomb spacing test - Bombers and mixed',
    enemies: [
      { archetype: 'E1_GRUNT', count: 18 },
      { archetype: 'E7_BOMBER', count: 8 },
      { archetype: 'E3_ARCHER', count: 6 },
      { archetype: 'E5_SHIELDBEARER', count: 4 }
    ],
    spawningPulses: 4,
    hasMini: false,
    difficulty: 'Hard'
  },

  wave12: {
    phase: 'Complexity',
    notes: 'Sustain check - Mixed healing pressure',
    enemies: [
      { archetype: 'E2_SPEARMAN', count: 14 },
      { archetype: 'E8_MAGE', count: 6 },
      { archetype: 'E9_HEALER', count: 6 },
      { archetype: 'E5_SHIELDBEARER', count: 4 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Very Hard'
  },

  wave13: {
    phase: 'Complexity',
    notes: 'Mobility check - Fast enemies with elites',
    enemies: [
      { archetype: 'E4_ROGUE', count: 20 },
      { archetype: 'E3_ARCHER', count: 8 },
      { archetype: 'E11_CAPTAIN', count: 2 }
    ],
    spawningPulses: 3,
    hasMini: false,
    difficulty: 'Very Hard'
  },

  wave14: {
    phase: 'Complexity',
    notes: 'Crowd control test - Heavy mixed',
    enemies: [
      { archetype: 'E7_BOMBER', count: 12 },
      { archetype: 'E2_SPEARMAN', count: 12 },
      { archetype: 'E5_SHIELDBEARER', count: 8 },
      { archetype: 'E8_MAGE', count: 4 }
    ],
    spawningPulses: 4,
    hasMini: false,
    difficulty: 'Extreme'
  },

  wave15: {
    phase: 'Complexity',
    notes: 'Spike - Captain duo mini-bosses',
    enemies: [
      { archetype: 'E11_CAPTAIN', count: 2, isMini: true },
      { archetype: 'E1_GRUNT', count: 16 },
      { archetype: 'E2_SPEARMAN', count: 8 },
      { archetype: 'E4_ROGUE', count: 8 },
      { archetype: 'E3_ARCHER', count: 6 }
    ],
    spawningPulses: 4,
    hasMini: true,
    miniBosses: ['E11_CAPTAIN', 'E11_CAPTAIN'],
    difficulty: 'Extreme'
  },

  // ============================================================
  // PHASE 4: ENDURANCE (Waves 16-20)
  // Focus: Sustained pressure, resource management
  // ============================================================

  wave16: {
    phase: 'Endurance',
    notes: 'Add control - Summoner spawners',
    enemies: [
      { archetype: 'E10_SUMMONER', count: 6 },
      { archetype: 'E1_GRUNT', count: 24 }
    ],
    spawningPulses: 4,
    hasMini: false,
    difficulty: 'Extreme'
  },

  wave17: {
    phase: 'Endurance',
    notes: 'Full kit challenge - Elite density high',
    enemies: [
      { archetype: 'E9_HEALER', count: 12 },
      { archetype: 'E8_MAGE', count: 12 },
      { archetype: 'E5_SHIELDBEARER', count: 12 },
      { archetype: 'E4_ROGUE', count: 12 }
    ],
    spawningPulses: 4,
    hasMini: false,
    difficulty: 'Extreme'
  },

  wave18: {
    phase: 'Endurance',
    notes: 'Chaos mix - Everything together',
    enemies: [
      { archetype: 'E7_BOMBER', count: 12 },
      { archetype: 'E2_SPEARMAN', count: 12 },
      { archetype: 'E3_ARCHER', count: 12 },
      { archetype: 'E1_GRUNT', count: 12 },
      { archetype: 'E11_CAPTAIN', count: 4 }
    ],
    spawningPulses: 4,
    hasMini: false,
    difficulty: 'Extreme'
  },

  wave19: {
    phase: 'Endurance',
    notes: 'Pre-final gauntlet - Everything at once',
    enemies: [
      { archetype: 'E10_SUMMONER', count: 4 },
      { archetype: 'E4_ROGUE', count: 16 },
      { archetype: 'E5_SHIELDBEARER', count: 16 },
      { archetype: 'E8_MAGE', count: 8 },
      { archetype: 'E7_BOMBER', count: 8 }
    ],
    spawningPulses: 4,
    hasMini: false,
    difficulty: 'Extreme'
  },

  wave20: {
    phase: 'Endurance',
    notes: 'Final - Colossus duo + massive mixed',
    enemies: [
      { archetype: 'E12_COLOSSUS', count: 2, isMini: true },
      { archetype: 'E1_GRUNT', count: 14 },
      { archetype: 'E2_SPEARMAN', count: 8 },
      { archetype: 'E3_ARCHER', count: 4 },
      { archetype: 'E4_ROGUE', count: 4 }
    ],
    spawningPulses: 4,
    hasMini: true,
    miniBosses: ['E12_COLOSSUS', 'E12_COLOSSUS'],
    difficulty: 'ULTIMATE'
  },

  // ============================================================
  // ULTIMATE CHALLENGE (Wave 21)
  // Focus: One of each archetype - test all unit abilities
  // ============================================================

  wave21: {
    phase: 'Ultimate Challenge',
    notes: 'Lancer Squadron - One lancer of each color faction',
    enemies: [
      { archetype: 'E13_LANCER_RED', count: 1, isMini: true },
      { archetype: 'E14_LANCER_BLUE', count: 1, isMini: true },
      { archetype: 'E15_LANCER_YELLOW', count: 1, isMini: true },
      { archetype: 'E16_LANCER_BLACK', count: 1, isMini: true }
    ],
    spawningPulses: 1,
    hasMini: true,
    miniBosses: ['E13_LANCER_RED', 'E14_LANCER_BLUE', 'E15_LANCER_YELLOW', 'E16_LANCER_BLACK'],
    difficulty: 'LEGEND'
  }
};

// Helper to get wave by number
export function getWaveComposition(waveNumber) {
  const waveKey = `wave${waveNumber}`;
  return WaveCompositions[waveKey] || null;
}

// Helper to count total enemies in a wave
export function getWaveTotalEnemyCount(waveNumber) {
  const wave = getWaveComposition(waveNumber);
  if (!wave) return 0;
  return wave.enemies.reduce((sum, enemy) => sum + enemy.count, 0);
}

// Helper to flatten enemies for spawning
export function getWaveEnemyList(waveNumber) {
  const wave = getWaveComposition(waveNumber);
  if (!wave) return [];

  const enemies = [];
  wave.enemies.forEach(({ archetype, count, isMini }) => {
    for (let i = 0; i < count; i++) {
      enemies.push({ archetype, isMini: isMini || false });
    }
  });
  return enemies;
}
