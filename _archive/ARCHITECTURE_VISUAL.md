# 🏗️ Architecture Visualization

Visual guide to understand the code transformation from current to target state.

---

## 📊 Current Architecture (Before Refactor)

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME SCENE                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Wave System (10 waves, perimeter spawns)                   │ │
│  │  • startWave() → spawn enemies at 8 fixed positions         │ │
│  │  • Victory after wave 10                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────┐        ┌──────────────┐                       │
│  │   PLAYER     │   ⟷   │     MONK     │  Character Switching  │
│  │  (Warrior)   │  ESC   │   (Healer)   │  via ESC menu        │
│  ├──────────────┤        ├──────────────┤                       │
│  │ • HP: 100    │        │ • HP: 80     │                       │
│  │ • Attack     │        │ • Heal       │                       │
│  │ • Guard      │        │ • Follow     │                       │
│  │ • Leveling   │        │ • Leveling   │                       │
│  │              │        │              │                       │
│  │ [370 lines]  │        │ [318 lines]  │  40% CODE OVERLAP!   │
│  └──────────────┘        └──────────────┘                       │
│         │                       │                                │
│         │                       │                                │
│         ▼                       ▼                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              ENEMY GROUP (Warriors + Archers)               │ │
│  │  • Red Warriors (melee, patrol → chase → attack)           │ │
│  │  • Red Archers (stationary, ranged, arrows)                │ │
│  │  • State machine AI                                         │ │
│  │  • Health bars above sprites                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    ENVIRONMENT                               │ │
│  │  • Buildings (static, collision only)                       │ │
│  │    - Castle, Houses x4, Towers x2                           │ │
│  │  • Trees (collision at trunk)                               │ │
│  │  • Decorations (bushes, rocks - no collision)              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   PROGRESSION                                │ │
│  │  • XP from kills → Level up (1-10 cap)                      │ │
│  │  • Stat increases only (HP +20, Damage +5)                  │ │
│  │  • No abilities, no unlocks                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

PROBLEMS:
❌ Code duplication between Player/Monk
❌ No configuration system (hardcoded values everywhere)
❌ Character switching doesn't fit survivors-like
❌ Buildings are just decoration
❌ No ally system
❌ No ability unlocks
❌ No meta progression
```

---

## 🎯 Target Architecture (After Refactor)

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME SCENE                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Wave System (10 waves, CASTLE GATE spawns)                 │ │
│  │  • Enemies spawn from castle front (radius)                 │ │
│  │  • Centralized danger zone                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│        ┌──────────────────────────────────┐                     │
│        │      BASE CHARACTER (abstract)   │                     │
│        │  ┌────────────────────────────┐  │                     │
│        │  │ • health, maxHealth        │  │                     │
│        │  │ • level, xp, xpToNextLevel │  │                     │
│        │  │ • takeDamage()             │  │   SHARED LOGIC     │
│        │  │ • heal()                   │  │   [150 lines]      │
│        │  │ • gainXP()                 │  │                     │
│        │  │ • levelUp()                │  │   NO DUPLICATION   │
│        │  │ • die()                    │  │                     │
│        │  └────────────────────────────┘  │                     │
│        └──────────────────────────────────┘                     │
│                      │                                           │
│        ┌─────────────┴─────────────┐                            │
│        │                           │                            │
│        ▼                           ▼                            │
│  ┌──────────────┐         ┌──────────────────┐                 │
│  │  PLAYABLE    │         │  ALLY CHARACTER  │                 │
│  │  CHARACTER   │         │    (abstract)    │                 │
│  │  (Warrior)   │         │  ┌────────────┐  │                 │
│  ├──────────────┤         │  │ • AI state │  │                 │
│  │ INPUT        │         │  │ • follow() │  │                 │
│  │ • WASD       │         │  │ • engage() │  │                 │
│  │ • SPACE      │         │  │ • assist() │  │                 │
│  │ • 1-4 keys   │         │  └────────────┘  │                 │
│  │              │         │        │          │                 │
│  │ ABILITIES    │         │  ┌─────┴──────┐  │                 │
│  │ • Lv3: Slash │         │  │            │  │                 │
│  │ • Lv5: Whirl │         │  ▼            ▼  │                 │
│  │ • Lv8: Dash  │         │ ┌────┐    ┌────┐ │                 │
│  │ • Lv10: Ult  │         │ │Ally│    │Ally│ │                 │
│  │              │         │ │Warr│    │Monk│ │                 │
│  │ [220 lines]  │         │ └────┘    └────┘ │                 │
│  └──────────────┘         └──────────────────┘                 │
│         │                          │                            │
│         │         ASSISTS          │                            │
│         ▼◄─────────────────────────┘                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              ENEMY GROUP (Warriors + Archers)               │ │
│  │  • Spawn from castle gate (radius)                          │ │
│  │  • Same AI system (patrol → chase → attack)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│         ▲                                                        │
│         │  E KEY                                                │
│         │                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            INTERACTIVE BUILDINGS                             │ │
│  │  ┌──────────────┐    ┌──────────────┐                      │ │
│  │  │   HOUSE 1-4  │    │   TOWER 1-2  │                      │ │
│  │  ├──────────────┤    ├──────────────┤                      │ │
│  │  │ Cooldown:    │    │ Cooldown:    │                      │ │
│  │  │ ▓▓▓▓▓▓░░░░   │    │ ▓▓▓▓░░░░░░   │  30s EACH           │ │
│  │  │              │    │              │                      │ │
│  │  │ Press E →    │    │ Press E →    │                      │ │
│  │  │ Ally Warrior │    │ Ally Monk    │                      │ │
│  │  └──────────────┘    └──────────────┘                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   PROGRESSION                                │ │
│  │  • XP from kills → Level up (1-10 cap)                      │ │
│  │  • Stat increases (HP, Damage)                              │ │
│  │  • ABILITY UNLOCKS at 3/5/8/10                             │ │
│  │    - Pause game, show ability modal                         │ │
│  │    - Preview effect animation                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  META PROGRESSION                            │ │
│  │  • Run ends → Stats tracked (wave, kills, time)            │ │
│  │  • Currency earned → localStorage                           │ │
│  │  • Upgrade shop (permanent buffs)                           │ │
│  │  • Press R → Restart | Press M → Meta Menu                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION SYSTEM                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  GameBalance.js - Single source of truth                    │ │
│  │  • player: { warrior: { health, damage, ... } }             │ │
│  │  • allies: { warrior: { ... }, monk: { ... } }              │ │
│  │  │ enemies: { warrior: { ... }, archer: { ... } }           │ │
│  │  • progression: { maxLevel, xpPerLevel, unlockLevels }      │ │
│  │  • buildings: { interactionRadius, cooldown }               │ │
│  │  • waves: { castleGatePos, spawnRadius }                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

SOLUTIONS:
✅ BaseCharacter eliminates duplication
✅ GameBalance.js centralizes all tuning
✅ Single hero (Warrior) with AI allies
✅ Buildings spawn allies (30s cooldown)
✅ Ability system with unlocks
✅ Meta progression with persistence
```

---

## 🔄 Data Flow: Current vs Target

### BEFORE: Character Switching Flow
```
Player Input (WASD, SPACE)
     │
     ├─ If Warrior Active → Player.update() → handleInput()
     │                          │
     │                          └─ Attack/Guard/Move
     │
     └─ If Monk Active → Monk.update() → handleInput()
                            │
                            └─ Heal/Move

ESC pressed → Open menu → Switch character → Transfer position
```

### AFTER: Single Hero + Ally Flow
```
Player Input
     │
     ├─ WASD → PlayableCharacter.handleInput() → Move
     ├─ SPACE → Attack (basic)
     ├─ 1-4 → AbilitySystem.useAbility(id) → Slash/Whirl/Dash/Ult
     └─ E → Check nearby building → InteractiveBuilding.interact()
                                            │
                                            └─ Spawn AllyCharacter
                                                     │
                                                     └─ AI Loop:
                                                         • follow player
                                                         • checkForEnemies()
                                                         • engage if found
                                                         • attackTarget()

All characters update simultaneously:
  • PlayableCharacter (1)
  • AllyCharacter (0-6)
  • Enemy (0-20)
```

---

## 🎮 Gameplay Loop Transformation

### BEFORE: Wave Survival + Character Switching
```
┌─────────────┐
│ Wave Start  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Enemies spawn from  │
│ 8 perimeter points  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐       ┌──────────────┐
│ Fight as Warrior    │◄─────►│ Switch to    │
│ or Monk             │  ESC  │ other char   │
└──────┬──────────────┘       └──────────────┘
       │
       ├─ Kill enemies → Gain XP → Level up (stats only)
       ├─ Pick up health potions
       └─ Use attacks/guard/heal
       │
       ▼
┌─────────────────────┐
│ All enemies dead    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Next wave (or win)  │
└─────────────────────┘
```

### AFTER: Survivors-Like with Allies
```
┌─────────────┐
│ Wave Start  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Enemies spawn from  │
│ CASTLE GATE (focus) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Survivors-Like Loop:                │
│                                     │
│ 1. Fight as Warrior (solo)          │
│    • Use abilities (1-4 keys)       │
│    • Kite enemies, survive          │
│                                     │
│ 2. Visit Buildings (E key)          │
│    ┌──────────┐    ┌──────────┐    │
│    │  House   │    │  Tower   │    │
│    │ [Ready]  │    │ [27s cd] │    │
│    │ Press E  │    │          │    │
│    └────┬─────┘    └──────────┘    │
│         │                           │
│         ▼                           │
│    ┌──────────┐                     │
│    │ Ally     │                     │
│    │ Warrior  │                     │
│    │ spawned! │                     │
│    └────┬─────┘                     │
│         │                           │
│         ▼                           │
│ 3. Allies Auto-Fight                │
│    • Follow player                  │
│    • Engage nearby enemies          │
│    • Deal ~20% of damage            │
│                                     │
│ 4. Level Up = New Abilities!        │
│    Lv3  → Power Slash unlocked      │
│    Lv5  → Whirlwind unlocked        │
│    Lv8  → Battle Charge unlocked    │
│    Lv10 → Titan Strike unlocked     │
│                                     │
│ 5. Strategize                       │
│    • When to visit buildings?       │
│    • Where to position?             │
│    • Which abilities to use?        │
│                                     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────┐
│ All enemies dead    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Next wave (or win)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Run Complete                    │
│ • Wave reached: 7               │
│ • Enemies killed: 42            │
│ • Survival time: 12m 34s        │
│ • Currency earned: 385 coins    │
│                                 │
│ [R] Restart    [M] Meta Menu    │
└─────────────────────────────────┘
       │
       ├─ R → New run (keep unlocks)
       │
       └─ M → Upgrade shop
              • +10 Max HP (50 coins)
              • +2 Damage (75 coins)
              • Unlock new character (500 coins)
```

---

## 📁 File Structure Evolution

### BEFORE
```
game/src/
├── main.js
├── scenes/
│   ├── BootScene.js
│   └── GameScene.js ⚠️ 746 lines, getting large
├── entities/
│   ├── Player.js ⚠️ 370 lines, duplicates Monk
│   ├── Monk.js ⚠️ 318 lines, duplicates Player
│   ├── Enemy.js ✅ 452 lines, well-structured
│   └── HealthPotion.js ✅ 72 lines
└── utils/
    ├── CollisionMap.js ✅ 112 lines
    ├── FloatingText.js ✅ 68 lines
    └── UIBars.js ✅ 54 lines

Total: ~2,240 lines
Problems:
  • 40% duplication (Player ↔ Monk)
  • No configuration
  • GameScene too large
  • No systems folder
```

### AFTER (TARGET)
```
game/src/
├── main.js
├── config/ ⭐ NEW
│   ├── GameBalance.js          [80 lines]  All tuning values
│   └── AbilityDefinitions.js   [60 lines]  Ability data
├── scenes/
│   ├── BootScene.js             [192 lines]
│   ├── GameScene.js             [600 lines] Simplified (extract wave logic)
│   └── MetaMenuScene.js ⭐ NEW  [200 lines] Upgrade shop
├── entities/
│   ├── BaseCharacter.js ⭐ NEW        [150 lines] Shared logic
│   ├── PlayableCharacter.js 🔄 NEW   [220 lines] From Player.js
│   ├── AllyCharacter.js ⭐ NEW        [200 lines] AI base
│   ├── AllyWarrior.js ⭐ NEW          [80 lines]  Melee ally
│   ├── AllyMonk.js ⭐ NEW             [120 lines] Healer ally
│   ├── Enemy.js                       [460 lines] Minor updates
│   ├── InteractiveBuilding.js ⭐ NEW  [150 lines] Building system
│   └── HealthPotion.js                [72 lines]
├── systems/ ⭐ NEW
│   ├── AbilitySystem.js ⭐ NEW              [300 lines] Ability mgmt
│   ├── MetaProgressionSystem.js ⭐ NEW      [200 lines] Save/load
│   └── WaveManager.js ⭐ NEW                [150 lines] Extract from GameScene
└── utils/
    ├── CollisionMap.js          [112 lines]
    ├── FloatingText.js          [68 lines]
    └── UIBars.js                [54 lines]

Total: ~3,400 lines (+1,160 lines, +52%)
Benefits:
  ✅ 0% duplication (BaseCharacter abstraction)
  ✅ Centralized configuration
  ✅ Better organized (config/, systems/)
  ✅ Modular systems (easy to extend)
```

---

## 🔀 Class Inheritance Diagram

### BEFORE: Flat Structure
```
Phaser.Physics.Arcade.Sprite
  ├── Player (370 lines)
  │   ├── takeDamage() 
  │   ├── heal()
  │   ├── gainXP()
  │   └── levelUp()
  │
  ├── Monk (318 lines)
  │   ├── takeDamage()  ⚠️ DUPLICATE
  │   ├── heal()        ⚠️ DUPLICATE
  │   ├── gainXP()      ⚠️ DUPLICATE
  │   └── levelUp()     ⚠️ DUPLICATE
  │
  └── Enemy (452 lines)
      ├── takeDamage()
      └── die()
```

### AFTER: Hierarchy with Abstraction
```
Phaser.Physics.Arcade.Sprite
  │
  └── BaseCharacter (150 lines) ⭐ NEW
        │
        ├── Shared Properties:
        │   • health, maxHealth
        │   • level, xp, xpToNextLevel
        │   • moveSpeed, attackDamage
        │   • shadow
        │
        ├── Shared Methods:
        │   • update(time, delta)
        │   • takeDamage(amount)
        │   • heal(amount)
        │   • gainXP(amount)
        │   • levelUp()
        │   • die()
        │   • destroy()
        │
        ├─── PlayableCharacter (220 lines) 🔄
        │      │
        │      ├── Player-specific:
        │      │   • Input handling (WASD, SPACE, 1-4)
        │      │   • Attack system
        │      │   • Guard ability
        │      │   • AbilitySystem integration
        │      │
        │      └── Override:
        │          • handleInput()
        │          • levelUp() → +abilities at 3/5/8/10
        │
        └─── AllyCharacter (200 lines) ⭐ NEW
               │
               ├── AI-specific:
               │   • aiState (follow, engage)
               │   • leader (player reference)
               │   • followDistance, assistRadius
               │
               ├── AI Methods:
               │   • updateAI()
               │   • followLeader()
               │   • checkForEnemies()
               │   • engageTarget()
               │
               ├─── AllyWarrior (80 lines) ⭐ NEW
               │      • Melee combat
               │      • Stats: 80 HP, 12 damage
               │
               └─── AllyMonk (120 lines) ⭐ NEW
                      • Heal on damage events
                      • Stats: 60 HP, 20 heal
                      • Override updateAI() for heal logic

Enemy (452 lines) - Separate hierarchy (keeps existing logic)
```

---

## 🎯 Key Transformations Summary

### 1. Code Organization
```
BEFORE: Flat, duplicated
AFTER:  Hierarchical, DRY
```

### 2. Configuration
```
BEFORE: Scattered magic numbers
AFTER:  GameBalance.js (single file)
```

### 3. Character System
```
BEFORE: Player ⟷ Monk (switch)
AFTER:  Player + Allies (cooperate)
```

### 4. Progression
```
BEFORE: Stats only
AFTER:  Stats + Abilities (Lv 3/5/8/10)
```

### 5. Buildings
```
BEFORE: Decoration
AFTER:  Interactive (spawn allies)
```

### 6. Enemy Spawns
```
BEFORE: Perimeter (8 points)
AFTER:  Castle gate (radius)
```

### 7. Meta
```
BEFORE: None
AFTER:  Currency + Upgrades + Persistence
```

---

## 💡 Visual Learning Aid

### If you're visual learner:
1. **Print this document** - Keep beside you while coding
2. **Draw on whiteboard** - Sketch BaseCharacter → Player/Ally
3. **Use sticky notes** - Track which phase you're in
4. **Color code** - Red = delete, Green = new, Yellow = modify

### If you're code learner:
1. **Read CODE_EXAMPLES.md** - See actual before/after
2. **Follow QUICK_START_REFACTOR.md** - Hands-on implementation
3. **Test incrementally** - Run game after each change

### If you're planning learner:
1. **Read REFACTORING_PLAN.md** - Full technical spec
2. **Create GitHub issues** - One per phase
3. **Track in project board** - Visualize progress

---

**This architecture transformation is achievable, well-planned, and will result in significantly better code!**

🚀 **Start with Phase 1** → Create BaseCharacter → Eliminate duplication → Build from there!

