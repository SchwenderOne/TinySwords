# Development Guide for Claude Code

This guide provides everything needed to continue development seamlessly in Claude Code.

---

## 🚀 Quick Start

```bash
# Navigate to game directory
cd "/Volumes/ONE-USB-C/replitswords Kopie/game"

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

---

## 📂 Project Context

### What This Game Is
A browser-based 2D action RPG featuring:
- Wave-based combat (5 waves, scaling difficulty)
- Two playable characters (Warrior melee, Monk healer)
- Character switching via ESC menu
- RPG progression (XP, leveling to max level 10)
- Item drops (health potions)
- Dynamic environment (buildings, decorations with depth sorting)
- Professional UI (DOM overlay health/XP bars)

### Current State
**✅ 100% Complete & Functional**
- All core systems implemented
- All features tested and working
- Production-ready codebase
- ~2,240 lines of code

---

## 🗺️ Codebase Map

### Entry Points
1. **`index.html`** - HTML5 + DOM UI overlay (health/XP bars)
2. **`src/main.js`** - Phaser game configuration
3. **`src/scenes/BootScene.js`** - Asset loading
4. **`src/scenes/GameScene.js`** - Main game logic (START HERE)

### Key Files to Know

**GameScene.js** (~700 lines) - Central hub:
- Lines 1-80: Setup & initialization
- Lines 81-238: Environment creation (buildings, decorations)
- Lines 239-337: UI creation (ESC menu, wave counter)
- Lines 338-391: Wave system (start, messages, progression)
- Lines 392-540: Update loop (character, enemies, bars)
- Lines 541-686: Helper methods (character switching, victory, game over)

**Player.js** (~360 lines) - Warrior character:
- Lines 1-35: Constructor & setup
- Lines 36-100: Animation creation
- Lines 101-210: Update & movement (WASD, collision)
- Lines 211-243: Attack system (4-directional hitboxes)
- Lines 244-305: Combat methods (guard, damage, heal)
- Lines 306-340: Leveling system (XP, level up, cap at 10)

**Monk.js** (~300 lines) - Healer character:
- Lines 1-32: Constructor & setup
- Lines 33-87: Animation creation
- Lines 88-195: Update & movement
- Lines 196-251: Heal ability (AOE, cooldown)
- Lines 252-292: Combat & leveling (similar to Player)

**Enemy.js** (~450 lines) - AI opponents:
- Lines 1-60: Constructor & setup (warrior/archer types)
- Lines 61-150: Animation creation
- Lines 151-189: Update loop & health bar positioning
- Lines 190-290: AI state machine (patrol, chase, attack)
- Lines 291-370: Combat methods (melee, ranged, arrows)
- Lines 371-444: Damage, death, XP drops

**UIBars.js** (~60 lines) - DOM bar controller:
- Simple API: `updateHealth(current, max)`, `updateXP(current, toNext, level)`
- Manipulates DOM elements in `index.html`

### Utilities
- **CollisionMap.js** - Pixel-perfect terrain detection (green island vs water)
- **FloatingText.js** - Visual feedback (damage, heal, XP, level-up)
- **HealthPotion.js** - Collectible healing item

---

## 🔧 Common Development Tasks

### Adding a New Enemy Type

1. **Add sprite sheets to** `public/assets/`:
```bash
# Example: Blue Warrior
public/assets/blue-warrior/
  ├── Warrior_Idle.png
  ├── Warrior_Run.png
  └── Warrior_Attack1.png
```

2. **Load in BootScene.js**:
```javascript
// Around line 70
this.load.spritesheet('blue-warrior-idle', '/assets/blue-warrior/Warrior_Idle.png', {
  frameWidth: 192,
  frameHeight: 192
});
```

3. **Create animations in Enemy.js constructor**:
```javascript
// Around line 60
if (!anims.exists('blue-warrior-idle')) {
  anims.create({
    key: 'blue-warrior-idle',
    frames: anims.generateFrameNumbers('blue-warrior-idle', { start: 0, end: 7 }),
    frameRate: 6,
    repeat: -1
  });
}
```

4. **Add type logic in Enemy.js**:
```javascript
// Around line 17
if (type === 'blue-warrior') {
  this.health = 120;
  this.maxHealth = 120;
  this.moveSpeed = 140;
  this.attackRange = 80;
  this.attackDamage = 12;
  this.detectionRange = 320;
}
```

5. **Spawn in GameScene.js `startWave()`**:
```javascript
// Around line 360
const blueWarrior = new Enemy(this, x, y, 'blue-warrior', this.collisionMap);
this.enemies.add(blueWarrior);
```

### Adding a New Character

1. **Create class file** `src/entities/NewCharacter.js`:
```javascript
import Phaser from 'phaser';

export default class NewCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, collisionMap) {
    super(scene, x, y, 'new-character-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Stats
    this.health = 100;
    this.maxHealth = 100;
    this.moveSpeed = 180;
    
    // Setup physics body
    this.body.setSize(60, 80);
    this.body.setOffset(66, 90);
    
    // Create animations
    this.createAnimations();
  }
  
  createAnimations() {
    // Define animations here
  }
  
  update(time, delta) {
    // Movement and ability logic
  }
}
```

2. **Import in GameScene.js**:
```javascript
import NewCharacter from '../entities/NewCharacter.js';
```

3. **Add to character switching menu** (around line 450):
```javascript
this.newCharacterBtn = this.add.text(width / 2, height / 2 + 100, '⚡ NEW CHARACTER', {
  font: '24px Arial',
  fill: this.currentCharacter === 'newcharacter' ? '#00ff00' : '#ffffff',
  // ...
});
```

### Adjusting Game Balance

**Enemy Stats** (Enemy.js, lines 17-31):
```javascript
// Red Warrior
this.health = 100;           // HP before death
this.attackDamage = 10;      // Damage per hit
this.moveSpeed = 120;        // Movement speed
this.attackRange = 100;      // Attack trigger distance
this.detectionRange = 300;   // Chase trigger distance
this.attackCooldown = 1500;  // Milliseconds between attacks
```

**Player Stats** (Player.js, lines 16-19):
```javascript
this.health = 100;           // Starting HP
this.maxHealth = 100;
this.moveSpeed = 200;        // Movement speed
this.attackDamage = 20;      // Base damage
```

**Wave Composition** (GameScene.js, `startWave()`, line 355):
```javascript
const enemyCount = (this.currentWave * 2) + 1;  // Formula
const warriorCount = Math.ceil(enemyCount * 0.6);  // 60% warriors
const archerCount = enemyCount - warriorCount;     // 40% archers
```

**Leveling** (Player.js, `levelUp()`, line 315):
```javascript
this.maxHealth += 20;        // HP per level
this.attackDamage += 5;      // Damage per level
this.xpToNextLevel = this.level * 100;  // XP scaling
```

### Debugging Common Issues

**Issue: Character spawns in wrong location**
```javascript
// GameScene.js, line 42
this.player = new Player(this, 2310, 2040, this.collisionMap);
// Coordinates are (x, y) in pixels on 6496×6640 map
// Use browser console: console.log(this.player.x, this.player.y)
```

**Issue: Collision detection too strict/loose**
```javascript
// CollisionMap.js, line 30 (RGB range for green detection)
const isGreen = r >= 100 && r <= 180 &&  // Widen for more walkable area
                g >= 150 && g <= 220 &&
                b >= 80 && b <= 160;
```

**Issue: UI bars not updating**
```javascript
// GameScene.js, line 510-511 (called every frame)
this.uiBars.updateHealth(activeChar.health, activeChar.maxHealth);
this.uiBars.updateXP(activeChar.xp, activeChar.xpToNextLevel, activeChar.level);

// Check DOM elements exist: document.getElementById('health-bar')
```

**Issue: Enemies not attacking**
```javascript
// Enemy.js, line 194-196 (check isAttacking flag)
if (this.isAttacking) {
  return;  // Don't change states during attack animation
}

// Verify attack range: line 200
if (distanceToPlayer <= this.attackRange && this.attackCooldown <= 0) {
  this.aiState = 'attack';
}
```

---

## 🎨 Asset Guidelines

### Sprite Sheet Format
- **Size:** 192×192 pixels per frame
- **Layout:** Horizontal strip (frames side-by-side)
- **Format:** PNG with transparency
- **Naming:** `{Unit}_{Animation}.png` (e.g., `Warrior_Idle.png`)

### Adding New Sprites
1. Place in `public/assets/{faction}-{unit}/`
2. Load in `BootScene.js` with correct `frameWidth: 192`
3. Create animation in entity class with correct frame count
4. Reference by animation key (e.g., `this.play('red-warrior-idle')`)

### Frame Rates (from asset documentation)
- **Idle:** 6 FPS (slow, breathing)
- **Run:** 8-10 FPS (medium, motion)
- **Attack:** 10-12 FPS (fast, action)
- **Special:** 12 FPS (fastest, effects)

---

## 🐛 Known Technical Details

### Collision System
- **Method:** Center-point checking only (optimized)
- **Terrain:** Pixel RGB analysis of map image
- **Character-Character:** Arcade Physics colliders

### Physics Configuration
```javascript
// main.js
arcade: {
  gravity: { y: 0 },  // Top-down, no gravity
  debug: false        // Set true to see collision boxes
}
```

### Camera Settings
```javascript
// GameScene.js, line 78-80
this.cameras.main.startFollow(this.player, true, 0.1, 0.1);  // Smooth follow
this.cameras.main.setZoom(1.5);                              // 1.5x zoom
this.cameras.main.setBounds(0, 0, 6496, 6640);               // Map bounds
```

### Depth Layers
```
0   - Map, rocks
1   - Buildings, decorations (behind player)
2   - Player, enemies, shadows
3   - Buildings, decorations (in front of player)
10  - Particle effects
100 - UI text elements
250 - ESC menu overlay
1000+ - DOM overlay (CSS z-index)
```

---

## 📝 Code Style & Conventions

### Naming Conventions
- **Classes:** PascalCase (`Player`, `GameScene`)
- **Methods:** camelCase (`updateHealth`, `createAnimations`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_LEVEL`)
- **Private-ish:** Leading underscore (`_internalMethod`) - not enforced

### Comments
- Use JSDoc for class constructors and complex methods
- Inline comments for non-obvious logic
- Section headers with `// ========== SECTION ==========`

### Structure
- **Constructor:** Setup, stats, physics
- **createAnimations():** Animation definitions
- **update():** Per-frame logic
- **Helper methods:** Below update
- **Event handlers:** At bottom

---

## 🚦 Testing Workflow

### Quick Test Checklist
```bash
# Start dev server
npm run dev

# In browser:
1. Load game → Should see island, player, health bars
2. Press W/A/S/D → Player should move, stay on island
3. Press SPACE → Attack animation, damage if enemy near
4. Defeat enemy → XP gain, floating number, health potion maybe
5. Level up (after ~50 XP) → LEVEL UP text, full heal, stat increase
6. Press ESC → Menu opens, can switch to Monk
7. As Monk, press SPACE → Heal animation, green numbers
8. Defeat all enemies → Wave 2 announcement
9. Complete 5 waves → Victory screen
10. Press R → Restart, back to Wave 1

# Check console for errors (F12)
# Health/XP bars should update in real-time
```

### Debug Mode
```javascript
// main.js, line 12
debug: true  // Shows collision boxes, velocities, etc.
```

---

## 🎯 Performance Tips

### If FPS Drops
1. **Check enemy count:** >20 enemies impacts performance
2. **Reduce depth sorting:** Only sort visible objects
3. **Pool projectiles:** Reuse arrow sprites instead of creating new ones
4. **Optimize collision:** Already using center-point only (good)

### If Memory Leaks
1. **Destroy dead enemies:** `enemy.destroy()` removes from scene
2. **Clean up floating text:** Auto-destroys after 1 second
3. **Remove event listeners:** `this.off()` when switching scenes

---

## 📚 Useful References

### Phaser 3 API
- **Physics:** https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.html
- **Sprites:** https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html
- **Animations:** https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationManager.html
- **Scenes:** https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html

### Project Docs
- **README.md** - User-facing documentation
- **IMPLEMENTATION_SUMMARY.md** - Complete technical breakdown
- **GAME_PLAN.md** - Architecture overview
- **This file** - Development guide

---

## 💡 Tips for Claude Code

### When Reading Code
1. Start with `GameScene.js` to understand game flow
2. Check `Player.js` / `Monk.js` for character mechanics
3. Review `Enemy.js` for AI behavior
4. Look at `UIBars.js` for UI integration

### When Adding Features
1. Follow existing patterns (e.g., new enemy like existing enemies)
2. Test in isolation before integrating
3. Update documentation in this file
4. Check for breaking changes in other systems

### When Debugging
1. Use `console.log()` liberally in game loop
2. Enable physics debug mode (`debug: true`)
3. Check browser console (F12) for errors
4. Verify asset paths are correct (`/assets/...`)

---

## 🔄 Git Workflow

```bash
# Current repo
https://github.com/SchwenderOne/TinySwords.git

# Commit messages format
feat: Add new enemy type
fix: Resolve collision detection issue
docs: Update README with new features
refactor: Optimize enemy AI performance
```

---

## ✅ Quick Fixes for Common Requests

**"Make enemies stronger"**
→ Enemy.js, line 18-22, increase `attackDamage` or `health`

**"Add more waves"**
→ GameScene.js, line 14, change `this.maxWaves = 5` to desired number

**"Change spawn location"**
→ GameScene.js, line 42, change `new Player(this, 2310, 2040, ...)`

**"Adjust level cap"**
→ Player.js and Monk.js, line ~315, change `if (this.level >= 10)` to new cap

**"Change health/XP bar colors"**
→ index.html, CSS section, `.bar-fill.health` and `.bar-fill.xp` gradients

**"Modify movement speed"**
→ Player.js line 18 or Monk.js line 16, change `this.moveSpeed = ...`

**"Adjust attack range"**
→ Player.js line ~235 (hitbox offset) or Enemy.js line 21 (enemy attack range)

---

**This guide should provide everything needed to jump into development immediately. The codebase is well-structured, documented, and ready for expansion!**

**Last Updated:** October 2024  
**For:** Claude Code Development Continuation

