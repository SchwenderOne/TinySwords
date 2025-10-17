# 🎮 TinySwords - Current State

**Last Updated:** October 17, 2025 (Post-Phase 3)  
**Status:** ✅ Phase 1, 2, 3 Complete → Ready for Phase 4  
**Dev Server:** `cd game && npm run dev` → http://localhost:3000/

---

## 📦 What's Implemented (v0.3.0)

### ✅ Core Systems
- **Single Hero Gameplay:** Warrior only (character switching removed)
- **Wave System:** 5 waves, enemies spawn from castle gate
- **Combat:** 4-directional attacks, guard ability, knockback
- **Leveling:** XP gain, level up to 10, stat scaling
- **Health Potions:** 30% drop rate, 30 HP heal
- **UI:** DOM overlay (health/XP bars), floating text feedback
- **Collision:** Pixel-perfect terrain, buildings, trees

### ✅ AI Ally System (Phase 2)
- **AllyCharacter Base Class:** AI state machine (follow/engage)
- **Ally Warriors (Blue):** Melee combat, auto-engage enemies within 200px
- **Ally Monks (Blue):** Follow player, auto-heal when wounded
- **AI Behaviors:** 
  - Follow leader at distance
  - Detect and engage enemies
  - Return to follow when target lost
  - Monks heal player when health < 100%

### ✅ Interactive Buildings (Phase 3)
- **6 Interactive Buildings:**
  - 4 Houses → Spawn Ally Warriors
  - 2 Towers → Spawn Ally Monks
- **Interaction System:**
  - Proximity detection (100px radius)
  - "Press E" prompts (green when ready)
  - 20-second cooldown per building
  - Visual cooldown bars with countdown
- **Spawn Behavior:**
  - Allies spawn in front of buildings
  - Particle effects (blue for warriors, green for monks)

### 🏗️ Architecture (Post-Phase 3)
```
BaseCharacter (abstract)
  ├── Player (Warrior)
  ├── AllyCharacter (AI base)
  │   ├── AllyWarrior (Blue Units)
  │   └── AllyMonk (Blue Units)
  └── Enemy (Red Units)

InteractiveBuilding
  ├── Houses (spawn warriors)
  └── Towers (spawn monks)

GameBalance.js (centralized config)
GameScene (682 lines, manages all entities)
```

### 📊 Code Quality
- **0 linter errors**
- **Centralized config** (GameBalance.js with ally/building values)
- **Clean architecture** (AllyCharacter extends BaseCharacter)
- **0 code duplication**

---

## 🎯 Game Mechanics

### Player (Warrior)
- **Health:** 100 → 280 (level 10)
- **Damage:** 20 → 65 (level 10)
- **Speed:** 200
- **Abilities:**
  - Attack (SPACE): 4-directional, alternates attack1/attack2
  - Guard (SHIFT): 50% damage reduction

### Allies
- **Ally Warrior (Blue):**
  - 80 HP, 12 damage, 150 speed
  - Attack range: 80px
  - Assist radius: 200px (auto-engages enemies)
  - Follow distance: 120px from player
  
- **Ally Monk (Blue):**
  - 60 HP, 20 heal amount, 140 speed
  - Heal range: 160px
  - Heal cooldown: 4 seconds
  - Follow distance: 100px from player
  - Auto-heals player when wounded

### Enemies
- **Red Warrior:** 100 HP, melee, patrol/chase/attack AI
- **Red Archer:** 60 HP, stationary, ranged (400px)
- **Spawn:** Castle gate (x: 2310, y: 1850), circular pattern

### Waves
```
Wave 1: 3 enemies  (2 warriors, 1 archer)
Wave 2: 5 enemies  (3 warriors, 2 archers)
Wave 3: 7 enemies  (4 warriors, 3 archers)
Wave 4: 9 enemies  (5 warriors, 4 archers)
Wave 5: 11 enemies (6 warriors, 5 archers)
```

### Leveling
- **XP Required:** level × 100 (100, 200, 300... 1000)
- **XP Sources:** Warrior kill (+50), Archer kill (+30)
- **Benefits:** HP +20, Damage +5, full heal, visual effects

### Buildings
- **4 Houses:** Spawn Ally Warriors (20s cooldown each)
  - House 1: x: 1750, y: 2450 (front-left)
  - House 2: x: 2850, y: 2450 (front-right)
  - House 3: x: 2100, y: 1950 (center-left)
  - House 4: x: 2500, y: 2300 (center-right)

- **2 Towers:** Spawn Ally Monks (20s cooldown each)
  - Tower 1: x: 1850, y: 2150 (left side)
  - Tower 2: x: 2750, y: 2150 (right side)

---

## 📁 File Structure

```
game/src/
├── config/
│   └── GameBalance.js           [All game values including allies/buildings]
├── entities/
│   ├── BaseCharacter.js         [Shared character logic]
│   ├── Player.js                [Warrior implementation]
│   ├── AllyCharacter.js         [AI ally base class]
│   ├── AllyWarrior.js           [Blue warrior ally]
│   ├── AllyMonk.js              [Blue monk healer]
│   ├── InteractiveBuilding.js   [Building interaction system]
│   ├── Enemy.js                 [AI opponents]
│   └── HealthPotion.js          [Collectible item]
├── scenes/
│   ├── BootScene.js             [Asset loading + blue unit sprites]
│   └── GameScene.js             [Main game loop + building management]
└── utils/
    ├── CollisionMap.js          [Terrain detection]
    ├── FloatingText.js          [Visual feedback]
    └── UIBars.js                [DOM health/XP bars]
```

---

## 🔧 Key Technical Details

### Configuration (GameBalance.js)
All tunable values in one place:
- Player stats (health, damage, speed, scaling)
- Ally stats (warrior, monk - health, damage, ranges, cooldowns)
- Enemy stats (health, damage, ranges, cooldowns)
- Progression (max level, XP formula)
- Buildings (interaction radius, spawn cooldown)
- Waves (spawn position, radius, scaling)
- Items (potion heal, drop rate)

### AllyCharacter Class
AI system for autonomous allies:
- **State machine:** `follow` → `engage` → `follow`
- `followLeader()` - Trails player at configurable distance
- `checkForEnemies()` - Scans for targets within assist radius
- `engageTarget()` - Pursues and attacks enemies
- Inherits from BaseCharacter (health, XP, visual feedback)

### InteractiveBuilding Class
Building interaction system:
- `checkProximity()` - Detects player within 100px
- `interact()` - Spawns ally, starts cooldown
- `updateUI()` - Shows prompts, cooldown bars
- Visual feedback with particle effects

### Collision System
- **Terrain:** Center-point RGB analysis (green island detection)
- **Buildings:** Static bodies, custom collision boxes
- **Trees:** Trunk-based collision
- **Bushes/Rocks:** Non-collidable (visual only)
- **Allies:** Collide with enemies, buildings, trees, each other

### Enemy Spawns
- **Location:** Castle gate (GameBalance.waves.castleGatePosition)
- **Pattern:** Warriors in inner circle (150px radius)
- **Pattern:** Archers in outer ring (200px radius, offset 45°)
- **Benefits:** Clear danger zone, survivors-like focus

---

## 🐛 Known Issues

**None currently.** All features working as intended:
- ✅ Allies follow and engage properly
- ✅ Building interactions work smoothly
- ✅ Cooldowns track correctly
- ✅ No console errors
- ✅ Performance stable with 6 allies + 10 enemies

---

## 🚫 What's NOT Implemented Yet

### Phase 4: Ability System
- [ ] Load slash effect assets (10 variants)
- [ ] AbilitySystem.js
- [ ] Unlock at levels 3/5/8/10
- [ ] Number key bindings (1-4)
- [ ] Power Slash, Whirlwind, Battle Charge, Titan Strike

### Phase 5: Enemy Tuning
- [ ] Test difficulty with full ally support
- [ ] Adjust enemy counts/stats
- [ ] Balance wave progression

### Phase 6: Meta Progression
- [ ] MetaProgressionSystem.js
- [ ] localStorage persistence
- [ ] Post-run summary screen
- [ ] Currency and upgrades

---

## 🎮 How to Play (Current)

### Controls
- **WASD:** Move
- **SPACE:** Attack
- **SHIFT:** Guard
- **E:** Interact with Buildings
- **R:** Restart (on game over/victory)

### Objective
Survive 5 waves of enemies spawning from the castle gate!

### Strategy
1. **Start of game:** Walk to houses/towers and press **E** to spawn allies
2. **During waves:** Let allies help fight while you focus on enemies
3. **After combat:** Use building cooldowns strategically
4. **Healing:** Monks auto-heal you, or collect health potions (30% drop)
5. **Leveling:** Kill enemies for XP → level up for stat boosts

### Tips
- Spawn warriors early for combat support
- Spawn at least one monk for healing
- Buildings have 20s cooldown - plan accordingly
- Guard (SHIFT) reduces damage by 50%
- Allies follow you automatically - keep moving!
- Attack in 4 directions based on movement

---

## 🔍 Quick Reference

### Common Tasks

**Tune Game Balance:**
```javascript
// Edit: game/src/config/GameBalance.js
GameBalance.player.warrior.startHealth = 150;  // Increase starting HP
GameBalance.allies.warrior.damage = 15;         // Make ally warriors stronger
GameBalance.buildings.spawnCooldown = 15000;    // Reduce cooldown to 15s
```

**Adjust Ally Behavior:**
```javascript
GameBalance.allies.warrior.assistRadius = 250;  // Increase engagement range
GameBalance.allies.monk.healCooldown = 3000;    // Heal more frequently
```

**Debug Physics:**
```javascript
// game/src/main.js, line 12
arcade: { debug: true }  // Shows collision boxes
```

---

## 📊 Git History

```bash
3cf15f6 - feat: Phase 2 & 3 - AI Ally System and Interactive Buildings
900ffe7 - Fix critical bugs from Phase 1 refactor
14cbcfe - Phase 1: Foundation refactor complete
```

---

## 🚀 Next Steps

See `ROADMAP.md` for Phase 4 (Ability System) implementation plan.

---

**This document represents the EXACT current state of the codebase.  
Update this file after completing each phase.**
