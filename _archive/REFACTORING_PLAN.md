# 🔄 Comprehensive Refactoring Plan
## Pivoting to Survivors-Like Game Architecture

**Date:** October 2025  
**Objective:** Transform current character-switching wave game into survivors-like experience per MVP spec

---

## 📊 Executive Summary

### Current State Health: ⚠️ **Moderate - Requires Structural Changes**

**Strengths:**
- ✅ Solid foundation: Clean entity system, good separation of concerns
- ✅ Physics & collision working well (terrain, buildings, trees)
- ✅ Animation system robust and extensible
- ✅ Visual feedback systems (floating text, particles) production-ready
- ✅ Enemy AI state machine well-structured

**Critical Gaps for Survivors-Like:**
- ❌ No building interaction system
- ❌ No AI-controlled ally system
- ❌ No ability unlock progression
- ❌ No meta-progression framework
- ❌ Character switching paradigm incompatible with single-hero gameplay
- ❌ Enemy spawning not centralized around castle

**Estimated Refactor Scope:** Medium-Large (40-60% code modification/addition)

---

## 🎯 Gap Analysis: Current vs MVP Spec

| Feature | Current State | Target State | Priority | Complexity |
|---------|--------------|--------------|----------|------------|
| **Player Control** | Manual switch between Warrior/Monk | Single Warrior only | 🔴 High | Low |
| **Ally System** | N/A | AI-controlled allies from buildings | 🔴 High | High |
| **Building Interaction** | Decorative only | Spawn allies (30s cooldown) | 🔴 High | Medium |
| **Enemy Spawning** | Perimeter (8 positions) | Castle gate area only | 🔴 High | Low |
| **Leveling** | Stats only (cap 10) | Stats + Ability unlocks (3/5/8/10) | 🔴 High | Medium |
| **Abilities** | Attack1/2, Guard, Heal | New abilities from asset pack | 🟡 Medium | Medium |
| **Meta Progression** | None | Currency, unlocks, persistence | 🟡 Medium | High |
| **Run Structure** | Restart on death | Post-run summary → meta | 🟡 Medium | Medium |
| **Wave System** | Working (10 waves) | Working (adjust difficulty) | 🟢 Low | Low |
| **Collision System** | Excellent | Keep as-is | ✅ Done | N/A |

---

## 🏗️ Architecture Recommendations

### 1. **Entity Hierarchy Refactor** (Priority: 🔴 Critical)

**Current Problem:**
- `Player` and `Monk` are parallel classes with duplicate code
- Both are player-controllable characters
- XP/leveling duplicated across both

**Proposed Solution:**
```
BaseCharacter (abstract)
├── stats, health, xp, leveling
├── animation management
├── common movement logic
│
├─ PlayableCharacter (Warrior)
│   ├── input handling
│   ├── ability system
│   └── player-specific logic
│
└─ AllyCharacter (Monk, Warrior variants)
    ├── AI controller
    ├── follow/assist behaviors
    └── ally-specific logic
```

**Benefits:**
- Eliminates 40% code duplication
- Single source of truth for character mechanics
- Easy to add new character types
- Clean separation: input vs AI control

**Implementation Steps:**
1. Create `src/entities/BaseCharacter.js` with shared logic
2. Extract common methods: `takeDamage()`, `heal()`, `gainXP()`, `levelUp()`
3. Refactor `Player.js` → `PlayableCharacter.js` extending `BaseCharacter`
4. Create `AllyCharacter.js` extending `BaseCharacter`
5. Migrate `Monk.js` to `AllyMonk.js` using `AllyCharacter`

---

### 2. **Building Interaction System** (Priority: 🔴 Critical)

**Current Problem:**
- Buildings are static sprites with collision only
- No interaction detection or UI
- No cooldown management

**Proposed Solution:**

```javascript
// src/entities/InteractiveBuilding.js
class InteractiveBuilding extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type) {
    // type: 'house', 'tower', 'castle'
    this.type = type;
    this.cooldown = 0;
    this.maxCooldown = 30000; // 30 seconds
    this.interactionRadius = 100;
    this.isActive = true;
    
    // Visual feedback
    this.interactionPrompt = null; // "Press E to spawn ally"
    this.cooldownBar = null;
  }
  
  update(delta, player) {
    // Update cooldown
    if (this.cooldown > 0) {
      this.cooldown -= delta;
      this.updateCooldownBar();
    }
    
    // Check player proximity
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, player.x, player.y
    );
    
    if (distance <= this.interactionRadius) {
      this.showInteractionPrompt();
    } else {
      this.hideInteractionPrompt();
    }
  }
  
  interact() {
    if (this.cooldown > 0) return false;
    
    this.cooldown = this.maxCooldown;
    this.spawnAlly();
    return true;
  }
  
  spawnAlly() {
    // Type-specific spawning
    if (this.type === 'house') {
      return new AllyWarrior(this.scene, this.x, this.y);
    } else if (this.type === 'tower') {
      return new AllyMonk(this.scene, this.x, this.y);
    }
  }
}
```

**Integration with GameScene:**
```javascript
// GameScene.js refactor
createBuildings() {
  // Replace static sprites with InteractiveBuilding
  this.interactiveBuildings = [];
  
  // Castle (landmark, not interactive in MVP)
  this.castle = new Building(this, 2310, 1720, 'castle');
  this.enemySpawnPoint = { x: 2310, y: 1850 }; // Front of castle
  
  // Houses (spawn warriors)
  this.interactiveBuildings.push(
    new InteractiveBuilding(this, 1750, 2450, 'house'),
    new InteractiveBuilding(this, 2850, 2450, 'house'),
    new InteractiveBuilding(this, 2100, 1950, 'house'),
    new InteractiveBuilding(this, 2500, 2300, 'house')
  );
  
  // Towers (spawn monks)
  this.interactiveBuildings.push(
    new InteractiveBuilding(this, 1850, 2150, 'tower'),
    new InteractiveBuilding(this, 2750, 2150, 'tower')
  );
}

update(time, delta) {
  // Update buildings
  this.interactiveBuildings.forEach(building => {
    building.update(delta, this.player);
  });
  
  // Check for E key press
  if (this.keys.E.isDown) {
    this.interactiveBuildings.forEach(building => {
      if (building.canInteract(this.player)) {
        const ally = building.interact();
        if (ally) {
          this.allies.add(ally);
        }
      }
    });
  }
}
```

**UI Requirements:**
- Proximity indicator: "Press E" text above building
- Cooldown bar: Visual progress bar showing 30s timer
- Particle effect on successful spawn

---

### 3. **AI Ally System** (Priority: 🔴 Critical)

**Current Problem:**
- No ally AI logic exists
- Monk only player-controlled

**Proposed Solution:**

```javascript
// src/entities/AllyCharacter.js
export default class AllyCharacter extends BaseCharacter {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    
    this.aiState = 'follow'; // follow, assist, engage
    this.leader = scene.player; // Follow player
    this.followDistance = 120;
    this.assistRadius = 200;
    this.currentTarget = null;
  }
  
  update(time, delta) {
    super.update(time, delta);
    this.updateAI();
  }
  
  updateAI() {
    switch(this.aiState) {
      case 'follow':
        this.followLeader();
        this.checkForEnemies();
        break;
      case 'engage':
        this.engageEnemy();
        break;
      case 'assist':
        this.assistLeader();
        break;
    }
  }
  
  followLeader() {
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, this.leader.x, this.leader.y
    );
    
    // Stay within follow distance
    if (distance > this.followDistance) {
      this.moveTowards(this.leader.x, this.leader.y);
    } else {
      this.body.setVelocity(0, 0);
    }
  }
  
  checkForEnemies() {
    // Find nearest enemy within assist radius
    const enemies = this.scene.enemies.getChildren();
    let nearestEnemy = null;
    let nearestDistance = Infinity;
    
    enemies.forEach(enemy => {
      if (!enemy.active) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.x, this.y, enemy.x, enemy.y
      );
      
      if (distance < this.assistRadius && distance < nearestDistance) {
        nearestEnemy = enemy;
        nearestDistance = distance;
      }
    });
    
    if (nearestEnemy) {
      this.currentTarget = nearestEnemy;
      this.aiState = 'engage';
    }
  }
  
  engageEnemy() {
    if (!this.currentTarget || !this.currentTarget.active) {
      this.currentTarget = null;
      this.aiState = 'follow';
      return;
    }
    
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, 
      this.currentTarget.x, this.currentTarget.y
    );
    
    if (distance > this.assistRadius * 1.5) {
      // Too far, return to follow
      this.currentTarget = null;
      this.aiState = 'follow';
      return;
    }
    
    if (distance > this.attackRange) {
      // Move closer
      this.moveTowards(this.currentTarget.x, this.currentTarget.y);
    } else {
      // In range, attack
      this.attackTarget(this.currentTarget);
    }
  }
}

// src/entities/AllyWarrior.js
export default class AllyWarrior extends AllyCharacter {
  constructor(scene, x, y) {
    super(scene, x, y, 'ally-warrior');
    
    this.health = 80; // Less than player
    this.maxHealth = 80;
    this.moveSpeed = 150;
    this.attackDamage = 12;
    this.attackRange = 80;
  }
}

// src/entities/AllyMonk.js
export default class AllyMonk extends AllyCharacter {
  constructor(scene, x, y) {
    super(scene, x, y, 'ally-monk');
    
    this.health = 60;
    this.maxHealth = 60;
    this.moveSpeed = 140;
    this.healAmount = 20;
    this.healRange = 160;
    this.healCooldown = 0;
    this.aiState = 'follow'; // Monks follow and heal
  }
  
  updateAI() {
    // Check if leader is damaged
    if (this.leader.health < this.leader.maxHealth) {
      const distance = Phaser.Math.Distance.Between(
        this.x, this.y, this.leader.x, this.leader.y
      );
      
      if (distance <= this.healRange && this.healCooldown <= 0) {
        this.healLeader();
        return;
      }
    }
    
    // Default follow behavior
    this.followLeader();
  }
  
  healLeader() {
    this.healCooldown = 4000; // 4 second cooldown
    this.performHeal(this.leader);
    // Use heal animation
    this.play('ally-monk-heal');
  }
}
```

**GameScene Integration:**
```javascript
create() {
  // Create allies group
  this.allies = this.physics.add.group();
  
  // Collision: allies vs enemies
  this.physics.add.collider(this.allies, this.enemies);
  
  // Collision: allies vs environment
  this.physics.add.collider(this.allies, this.buildingsGroup);
  this.physics.add.collider(this.allies, this.treesGroup);
}

update(time, delta) {
  // Update all allies
  this.allies.getChildren().forEach(ally => {
    if (ally.active) {
      ally.update(time, delta);
    }
  });
}
```

---

### 4. **Ability System** (Priority: 🔴 High)

**Current Problem:**
- No ability unlock mechanic
- Hard-coded attacks only
- Spec requires new abilities at levels 3, 5, 8, 10

**Proposed Solution:**

```javascript
// src/systems/AbilitySystem.js
export default class AbilitySystem {
  constructor(character) {
    this.character = character;
    this.abilities = [];
    this.activeAbilities = [];
    this.abilitySlots = 4; // Max abilities at once
  }
  
  // Define ability pool from slash effect assets
  getAbilityPool() {
    return [
      {
        id: 'slash1',
        name: 'Power Slash',
        level: 3,
        damage: 35,
        cooldown: 2000,
        range: 100,
        animation: 'slash1', // From craftpix slash pack
        description: '+40% damage, cone attack'
      },
      {
        id: 'slash2',
        name: 'Whirlwind',
        level: 5,
        damage: 25,
        cooldown: 4000,
        range: 120,
        animation: 'slash2',
        description: '360° spin attack'
      },
      {
        id: 'dash',
        name: 'Battle Charge',
        level: 8,
        cooldown: 6000,
        range: 200,
        animation: 'slash5',
        description: 'Dash forward, damage all enemies'
      },
      {
        id: 'ultimate',
        name: 'Titan Strike',
        level: 10,
        damage: 100,
        cooldown: 20000,
        range: 150,
        animation: 'slash10',
        description: 'Massive AoE ultimate'
      }
    ];
  }
  
  unlockAbility(level) {
    const pool = this.getAbilityPool();
    const newAbility = pool.find(a => a.level === level);
    
    if (newAbility) {
      this.abilities.push(newAbility);
      this.showAbilityUnlockUI(newAbility);
      return newAbility;
    }
  }
  
  useAbility(abilityId) {
    const ability = this.abilities.find(a => a.id === abilityId);
    if (!ability || ability.onCooldown) return false;
    
    ability.onCooldown = true;
    this.executeAbility(ability);
    
    // Start cooldown
    setTimeout(() => {
      ability.onCooldown = false;
    }, ability.cooldown);
    
    return true;
  }
  
  executeAbility(ability) {
    // Spawn effect sprite from slash pack
    const effect = this.character.scene.add.sprite(
      this.character.x, 
      this.character.y, 
      ability.animation
    );
    effect.setDepth(10);
    effect.play(ability.animation);
    
    // Create hitbox for damage
    this.createAbilityHitbox(ability);
    
    effect.once('animationcomplete', () => {
      effect.destroy();
    });
  }
  
  showAbilityUnlockUI(ability) {
    // Pause game, show modal
    const scene = this.character.scene;
    scene.physics.pause();
    
    // Create level-up panel
    const panel = scene.add.container(512, 384);
    panel.setDepth(300);
    
    const bg = scene.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
    const title = scene.add.text(0, -150, '⚡ ABILITY UNLOCKED!', {
      font: 'bold 32px Arial',
      fill: '#ffd700'
    }).setOrigin(0.5);
    
    const abilityName = scene.add.text(0, -80, ability.name, {
      font: 'bold 28px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    const description = scene.add.text(0, -20, ability.description, {
      font: '20px Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);
    
    // Show effect preview
    const preview = scene.add.sprite(0, 60, ability.animation);
    preview.setScale(1.5);
    preview.play(ability.animation);
    
    const continueText = scene.add.text(0, 160, 'Press SPACE to continue', {
      font: '18px Arial',
      fill: '#aaaaaa'
    }).setOrigin(0.5);
    
    panel.add([bg, title, abilityName, description, preview, continueText]);
    
    // Wait for input
    scene.input.keyboard.once('keydown-SPACE', () => {
      panel.destroy();
      scene.physics.resume();
    });
  }
}

// Integration into PlayableCharacter
class PlayableCharacter extends BaseCharacter {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.abilitySystem = new AbilitySystem(this);
    
    // Map abilities to number keys
    this.abilityKeys = {
      ONE: 'slash1',
      TWO: 'slash2',
      THREE: 'dash',
      FOUR: 'ultimate'
    };
  }
  
  handleInput() {
    // ... existing movement code ...
    
    // Ability inputs
    if (this.keys.ONE.isDown) {
      this.abilitySystem.useAbility('slash1');
    }
    if (this.keys.TWO.isDown) {
      this.abilitySystem.useAbility('slash2');
    }
    // ... etc
  }
  
  levelUp() {
    super.levelUp();
    
    // Check for ability unlock
    if ([3, 5, 8, 10].includes(this.level)) {
      this.abilitySystem.unlockAbility(this.level);
    }
  }
}
```

**Asset Requirements:**
- Load all 10 slash effects from `craftpix-net-825597-free-slash-effects-sprite-pack`
- Create animations in BootScene
- Map abilities to effects

---

### 5. **Enemy Spawn System Refactor** (Priority: 🔴 High)

**Current Problem:**
- Enemies spawn from 8 fixed perimeter positions
- Spec requires castle gate spawning

**Proposed Solution:**

```javascript
// GameScene.js
createCastleSpawnZone() {
  // Castle is at (2310, 1720)
  // Front gate is ~130px below castle base
  this.castleGatePosition = { x: 2310, y: 1850 };
  this.spawnRadius = 150; // Enemies spawn in 150px radius around gate
}

startWave() {
  this.waveInProgress = true;
  
  const warriorCount = Math.min(2 + Math.floor(this.currentWave / 2), 6);
  const archerCount = Math.min(1 + Math.floor(this.currentWave / 3), 4);
  
  // Spawn from castle gate
  for (let i = 0; i < warriorCount; i++) {
    const spawnPos = this.getRandomSpawnPosition();
    this.spawnEnemy('warrior', spawnPos.x, spawnPos.y);
  }
  
  for (let i = 0; i < archerCount; i++) {
    const spawnPos = this.getRandomSpawnPosition();
    this.spawnEnemy('archer', spawnPos.x, spawnPos.y);
  }
  
  this.showWaveMessage(`Wave ${this.currentWave} - Fight!`);
}

getRandomSpawnPosition() {
  // Random position in radius around castle gate
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * this.spawnRadius;
  
  return {
    x: this.castleGatePosition.x + Math.cos(angle) * distance,
    y: this.castleGatePosition.y + Math.sin(angle) * distance
  };
}
```

**Benefits:**
- Centralized danger zone (matches survivors-like tension)
- Player can position strategically
- Clearer visual focus on castle

---

### 6. **Meta Progression System** (Priority: 🟡 Medium)

**Proposed Solution:**

```javascript
// src/systems/MetaProgressionSystem.js
export default class MetaProgressionSystem {
  constructor() {
    this.loadData();
  }
  
  loadData() {
    const saved = localStorage.getItem('tinyswords_meta');
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = {
        currency: 0,
        totalRuns: 0,
        highestWave: 0,
        unlockedCharacters: ['warrior'], // Start with warrior
        unlockedUpgrades: [],
        stats: {
          totalKills: 0,
          totalDamage: 0,
          totalHealing: 0
        }
      };
    }
  }
  
  saveData() {
    localStorage.setItem('tinyswords_meta', JSON.stringify(this.data));
  }
  
  endRun(stats) {
    // Calculate currency earned
    const baseCurrency = stats.waveReached * 10;
    const killBonus = stats.enemiesKilled * 2;
    const survivalBonus = stats.survivalTime / 1000; // 1 per second
    
    const totalCurrency = Math.floor(baseCurrency + killBonus + survivalBonus);
    
    this.data.currency += totalCurrency;
    this.data.totalRuns++;
    this.data.highestWave = Math.max(this.data.highestWave, stats.waveReached);
    this.data.stats.totalKills += stats.enemiesKilled;
    
    this.saveData();
    
    return {
      currency: totalCurrency,
      totalCurrency: this.data.currency
    };
  }
  
  canAfford(cost) {
    return this.data.currency >= cost;
  }
  
  purchase(itemId, cost) {
    if (!this.canAfford(cost)) return false;
    
    this.data.currency -= cost;
    this.saveData();
    return true;
  }
}

// GameScene.js integration
gameOver() {
  if (this.gameOverShown) return;
  this.gameOverShown = true;
  
  // Collect run stats
  const runStats = {
    waveReached: this.currentWave,
    enemiesKilled: this.enemiesKilled || 0,
    survivalTime: this.time.now,
    damageDealt: this.player.totalDamageDealt || 0
  };
  
  // Calculate meta rewards
  const metaSystem = new MetaProgressionSystem();
  const rewards = metaSystem.endRun(runStats);
  
  // Show detailed end screen
  this.showEndScreen(runStats, rewards);
}

showEndScreen(stats, rewards) {
  const width = this.cameras.main.width;
  const height = this.cameras.main.height;
  
  const bg = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9);
  bg.setScrollFactor(0);
  bg.setDepth(200);
  
  const title = this.add.text(width/2, 100, 'RUN COMPLETE', {
    font: 'bold 48px Arial',
    fill: '#ffd700'
  });
  title.setOrigin(0.5);
  title.setScrollFactor(0);
  title.setDepth(201);
  
  // Stats display
  const statsText = [
    `Wave Reached: ${stats.waveReached}`,
    `Enemies Defeated: ${stats.enemiesKilled}`,
    `Survival Time: ${Math.floor(stats.survivalTime / 1000)}s`,
    ``,
    `💰 Currency Earned: ${rewards.currency}`,
    `💰 Total Currency: ${rewards.totalCurrency}`
  ].join('\n');
  
  const statsDisplay = this.add.text(width/2, height/2, statsText, {
    font: '24px Arial',
    fill: '#ffffff',
    align: 'center',
    lineSpacing: 10
  });
  statsDisplay.setOrigin(0.5);
  statsDisplay.setScrollFactor(0);
  statsDisplay.setDepth(201);
  
  const continueText = this.add.text(width/2, height - 80, 
    'Press R to Restart | Press M for Meta Menu', {
    font: '18px Arial',
    fill: '#aaaaaa'
  });
  continueText.setOrigin(0.5);
  continueText.setScrollFactor(0);
  continueText.setDepth(201);
  
  // Input handlers
  this.input.keyboard.once('keydown-R', () => {
    this.scene.restart();
  });
  
  this.input.keyboard.once('keydown-M', () => {
    this.scene.start('MetaMenuScene');
  });
}
```

---

## 📋 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
**Goal:** Establish new architecture without breaking existing game

1. **Create Base Classes**
   - [ ] `BaseCharacter.js` with shared logic
   - [ ] Extract common methods from Player/Monk
   - [ ] Test: Ensure Player still works identically

2. **Refactor Player**
   - [ ] Rename `Player.js` → `PlayableCharacter.js`
   - [ ] Extend `BaseCharacter`
   - [ ] Remove duplicated code
   - [ ] Test: All existing Player behaviors work

3. **Remove Character Switching**
   - [ ] Delete Monk as playable option
   - [ ] Remove ESC menu system
   - [ ] Simplify GameScene.update() 
   - [ ] Test: Game runs with Warrior only

**Deliverable:** Simplified single-character game with cleaner code

---

### Phase 2: Ally System (Week 3-4)
**Goal:** AI-controlled allies functional

1. **Create Ally AI**
   - [ ] `AllyCharacter.js` extending `BaseCharacter`
   - [ ] Implement follow behavior
   - [ ] Implement engage behavior
   - [ ] Test: Manually spawned ally follows and attacks

2. **Ally Variants**
   - [ ] `AllyWarrior.js` with melee combat
   - [ ] `AllyMonk.js` with heal behavior
   - [ ] Load blue/yellow unit sprites for variety
   - [ ] Test: Both ally types function correctly

3. **Ally Management**
   - [ ] Add allies group to GameScene
   - [ ] Implement ally collision with enemies/environment
   - [ ] Ally health bars (optional)
   - [ ] Test: Multiple allies work together

**Deliverable:** Functional AI allies that assist player

---

### Phase 3: Building Interactions (Week 5-6)
**Goal:** Buildings spawn allies with cooldowns

1. **Interactive Building Class**
   - [ ] `InteractiveBuilding.js` with cooldown system
   - [ ] Proximity detection
   - [ ] Interaction prompts ("Press E")
   - [ ] Test: Can interact with building

2. **Building Integration**
   - [ ] Refactor GameScene.createBuildings()
   - [ ] Add E key handler
   - [ ] Implement 30s cooldown visual feedback
   - [ ] Test: All 6 buildings spawn correct allies

3. **Polish**
   - [ ] Spawn particle effects
   - [ ] Cooldown bar UI above buildings
   - [ ] Sound effects (if time permits)

**Deliverable:** Full building → ally spawn loop

---

### Phase 4: Abilities & Leveling (Week 7-8)
**Goal:** Ability unlocks at levels 3/5/8/10

1. **Ability System**
   - [ ] `AbilitySystem.js` framework
   - [ ] Load slash effect sprite sheets
   - [ ] Create ability animations in BootScene
   - [ ] Test: Can manually trigger abilities

2. **Ability Integration**
   - [ ] Hook into PlayableCharacter.levelUp()
   - [ ] Ability unlock UI panels
   - [ ] Number key bindings (1-4)
   - [ ] Cooldown indicators
   - [ ] Test: Unlock progression 3→5→8→10

3. **Balance**
   - [ ] Tune ability damage/cooldowns
   - [ ] Adjust XP curve if needed
   - [ ] Test full 1→10 progression

**Deliverable:** Complete ability progression system

---

### Phase 5: Enemy Spawn & Wave Tuning (Week 9)
**Goal:** Enemies spawn from castle gate, difficulty balanced

1. **Spawn System Refactor**
   - [ ] Replace perimeter spawns with castle gate spawns
   - [ ] Implement spawn radius around gate
   - [ ] Test: Visual confirmation enemies come from gate

2. **Wave Balance**
   - [ ] Adjust enemy counts for ally assistance
   - [ ] Tune difficulty curve
   - [ ] Test: Playable from wave 1 to victory

**Deliverable:** Balanced survivors-like wave experience

---

### Phase 6: Meta Progression (Week 10-11)
**Goal:** Run persistence and meta currency

1. **Meta System**
   - [ ] `MetaProgressionSystem.js` with localStorage
   - [ ] Run stats tracking
   - [ ] Currency calculation
   - [ ] Test: Data persists between runs

2. **End Screen**
   - [ ] Enhanced game over screen with stats
   - [ ] Currency display
   - [ ] Post-run options (restart, meta menu)
   - [ ] Test: Full run → end → currency awarded

3. **Meta Menu Scene (MVP)**
   - [ ] Basic upgrade shop UI
   - [ ] Placeholder upgrades (HP+, Damage+)
   - [ ] Purchase with currency
   - [ ] Test: Can buy upgrades, persist

**Deliverable:** Basic meta loop functional

---

### Phase 7: Polish & Testing (Week 12)
**Goal:** Production-ready pivot

1. **Bug Fixing**
   - [ ] Test full gameplay loop 10+ times
   - [ ] Fix edge cases
   - [ ] Performance optimization

2. **Polish**
   - [ ] Update UI text/prompts
   - [ ] Improve visual feedback
   - [ ] Add tutorial hints

3. **Documentation**
   - [ ] Update README.md
   - [ ] Update all docs for new architecture
   - [ ] Create gameplay GIF

**Deliverable:** Shippable survivors-like game

---

## 🚨 Risk Assessment

### High Risk Areas

1. **Ally AI Complexity** 🔴
   - **Risk:** Allies may pathfind poorly, get stuck, or behave erratically
   - **Mitigation:** 
     - Start with simple follow behavior
     - Use existing Enemy AI patterns as template
     - Add visual debug mode for AI states
     - Limit ally count (max 4-6 at once)

2. **Performance with Allies** 🟡
   - **Risk:** 10+ entities (player + allies + enemies) may drop FPS
   - **Mitigation:**
     - Profile with 20+ entities early
     - Optimize collision detection
     - Consider ally lifetime limits
     - Use object pooling for frequent spawns

3. **Ability System Scope Creep** 🟡
   - **Risk:** Too many abilities → long development
   - **Mitigation:**
     - MVP: 4 abilities total (3/5/8/10)
     - Reuse existing slash effect assets
     - Save complex abilities for post-MVP

4. **Save Data Corruption** 🟡
   - **Risk:** localStorage bugs lose player progress
   - **Mitigation:**
     - Validate JSON on load
     - Implement backup/restore
     - Version save data format
     - Add "reset progress" option

---

## 🔧 Technical Debt to Address

### Immediate (During Refactor)

1. **Duplicated Code** 🔴
   - `Player.js` and `Monk.js` share 60% identical code
   - **Fix:** BaseCharacter abstraction (Phase 1)

2. **Hardcoded Values** 🟡
   - Stats, spawn positions, cooldowns scattered
   - **Fix:** Create `src/config/GameBalance.js` constants file

3. **Missing Type Safety** 🟢
   - No JSDoc comments on complex methods
   - **Fix:** Add JSDoc during refactor

### Future (Post-MVP)

1. **No Sound System** 🟢
   - Add Phaser sound manager
   - Load sound assets

2. **No Mobile Support** 🟢
   - Add touch controls
   - Responsive UI scaling

---

## 📦 New File Structure (Post-Refactor)

```
game/src/
├── main.js
├── config/
│   ├── GameBalance.js         # All tuning constants
│   └── AbilityDefinitions.js  # Ability data
├── scenes/
│   ├── BootScene.js
│   ├── GameScene.js           # Main gameplay (refactored)
│   ├── MetaMenuScene.js       # NEW: Meta progression UI
│   └── TutorialScene.js       # NEW: Optional tutorial
├── entities/
│   ├── BaseCharacter.js       # NEW: Abstract base class
│   ├── PlayableCharacter.js   # NEW: Renamed from Player.js
│   ├── AllyCharacter.js       # NEW: Base for allies
│   ├── AllyWarrior.js         # NEW: Ally warrior
│   ├── AllyMonk.js            # NEW: Ally monk
│   ├── Enemy.js               # Existing (minor updates)
│   ├── InteractiveBuilding.js # NEW: Building interactions
│   └── HealthPotion.js        # Existing
├── systems/
│   ├── AbilitySystem.js       # NEW: Ability management
│   ├── MetaProgressionSystem.js # NEW: Save/load/currency
│   └── WaveManager.js         # NEW: Extract wave logic
└── utils/
    ├── CollisionMap.js        # Existing
    ├── FloatingText.js        # Existing
    └── UIBars.js              # Existing (minor updates)
```

**Total New Files:** 10  
**Modified Files:** 6  
**Deleted Files:** 1 (Monk.js)

---

## ✅ Success Metrics

### Code Health
- [ ] 0 code duplication between character classes
- [ ] <1000 lines per file (modular)
- [ ] JSDoc coverage >70%
- [ ] No console errors in production build

### Gameplay
- [ ] Player can complete wave 1-5 with allies
- [ ] All 4 abilities unlock and function
- [ ] 30s building cooldown feels balanced
- [ ] AI allies assist effectively (>20% of damage)

### Meta Loop
- [ ] Run stats tracked accurately
- [ ] Currency persists between runs
- [ ] Can purchase at least 3 upgrades
- [ ] No save data loss in 50+ runs

---

## 🎓 Learning Opportunities

This refactor provides practice in:
- **Object-Oriented Design:** Abstraction, inheritance, composition
- **AI Systems:** State machines, behavior trees
- **Game Balance:** Tuning difficulty, progression curves
- **Data Persistence:** localStorage, serialization
- **Refactoring:** Modernizing code without breaking features

---

## 📞 Recommendations

### Before Starting

1. **Backup Current State**
   ```bash
   git checkout -b backup-pre-refactor
   git commit -am "Backup before survivors-like refactor"
   git checkout main
   git checkout -b feature/survivors-like-refactor
   ```

2. **Set Up Testing Framework** (Optional but recommended)
   - Install Jest for unit testing
   - Write tests for BaseCharacter
   - Test-driven development for AI

3. **Create Milestones**
   - Use GitHub Issues for each phase
   - Track progress visibly

### During Development

1. **Test Continuously**
   - Run game after every major change
   - Keep `debug: true` in physics config
   - Use console.log liberally for AI debugging

2. **Commit Frequently**
   - Commit after each working feature
   - Use descriptive commit messages
   - Don't commit broken builds

3. **Ask for Help**
   - Complex AI logic? Prototype on paper first
   - Stuck on architecture? Discuss before coding

---

## 🏁 Conclusion

**Current Codebase Grade:** B+  
**Refactor Feasibility:** ✅ Highly Feasible  
**Estimated Timeline:** 10-12 weeks (part-time)  
**Recommended Approach:** Incremental refactor, test at each phase

**The current codebase is in good health and well-structured enough to support this pivot. The main work is additive (ally AI, building interactions, abilities) rather than destructive. With disciplined incremental development and testing, this refactor is very achievable.**

**Next Step:** Review this plan, prioritize phases based on your goals, and begin Phase 1 - Foundation work.

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Author:** Comprehensive Codebase Analysis

