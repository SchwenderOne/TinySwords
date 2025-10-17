# 🚀 Quick Start: Refactoring Guide

**Goal:** Get started with Phase 1 of the survivors-like pivot immediately.

---

## ⚡ 30-Minute Start

### Step 1: Backup & Branch (5 min)
```bash
cd "/Volumes/ONE-USB-C/replitswords Kopie"
git status
git add .
git commit -m "Pre-refactor checkpoint"
git checkout -b feature/survivors-like
```

### Step 2: Create Config File (10 min)
Create `game/src/config/GameBalance.js`:

```javascript
// Centralized game balance configuration
export const GameBalance = {
  // Player Stats
  player: {
    warrior: {
      startHealth: 100,
      startDamage: 20,
      moveSpeed: 200,
      healthPerLevel: 20,
      damagePerLevel: 5
    }
  },
  
  // Ally Stats
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
      followDistance: 100
    }
  },
  
  // Enemy Stats
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
      moveSpeed: 0,
      attackRange: 400,
      detectionRange: 450,
      attackCooldown: 2000,
      xpReward: 30
    }
  },
  
  // Progression
  progression: {
    maxLevel: 10,
    xpPerLevel: 100, // Multiplied by level
    abilityUnlockLevels: [3, 5, 8, 10]
  },
  
  // Buildings
  buildings: {
    interactionRadius: 100,
    spawnCooldown: 30000 // 30 seconds
  },
  
  // Wave System
  waves: {
    maxWaves: 10,
    restPeriod: 5000, // 5 seconds between waves
    castleGatePosition: { x: 2310, y: 1850 },
    spawnRadius: 150
  }
};
```

### Step 3: Create BaseCharacter (15 min)
Create `game/src/entities/BaseCharacter.js`:

```javascript
import Phaser from 'phaser';
import FloatingText from '../utils/FloatingText.js';
import { GameBalance } from '../config/GameBalance.js';

/**
 * Base class for all characters (player, allies, enemies)
 * Contains shared logic for health, damage, leveling, and animations
 */
export default class BaseCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, stats) {
    super(scene, x, y, spriteKey);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Stats
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.moveSpeed = stats.moveSpeed;
    this.attackDamage = stats.attackDamage || 0;
    
    // Leveling
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = GameBalance.progression.xpPerLevel;
    
    // State
    this.isAttacking = false;
    this.facingDirection = 1; // 1 = right, -1 = left
    
    // Physics
    this.body.setSize(60, 80);
    this.body.setOffset(66, 50);
    
    // Shadow
    this.shadow = scene.add.image(x, y + 60, 'shadow');
    this.shadow.setScale(0.3);
    this.shadow.setAlpha(0.5);
    this.shadow.setDepth(0);
    
    this.setDepth(2);
  }
  
  /**
   * Base update - call from child classes
   */
  update(time, delta) {
    // Update shadow position
    if (this.shadow && this.shadow.active) {
      this.shadow.setPosition(this.x, this.y + 60);
    }
  }
  
  /**
   * Take damage with visual feedback
   */
  takeDamage(amount) {
    this.health -= amount;
    
    // Floating damage number
    FloatingText.createDamage(this.scene, this.x, this.y - 50, amount);
    
    // Visual feedback
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) {
        this.clearTint();
      }
    });
    
    if (this.health <= 0) {
      this.die();
    }
  }
  
  /**
   * Heal with visual feedback
   */
  heal(amount) {
    const actualHeal = Math.min(amount, this.maxHealth - this.health);
    if (actualHeal <= 0) return;
    
    this.health += actualHeal;
    
    // Floating heal number
    FloatingText.createHeal(this.scene, this.x, this.y - 50, actualHeal);
    
    // Visual feedback
    this.setTint(0x00ff00);
    this.scene.time.delayedCall(200, () => {
      if (this.active) {
        this.clearTint();
      }
    });
  }
  
  /**
   * Gain XP and check for level up
   */
  gainXP(amount) {
    if (this.level >= GameBalance.progression.maxLevel) {
      return; // Max level reached
    }
    
    this.xp += amount;
    FloatingText.createXP(this.scene, this.x, this.y - 70, amount);
    
    // Check for level up
    while (this.xp >= this.xpToNextLevel && this.level < GameBalance.progression.maxLevel) {
      this.levelUp();
    }
  }
  
  /**
   * Level up - override in child classes for specific bonuses
   */
  levelUp() {
    if (this.level >= GameBalance.progression.maxLevel) {
      this.xp = this.xpToNextLevel; // Cap XP
      return;
    }
    
    this.level++;
    this.xp -= this.xpToNextLevel;
    this.xpToNextLevel = this.level * GameBalance.progression.xpPerLevel;
    
    // Full heal on level up
    this.health = this.maxHealth;
    
    // Visual feedback
    FloatingText.createLevelUp(this.scene, this.x, this.y - 90, this.level);
    
    // Particle effect
    this.scene.add.particles(this.x, this.y, 'shadow', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      quantity: 20,
      tint: 0xffd700
    });
  }
  
  /**
   * Character death
   */
  die() {
    this.setActive(false);
    this.setVisible(false);
    if (this.shadow) this.shadow.setVisible(false);
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.shadow) {
      this.shadow.destroy();
    }
    super.destroy();
  }
}
```

---

## 🎯 First Test: Verify Nothing Broke

1. **Start dev server:**
   ```bash
   cd game
   npm run dev
   ```

2. **Open browser console** (F12)

3. **Expected Result:** Game loads, Warrior works exactly as before

4. **If errors:** Don't proceed until you fix them!

---

## 📝 Next Steps (Day 1-3)

### Task 1: Refactor Player to Use BaseCharacter

**File:** `game/src/entities/Player.js`

**Changes:**
1. Import BaseCharacter:
   ```javascript
   import BaseCharacter from './BaseCharacter.js';
   ```

2. Change class declaration:
   ```javascript
   // OLD:
   export default class Player extends Phaser.Physics.Arcade.Sprite {
   
   // NEW:
   export default class Player extends BaseCharacter {
   ```

3. Update constructor:
   ```javascript
   constructor(scene, x, y, collisionMap) {
     // NEW: Pass stats to base
     super(scene, x, y, 'black-warrior-idle', {
       health: GameBalance.player.warrior.startHealth,
       moveSpeed: GameBalance.player.warrior.moveSpeed,
       attackDamage: GameBalance.player.warrior.startDamage
     });
     
     // Keep Player-specific stuff:
     this.collisionMap = collisionMap;
     this.isGuarding = false;
     this.attackCooldown = 0;
     // ... etc
     
     // REMOVE: Don't duplicate BaseCharacter setup
     // - Remove shadow creation (done in base)
     // - Remove physics setup (done in base)
     // - Remove level/xp init (done in base)
   }
   ```

4. Update methods:
   ```javascript
   update(time, delta) {
     super.update(time, delta); // Call base first!
     
     // Update attack cooldown
     if (this.attackCooldown > 0) {
       this.attackCooldown -= delta;
     }
     
     this.handleInput();
   }
   
   // REMOVE takeDamage() - use base class version
   // REMOVE heal() - use base class version  
   // REMOVE gainXP() - use base class version
   
   // KEEP but enhance levelUp():
   levelUp() {
     super.levelUp(); // Call base first
     
     // Warrior-specific bonuses
     this.maxHealth += GameBalance.player.warrior.healthPerLevel;
     this.attackDamage += GameBalance.player.warrior.damagePerLevel;
   }
   ```

5. **Test:** Run game, verify Warrior still works

---

### Task 2: Remove Character Switching

**File:** `game/src/scenes/GameScene.js`

**Changes:**
1. Remove Monk creation (lines 58-62)
2. Remove ESC menu methods (lines 456-532)
3. Remove ESC key listener (lines 86-88)
4. Simplify update loop:
   ```javascript
   // OLD:
   const activeChar = this.currentCharacter === 'warrior' ? this.player : this.monk;
   
   // NEW:
   const activeChar = this.player;
   ```

5. Remove character indicator UI (lines 348-356)

6. **Test:** Run game, verify Monk is gone, no ESC menu

---

### Task 3: Centralize Enemy Spawns at Castle

**File:** `game/src/scenes/GameScene.js`

**Find:** `startWave()` method (line 376)

**Replace spawn positions:**
```javascript
startWave() {
  this.waveInProgress = true;
  this.betweenWaves = false;
  
  const warriorCount = Math.min(2 + Math.floor(this.currentWave / 2), 6);
  const archerCount = Math.min(1 + Math.floor(this.currentWave / 3), 4);
  
  // NEW: Spawn from castle gate
  const gatePos = GameBalance.waves.castleGatePosition;
  
  // Spawn warriors
  for (let i = 0; i < warriorCount; i++) {
    const angle = (Math.PI * 2 / warriorCount) * i;
    const x = gatePos.x + Math.cos(angle) * GameBalance.waves.spawnRadius;
    const y = gatePos.y + Math.sin(angle) * GameBalance.waves.spawnRadius;
    this.spawnEnemy('warrior', x, y);
  }
  
  // Spawn archers (outer ring)
  for (let i = 0; i < archerCount; i++) {
    const angle = (Math.PI * 2 / archerCount) * i + Math.PI / 4;
    const x = gatePos.x + Math.cos(angle) * (GameBalance.waves.spawnRadius + 50);
    const y = gatePos.y + Math.sin(angle) * (GameBalance.waves.spawnRadius + 50);
    this.spawnEnemy('archer', x, y);
  }
  
  this.showWaveMessage(`Wave ${this.currentWave} - Fight!`);
}
```

**Test:** Run game, verify all enemies spawn from castle front

---

## ✅ Checklist After Day 1-3

- [ ] BaseCharacter class created and working
- [ ] GameBalance config file created
- [ ] Player refactored to extend BaseCharacter
- [ ] No code duplication in Player (takeDamage, heal, etc.)
- [ ] Monk removed from game
- [ ] ESC menu removed
- [ ] Enemies spawn from castle gate
- [ ] Game still fully playable
- [ ] No console errors
- [ ] Committed to git: `git commit -am "Phase 1: Foundation complete"`

---

## 🚦 When to Move to Phase 2

✅ **Move forward when:**
- All checklist items complete
- Game plays smoothly
- No regressions in existing features
- Code is cleaner than before

❌ **Stay in Phase 1 if:**
- Any bugs introduced
- Performance degraded
- Features broken

---

## 🆘 Common Issues

### Issue: "Cannot read property 'update' of undefined"
**Cause:** Shadow not properly initialized  
**Fix:** Ensure `super()` is called before accessing `this`

### Issue: "Player.takeDamage is not a function"
**Cause:** Method removed but still called somewhere  
**Fix:** Search codebase for `player.takeDamage`, verify using base class method

### Issue: Stats don't match GameBalance config
**Cause:** Forgot to import config  
**Fix:** Add `import { GameBalance } from '../config/GameBalance.js'` at top

---

## 📚 Resources

- **Main Plan:** See `REFACTORING_PLAN.md` for full details
- **MVP Spec:** See `mvp_game_spec_survivors_like.md` for target game
- **Git:** Use branches! `git checkout -b feature/your-feature`
- **Testing:** Keep `debug: true` in `main.js` during dev

---

**Next Document:** After Phase 1, read `PHASE_2_ALLY_SYSTEM.md` (create this next!)

