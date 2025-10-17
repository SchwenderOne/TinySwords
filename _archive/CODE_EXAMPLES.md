# 📋 Code Examples: Before & After Refactor

Visual guide showing exactly what code changes look like during the refactor.

---

## Example 1: BaseCharacter Extraction

### ❌ BEFORE: Duplicated Code

**Player.js** (lines 289-312):
```javascript
takeDamage(amount) {
  if (this.isGuarding) {
    amount *= 0.5; // 50% damage reduction when guarding
  }

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
```

**Monk.js** (lines 243-260):
```javascript
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
```

**Problem:** 90% identical code duplicated!

### ✅ AFTER: Shared in BaseCharacter

**BaseCharacter.js:**
```javascript
takeDamage(amount, options = {}) {
  // Allow modifiers (like guard)
  if (options.damageReduction) {
    amount *= (1 - options.damageReduction);
  }

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
```

**Player.js** (simplified):
```javascript
takeDamage(amount) {
  // Apply guard modifier if active
  const reduction = this.isGuarding ? 0.5 : 0;
  super.takeDamage(amount, { damageReduction: reduction });
}
```

**Monk.js:** (just delete the method, use base class!)

**Lines Saved:** ~40 lines of duplicate code eliminated

---

## Example 2: Hardcoded Values → Config

### ❌ BEFORE: Magic Numbers Everywhere

**Player.js:**
```javascript
this.health = 100;
this.maxHealth = 100;
this.moveSpeed = 200;
this.attackDamage = 20;
```

**Enemy.js:**
```javascript
if (type === 'warrior') {
  this.health = 100;
  this.maxHealth = 100;
  this.moveSpeed = 120;
  this.attackRange = 100;
  this.attackDamage = 10;
  this.detectionRange = 300;
}
```

**Problem:** Tuning requires searching entire codebase!

### ✅ AFTER: Centralized Config

**GameBalance.js:**
```javascript
export const GameBalance = {
  player: {
    warrior: {
      startHealth: 100,
      startDamage: 20,
      moveSpeed: 200,
      healthPerLevel: 20,
      damagePerLevel: 5
    }
  },
  
  enemies: {
    warrior: {
      health: 100,
      damage: 10,
      moveSpeed: 120,
      attackRange: 100,
      detectionRange: 300,
      attackCooldown: 1500
    }
  }
};
```

**Player.js:**
```javascript
import { GameBalance } from '../config/GameBalance.js';

constructor(scene, x, y, collisionMap) {
  const stats = GameBalance.player.warrior;
  super(scene, x, y, 'black-warrior-idle', {
    health: stats.startHealth,
    moveSpeed: stats.moveSpeed,
    attackDamage: stats.startDamage
  });
}

levelUp() {
  super.levelUp();
  const stats = GameBalance.player.warrior;
  this.maxHealth += stats.healthPerLevel;
  this.attackDamage += stats.damagePerLevel;
}
```

**Enemy.js:**
```javascript
import { GameBalance } from '../config/GameBalance.js';

constructor(scene, x, y, type, collisionMap) {
  const stats = GameBalance.enemies[type];
  super(scene, x, y, spriteKey);
  
  this.health = stats.health;
  this.maxHealth = stats.health;
  this.moveSpeed = stats.moveSpeed;
  // ... etc
}
```

**Benefit:** Change balance in ONE file, affects entire game!

---

## Example 3: Enemy Spawn System

### ❌ BEFORE: Perimeter Spawns

**GameScene.js startWave():**
```javascript
// Spawn positions around the island
const spawnPositions = [
  { x: 2880, y: 2040 },  // Right side
  { x: 1740, y: 2280 },  // Left-bottom
  { x: 2310, y: 1680 },  // Top-center
  { x: 2820, y: 1800 },  // Right-top
  { x: 1800, y: 1920 },  // Left-center
  { x: 2600, y: 2400 },  // Right-bottom
  { x: 1600, y: 1700 },  // Left-top
  { x: 2500, y: 1800 },  // Center-top
];

// Spawn warriors
for (let i = 0; i < warriorCount; i++) {
  const pos = spawnPositions[i % spawnPositions.length];
  this.spawnEnemy('warrior', pos.x, pos.y);
}
```

**Problem:** Enemies come from all sides, no clear danger zone

### ✅ AFTER: Castle Gate Spawns

**GameScene.js startWave():**
```javascript
import { GameBalance } from '../config/GameBalance.js';

startWave() {
  this.waveInProgress = true;
  
  const warriorCount = Math.min(2 + Math.floor(this.currentWave / 2), 6);
  const archerCount = Math.min(1 + Math.floor(this.currentWave / 3), 4);
  
  const gatePos = GameBalance.waves.castleGatePosition;
  const spawnRadius = GameBalance.waves.spawnRadius;
  
  // Spawn warriors in circle around gate
  for (let i = 0; i < warriorCount; i++) {
    const angle = (Math.PI * 2 / warriorCount) * i;
    const x = gatePos.x + Math.cos(angle) * spawnRadius;
    const y = gatePos.y + Math.sin(angle) * spawnRadius;
    this.spawnEnemy('warrior', x, y);
  }
  
  // Spawn archers in outer ring
  for (let i = 0; i < archerCount; i++) {
    const angle = (Math.PI * 2 / archerCount) * i + Math.PI / 4;
    const x = gatePos.x + Math.cos(angle) * (spawnRadius + 50);
    const y = gatePos.y + Math.sin(angle) * (spawnRadius + 50);
    this.spawnEnemy('archer', x, y);
  }
  
  this.showWaveMessage(`Wave ${this.currentWave} - Fight!`);
}
```

**Benefit:** Clear visual focus, matches survivors-like gameplay

---

## Example 4: Building Interaction System (NEW)

### ✅ NEW CODE: Interactive Buildings

**InteractiveBuilding.js:**
```javascript
import Phaser from 'phaser';
import { GameBalance } from '../config/GameBalance.js';

export default class InteractiveBuilding extends Phaser.GameObjects.Container {
  constructor(scene, x, y, buildingSprite, type) {
    super(scene, x, y);
    scene.add.existing(this);
    
    this.type = type; // 'house' or 'tower'
    this.cooldown = 0;
    this.maxCooldown = GameBalance.buildings.spawnCooldown;
    this.interactionRadius = GameBalance.buildings.interactionRadius;
    
    // Add building sprite
    this.buildingSprite = scene.add.image(0, 0, buildingSprite);
    this.buildingSprite.setOrigin(0.5, 1);
    this.add(this.buildingSprite);
    
    // Create interaction prompt (hidden by default)
    this.prompt = scene.add.text(0, -150, 'Press E', {
      font: 'bold 18px Arial',
      fill: '#ffff00',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    });
    this.prompt.setOrigin(0.5);
    this.prompt.setVisible(false);
    this.add(this.prompt);
    
    // Create cooldown bar
    this.cooldownBarBg = scene.add.rectangle(0, -130, 80, 8, 0x000000);
    this.cooldownBarFill = scene.add.rectangle(-40, -130, 80, 8, 0x00ff00);
    this.cooldownBarFill.setOrigin(0, 0.5);
    this.cooldownBarBg.setVisible(false);
    this.cooldownBarFill.setVisible(false);
    this.add([this.cooldownBarBg, this.cooldownBarFill]);
  }
  
  update(delta, player) {
    // Update cooldown
    if (this.cooldown > 0) {
      this.cooldown = Math.max(0, this.cooldown - delta);
      this.updateCooldownBar();
    }
    
    // Check player proximity
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, player.x, player.y
    );
    
    const isNear = distance <= this.interactionRadius;
    
    if (isNear && this.cooldown <= 0) {
      this.prompt.setVisible(true);
      this.prompt.setText('Press E to spawn ally');
      this.prompt.setFill('#00ff00');
    } else if (isNear && this.cooldown > 0) {
      this.prompt.setVisible(true);
      const seconds = Math.ceil(this.cooldown / 1000);
      this.prompt.setText(`Cooldown: ${seconds}s`);
      this.prompt.setFill('#ff0000');
    } else {
      this.prompt.setVisible(false);
    }
  }
  
  updateCooldownBar() {
    const percent = 1 - (this.cooldown / this.maxCooldown);
    this.cooldownBarFill.width = 80 * percent;
    
    const isOnCooldown = this.cooldown > 0;
    this.cooldownBarBg.setVisible(isOnCooldown);
    this.cooldownBarFill.setVisible(isOnCooldown);
  }
  
  canInteract() {
    return this.cooldown <= 0;
  }
  
  interact() {
    if (!this.canInteract()) return null;
    
    this.cooldown = this.maxCooldown;
    
    // Spawn particle effect
    this.scene.add.particles(this.x, this.y - 50, 'shadow', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      quantity: 30,
      tint: 0x00ff00
    });
    
    // Return ally type to spawn
    return this.type === 'house' ? 'warrior' : 'monk';
  }
}
```

**GameScene.js integration:**
```javascript
import InteractiveBuilding from '../entities/InteractiveBuilding.js';

create() {
  // ... existing code ...
  
  // Replace static buildings with interactive ones
  this.interactiveBuildings = [];
  
  // Houses (spawn warriors)
  this.interactiveBuildings.push(
    new InteractiveBuilding(this, 1750, 2450, 'building-house1', 'house')
  );
  this.interactiveBuildings.push(
    new InteractiveBuilding(this, 2850, 2450, 'building-house2', 'house')
  );
  
  // Towers (spawn monks)
  this.interactiveBuildings.push(
    new InteractiveBuilding(this, 1850, 2150, 'building-tower', 'tower')
  );
  this.interactiveBuildings.push(
    new InteractiveBuilding(this, 2750, 2150, 'building-tower', 'tower')
  );
  
  // Add E key
  this.keys.E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
}

update(time, delta) {
  // ... existing code ...
  
  // Update buildings
  this.interactiveBuildings.forEach(building => {
    building.update(delta, this.player);
  });
  
  // Check E key press
  if (Phaser.Input.Keyboard.JustDown(this.keys.E)) {
    this.interactiveBuildings.forEach(building => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, building.x, building.y
      );
      
      if (distance <= building.interactionRadius) {
        const allyType = building.interact();
        if (allyType) {
          this.spawnAlly(allyType, building.x, building.y);
        }
      }
    });
  }
}
```

---

## Example 5: Ally AI System (NEW)

### ✅ NEW CODE: AI Ally

**AllyCharacter.js:**
```javascript
import BaseCharacter from './BaseCharacter.js';
import { GameBalance } from '../config/GameBalance.js';

export default class AllyCharacter extends BaseCharacter {
  constructor(scene, x, y, spriteKey, allyType) {
    const stats = GameBalance.allies[allyType];
    super(scene, x, y, spriteKey, stats);
    
    this.allyType = allyType;
    this.leader = scene.player;
    this.aiState = 'follow'; // follow, engage
    this.currentTarget = null;
    
    this.followDistance = stats.followDistance;
    this.assistRadius = stats.assistRadius;
    this.attackRange = stats.attackRange || 80;
    this.attackCooldown = 0;
  }
  
  update(time, delta) {
    super.update(time, delta);
    
    // Update cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
    
    // Run AI
    this.updateAI();
  }
  
  updateAI() {
    if (!this.leader || !this.leader.active) {
      this.body.setVelocity(0, 0);
      return;
    }
    
    switch (this.aiState) {
      case 'follow':
        this.followLeader();
        this.checkForEnemies();
        break;
      case 'engage':
        this.engageTarget();
        break;
    }
  }
  
  followLeader() {
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, this.leader.x, this.leader.y
    );
    
    if (distance > this.followDistance) {
      // Too far, move closer
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y, this.leader.x, this.leader.y
      );
      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;
      this.body.setVelocity(velocityX, velocityY);
      
      // Update facing
      this.setFlipX(velocityX < 0);
      
      // Play run animation
      if (this.anims && this.anims.currentAnim?.key !== `${this.allyType}-run`) {
        this.play(`${this.allyType}-run`, true);
      }
    } else {
      // Close enough, idle
      this.body.setVelocity(0, 0);
      if (this.anims && this.anims.currentAnim?.key !== `${this.allyType}-idle`) {
        this.play(`${this.allyType}-idle`, true);
      }
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
  
  engageTarget() {
    if (!this.currentTarget || !this.currentTarget.active) {
      this.currentTarget = null;
      this.aiState = 'follow';
      return;
    }
    
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y, this.currentTarget.x, this.currentTarget.y
    );
    
    if (distance > this.assistRadius * 1.5) {
      // Too far from assist zone, return to follow
      this.currentTarget = null;
      this.aiState = 'follow';
      return;
    }
    
    if (distance > this.attackRange) {
      // Move towards target
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y, this.currentTarget.x, this.currentTarget.y
      );
      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;
      this.body.setVelocity(velocityX, velocityY);
      
      this.setFlipX(velocityX < 0);
      if (this.anims && this.anims.currentAnim?.key !== `${this.allyType}-run`) {
        this.play(`${this.allyType}-run`, true);
      }
    } else {
      // In range, attack
      this.body.setVelocity(0, 0);
      if (this.attackCooldown <= 0) {
        this.attackTarget();
      }
    }
  }
  
  attackTarget() {
    if (!this.currentTarget || !this.currentTarget.active) return;
    
    this.attackCooldown = 1000; // 1 second cooldown
    
    // Play attack animation
    this.play(`${this.allyType}-attack`, true);
    
    // Deal damage after animation delay
    this.scene.time.delayedCall(200, () => {
      if (this.active && this.currentTarget && this.currentTarget.active) {
        const distance = Phaser.Math.Distance.Between(
          this.x, this.y, this.currentTarget.x, this.currentTarget.y
        );
        
        if (distance <= this.attackRange) {
          this.currentTarget.takeDamage(this.attackDamage);
        }
      }
    });
  }
}
```

**GameScene.js spawning allies:**
```javascript
spawnAlly(type, x, y) {
  const AllyWarrior = require('../entities/AllyWarrior.js').default;
  const AllyMonk = require('../entities/AllyMonk.js').default;
  
  let ally;
  if (type === 'warrior') {
    ally = new AllyWarrior(this, x, y);
  } else if (type === 'monk') {
    ally = new AllyMonk(this, x, y);
  }
  
  if (ally) {
    this.allies.add(ally);
    
    // Add collisions
    this.physics.add.collider(ally, this.enemies);
    this.physics.add.collider(ally, this.buildingsGroup);
    this.physics.add.collider(ally, this.treesGroup);
  }
}
```

---

## 📊 Code Metrics Comparison

### Before Refactor
- **Total Lines:** ~2,240
- **Player.js:** 370 lines
- **Monk.js:** 318 lines
- **Code Duplication:** ~40% between Player/Monk
- **Hardcoded Values:** 50+ locations
- **Configuration:** None

### After Phase 1-2 Refactor
- **Total Lines:** ~2,600 (net +360)
- **BaseCharacter.js:** 150 lines (NEW)
- **PlayableCharacter.js:** 220 lines (-150)
- **AllyCharacter.js:** 200 lines (NEW)
- **GameBalance.js:** 80 lines (NEW)
- **InteractiveBuilding.js:** 150 lines (NEW)
- **Code Duplication:** <5%
- **Hardcoded Values:** ~10 locations
- **Configuration:** Centralized

### Benefits
- ✅ 200 lines of duplication eliminated
- ✅ 50+ magic numbers centralized
- ✅ 3 new systems added (allies, buildings, config)
- ✅ Easier to maintain and extend

---

## 🎯 Key Takeaways

1. **Abstraction Reduces Duplication**
   - BaseCharacter eliminates Player/Monk overlap
   - One method to maintain instead of two

2. **Configuration Improves Tunability**
   - Change one file to balance entire game
   - No hunting through code for values

3. **New Systems Are Additive**
   - Building interaction doesn't break existing code
   - Ally AI built on proven Enemy AI patterns

4. **Incremental Progress Works**
   - Each phase independently testable
   - No "big bang" rewrite risk

---

**Next:** Follow `QUICK_START_REFACTOR.md` to implement these changes step-by-step!

