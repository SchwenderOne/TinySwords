# 🎮 TinySwords - Current State

**Last Updated:** October 17, 2025 (Post-Phase 1)  
**Status:** ✅ Phase 1 Complete, Ready for Phase 2  
**Dev Server:** `cd game && npm run dev` → http://localhost:3002/

---

## 📦 What's Implemented (v0.2.0-phase1)

### ✅ Core Systems
- **Single Hero Gameplay:** Warrior only (character switching removed)
- **Wave System:** 5 waves, enemies spawn from castle gate
- **Combat:** 4-directional attacks, guard ability, knockback
- **Leveling:** XP gain, level up to 10, stat scaling
- **Health Potions:** 30% drop rate, 30 HP heal
- **UI:** DOM overlay (health/XP bars), floating text feedback
- **Collision:** Pixel-perfect terrain, buildings, trees

### 🏗️ Architecture (Post-Refactor)
```
BaseCharacter (abstract)
  ├── Player (Warrior)
  └── Monk (ready for AI conversion in Phase 2)

GameBalance.js (centralized config)
GameScene (simplified, 573 lines)
```

### 📊 Code Quality
- **0 duplication** between Player/Monk (was 40%)
- **Centralized config** (50+ values in GameBalance.js)
- **0 linter errors**
- **All tests passing**

---

## 🎯 Game Mechanics

### Player (Warrior)
- **Health:** 100 → 280 (level 10)
- **Damage:** 20 → 65 (level 10)
- **Speed:** 200
- **Abilities:**
  - Attack (SPACE): 4-directional, alternates attack1/attack2
  - Guard (SHIFT): 50% damage reduction

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

---

## 📁 File Structure

```
game/src/
├── config/
│   └── GameBalance.js        [All game values]
├── entities/
│   ├── BaseCharacter.js      [Shared character logic]
│   ├── Player.js             [Warrior implementation]
│   ├── Monk.js               [Ready for AI ally conversion]
│   ├── Enemy.js              [AI opponents]
│   └── HealthPotion.js       [Collectible item]
├── scenes/
│   ├── BootScene.js          [Asset loading]
│   └── GameScene.js          [Main game loop]
└── utils/
    ├── CollisionMap.js       [Terrain detection]
    ├── FloatingText.js       [Visual feedback]
    └── UIBars.js             [DOM health/XP bars]
```

---

## 🔧 Key Technical Details

### Configuration (GameBalance.js)
All tunable values in one place:
- Player stats (health, damage, speed, scaling)
- Enemy stats (health, damage, ranges, cooldowns)
- Progression (max level, XP formula)
- Waves (spawn position, radius, scaling)
- Items (potion heal, drop rate)

### BaseCharacter Class
Shared by all characters:
- Health management (`takeDamage()`, `heal()`)
- XP and leveling (`gainXP()`, `levelUp()`)
- Visual feedback (tints, floating text)
- Shadow and depth sorting
- Death handling

### Collision System
- **Terrain:** Center-point RGB analysis (green island detection)
- **Buildings:** Static bodies, custom collision boxes
- **Trees:** Trunk-based collision
- **Bushes/Rocks:** Non-collidable (visual only)

### Enemy Spawns
- **Location:** Castle gate (GameBalance.waves.castleGatePosition)
- **Pattern:** Warriors in inner circle (150px radius)
- **Pattern:** Archers in outer ring (200px radius, offset 45°)
- **Benefits:** Clear danger zone, survivors-like focus

---

## 🐛 Known Issues

**None currently.** All critical bugs from Phase 1 refactor have been fixed:
- ✅ Game over screen works
- ✅ XP gain works
- ✅ No console errors

---

## 🚫 What's NOT Implemented Yet

### Phase 2: Ally System
- [ ] AllyCharacter AI base class
- [ ] AllyWarrior (melee ally)
- [ ] AllyMonk (healer ally)
- [ ] AI behaviors (follow, engage)

### Phase 3: Building Interactions
- [ ] InteractiveBuilding class
- [ ] Proximity detection (100px radius)
- [ ] "Press E" prompts
- [ ] 30s cooldown system
- [ ] Ally spawning from buildings

### Phase 4: Ability System
- [ ] Load slash effect assets
- [ ] AbilitySystem.js
- [ ] Unlock at levels 3/5/8/10
- [ ] Number key bindings (1-4)

### Phase 5: Meta Progression
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
- **R:** Restart (on game over/victory)

### Objective
Survive 5 waves of enemies spawning from the castle gate!

### Tips
- Enemies spawn from the castle (center-north)
- Level up by killing enemies for stat boosts
- Guard (SHIFT) reduces damage by 50%
- Health potions have 30% drop chance
- Attack in 4 directions based on movement

---

## 🔍 Quick Reference

### Common Tasks

**Tune Game Balance:**
```javascript
// Edit: game/src/config/GameBalance.js
GameBalance.player.warrior.startHealth = 150; // Increase starting HP
GameBalance.enemies.warrior.damage = 15;      // Make enemies harder
```

**Add New Enemy Type:**
1. Add stats to `GameBalance.enemies`
2. Load sprites in `BootScene.js`
3. Create animations in `Enemy.js`
4. Spawn in `GameScene.startWave()`

**Debug Physics:**
```javascript
// game/src/main.js, line 12
arcade: { debug: true }  // Shows collision boxes
```

---

## 📊 Git History

```bash
900ffe7 - Fix critical bugs from Phase 1 refactor
14cbcfe - Phase 1: Foundation refactor complete
```

---

## 🚀 Next Steps

See `ROADMAP.md` for Phase 2 implementation plan.

---

**This document represents the EXACT current state of the codebase.  
Update this file after completing each phase.**

