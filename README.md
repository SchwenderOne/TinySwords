# 🏰 TinySwords - Survivors-Like RPG

A browser-based 2D action RPG built with Phaser 3, featuring wave-based combat, AI allies, and ability progression. Survive waves of enemies spawning from the castle gate!

![Game Screenshot](map-2.png)

**Status:** 🚧 In Development - Phase 1 Complete  
**Play Now:** `cd game && npm run dev` → http://localhost:3002/

---

## 🎮 Current Features (v0.2.0)

### Core Gameplay
- **Single Hero:** Play as the Warrior with melee combat and guard ability
- **Wave Survival:** Survive 5 progressively difficult waves
- **Leveling System:** Gain XP from kills, level up to 10 for stat boosts
- **Strategic Combat:** 4-directional attacks, guard ability (50% damage reduction)
- **Dynamic Spawns:** Enemies spawn from the castle gate in focused patterns

### Progression
- **XP Rewards:** +50 XP (warriors), +30 XP (archers)
- **Level Benefits:** +20 HP, +5 damage per level
- **Full Heal:** Restore to full health on level up

### Environment
- **Pixel-Perfect Collision:** Stay on the green island
- **Interactive Environment:** Buildings, trees with collision
- **Visual Feedback:** Floating damage/heal numbers, level-up effects
- **Professional UI:** DOM-based health and XP bars

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| **WASD** | Move in all directions |
| **SPACE** | Attack (direction based on movement) |
| **SHIFT** | Guard (50% damage reduction) |
| **R** | Restart game (after death/victory) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation & Run

```bash
# Clone repository
git clone https://github.com/SchwenderOne/TinySwords.git
cd TinySwords

# Install dependencies
cd game
npm install

# Start development server
npm run dev
```

Open browser to **http://localhost:3002/**

### Production Build

```bash
npm run build
```

Built files will be in `game/dist/`

---

## 🎯 Gameplay

### Objective
Survive 5 waves of enemies spawning from the castle gate!

### Wave Progression
```
Wave 1: 3 enemies  (2 warriors, 1 archer)
Wave 2: 5 enemies  (3 warriors, 2 archers)
Wave 3: 7 enemies  (4 warriors, 3 archers)
Wave 4: 9 enemies  (5 warriors, 4 archers)
Wave 5: 11 enemies (6 warriors, 5 archers)
```

### Enemy Types
- **Red Warriors:** Melee attackers, patrol and chase
- **Red Archers:** Stationary ranged units (400px range)

### Tips
- Enemies spawn from the castle at the north
- Use guard (SHIFT) when surrounded
- Health potions have 30% drop chance
- Level up fully restores your health
- Attack direction follows your last movement

---

## 🛠️ Technology Stack

- **Engine:** Phaser 3.90.0
- **Build Tool:** Vite 5.0 (fast HMR)
- **Language:** JavaScript ES6+
- **UI:** Hybrid Canvas + DOM overlay
- **Physics:** Arcade (top-down, no gravity)

---

## 📁 Project Structure

```
game/
├── src/
│   ├── config/
│   │   └── GameBalance.js      # Centralized game configuration
│   ├── entities/
│   │   ├── BaseCharacter.js    # Shared character logic
│   │   ├── Player.js           # Warrior implementation
│   │   ├── Enemy.js            # AI opponents
│   │   └── HealthPotion.js     # Collectible items
│   ├── scenes/
│   │   ├── BootScene.js        # Asset loading
│   │   └── GameScene.js        # Main game loop
│   └── utils/
│       ├── CollisionMap.js     # Terrain detection
│       ├── FloatingText.js     # Visual feedback
│       └── UIBars.js           # Health/XP bars
└── public/assets/              # Sprites, map, buildings

Assets/                         # Source art files
├── Units/                      # Character sprites
├── Buildings/                  # Structures
├── Decorations/               # Trees, bushes, rocks
└── Terrain/                    # Tilemap assets
```

---

## 🚧 Upcoming Features

### Phase 2: AI Allies (In Progress)
- Spawn ally warriors and monks from buildings
- AI companions that follow and assist in combat

### Phase 3: Building Interactions
- Interactive buildings with 30-second cooldowns
- Strategic ally spawning system

### Phase 4: Ability System
- Unlock powerful abilities at levels 3, 5, 8, 10
- New attacks from slash effect asset pack

### Phase 5: Meta Progression
- Persistent upgrades across runs
- Currency system for permanent buffs

See `ROADMAP.md` for detailed development plan.

---

## 🎨 Assets

This game uses the TinySwords pixel art asset pack:
- 4 color factions (Black, Blue, Red, Yellow)
- Multiple unit types (Warrior, Monk, Archer, Lancer)
- Buildings, decorations, terrain tiles
- 6496×6640px island battlefield

Additional assets:
- Health Bar Asset Pack 2 by Adwit Rahman
- Free Slash Effects Sprite Pack by Craftpix

---

## 🐛 Known Issues

**None currently.** All critical bugs have been fixed.

Report issues on GitHub or see `CURRENT_STATE.md` for development status.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Check `CURRENT_STATE.md` for current implementation
2. Read `TARGET_SPEC.md` for end goals
3. Follow existing code patterns (BaseCharacter, GameBalance)
4. Test thoroughly before submitting PR

---

## 📝 Development Documentation

For developers and AI assistants:
- **CURRENT_STATE.md** - Exact current implementation
- **TARGET_SPEC.md** - End goals and vision
- **ROADMAP.md** - Development phases and tasks
- **.cursor/CONTEXT.md** - AI assistant quick reference

---

## 📄 License

Game assets from TinySwords asset pack - check asset license for usage rights.  
Game code: MIT License

---

## 🙏 Acknowledgments

- TinySwords asset pack creators
- Health Bar Asset Pack 2 by Adwit Rahman
- Phaser.js community
- [Phaser Documentation](https://phaser.io/docs)

---

## 📮 Contact

Created by [@SchwenderOne](https://github.com/SchwenderOne)

---

**Current Version:** v0.2.0-phase1  
**Last Updated:** October 17, 2025  
**Status:** ✅ Phase 1 Complete, 🚧 Phase 2 Starting
