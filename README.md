# 🏰 TinySwords - Medieval Warriors Game

A browser-based 2D action RPG built with Phaser 3, featuring medieval warriors battling on a pixelated island battlefield with wave-based combat, leveling system, and character switching.

![Game Screenshot](map-2.png)

## 🎮 Features

- **Two Playable Characters:**
  - **Warrior** - Melee combat specialist with sword attacks and guard ability (100 HP, 200 speed)
  - **Monk** - Support healer with area-of-effect healing ability (80 HP, 175 speed)

- **Character Switching:** Press `ESC` to switch between characters mid-game via menu system
- **Wave-Based Combat:** 5 waves of increasingly difficult enemies with rest periods
- **Leveling System:** Gain XP from defeating enemies, level up (max level 10) to increase stats
- **Dynamic Combat:** 
  - 4-directional attacks (up, down, left, right)
  - Real-time melee and ranged combat
  - Enemy health bars displayed above units
- **Health Potions:** 30% chance to drop from defeated enemies
- **Visual Feedback:** 
  - Floating damage/heal numbers
  - Level-up effects
  - XP gain notifications
- **Environment:**
  - Pixel-perfect collision detection
  - Buildings (castle, houses, towers) with depth sorting
  - Decorations (trees, bushes, rocks)
- **Professional UI:** DOM-based health and XP bars with gradient styling

## 🕹️ Controls

- **WASD** - Move character in all directions
- **SPACE** - Attack (Warrior) / Heal (Monk)
- **SHIFT** - Guard (Warrior only - reduces damage by 50%)
- **ESC** - Open character selection menu
- **R** - Restart game (when game over/victory)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SchwenderOne/TinySwords.git
cd TinySwords
```

2. Navigate to the game directory and install dependencies:
```bash
cd game
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎨 Assets

This game uses the TinySwords pixel art asset pack, featuring:
- 4 color variations of units (Black, Blue, Red, Yellow)
- Multiple character types (Warrior, Monk, Archer, Lancer)
- Buildings (Castle, Houses, Towers) with dynamic depth sorting
- Terrain tiles and decorations (trees, bushes, rocks)
- Water, environmental elements, and shadows

## 🛠️ Technology Stack

- **Phaser 3.90.0** - Game framework
- **Vite 5.0** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **DOM/CSS** - UI overlay system for health/XP bars

## 📁 Project Structure

```
TinySwords/
├── game/                    # Game source code
│   ├── src/
│   │   ├── entities/       # Player, Monk, Enemy, HealthPotion classes
│   │   ├── scenes/         # BootScene, GameScene
│   │   ├── utils/          # CollisionMap, FloatingText, UIBars
│   │   └── main.js         # Game configuration
│   ├── public/assets/      # Game assets (sprites, maps, buildings, decorations)
│   ├── index.html          # HTML with UI overlay
│   └── package.json
├── Units/                   # Original sprite sheets
├── Buildings/              # Building assets
├── Decorations/            # Environmental decorations
├── Terrain/                # Terrain tiles
└── map-2.png               # Game map (6496x6640px)
```

## 🎯 Gameplay

### Objective
Survive 5 waves of enemies and achieve victory!

### Wave System
- **Wave 1:** 3 enemies (2 warriors, 1 archer)
- **Wave 2:** 5 enemies (3 warriors, 2 archers)
- **Wave 3:** 7 enemies (4 warriors, 3 archers)
- **Wave 4:** 9 enemies (5 warriors, 4 archers)
- **Wave 5:** 11 enemies (6 warriors, 5 archers)
- Rest periods between waves to prepare

### Leveling System
- **Max Level:** 10
- **XP Sources:** Defeat warriors (+50 XP) or archers (+30 XP)
- **Level Benefits:**
  - **Warrior:** +20 max HP, +5 attack damage per level
  - **Monk:** +15 max HP, +5 heal amount per level
  - Full heal on level up with particle effects

### Characters

**Warrior (Black)**
- Health: 100 (+20 per level)
- Speed: 200
- Damage: 20 (+5 per level)
- Special: Guard (50% damage reduction)
- Attacks in all 4 directions

**Monk (Black)**
- Health: 80 (+15 per level)
- Speed: 175
- Damage: 0 (healing support)
- Special: Area Heal (30 HP base +5 per level, 160 radius, cooldown)
- Heals self and nearby allies

### Enemies

**Red Warrior**
- Health: 100
- Speed: 120
- Damage: 10
- Attack Range: 100
- Behavior: Patrols, chases (300 range), melee attacks (1.5s cooldown)
- Health bar displayed above unit

**Red Archer**
- Health: 60
- Speed: 0 (stationary)
- Damage: 8
- Attack Range: 400
- Behavior: Ranged attacks with arrows (2s cooldown)
- Health bar displayed above unit

### Items

**Health Potion**
- Restores: 30 HP
- Drop Rate: 30% from defeated enemies
- Auto-pickup on contact

## 🔧 Development

### Key Components

- **UIBars.js** - DOM-based health/XP bar management system
- **CollisionMap.js** - Pixel-perfect collision detection based on map terrain
- **Player.js** - Warrior character controller with combat and leveling
- **Monk.js** - Monk character controller with healing mechanics and leveling
- **Enemy.js** - AI-controlled enemy with state machine (patrol/chase/attack) and health bars
- **HealthPotion.js** - Collectible healing item
- **FloatingText.js** - Damage, heal, XP, and level-up visual feedback
- **GameScene.js** - Main game logic, wave system, character switching

### UI System

The game uses a hybrid approach:
- **Canvas (Phaser):** Game world, characters, enemies, effects
- **DOM Overlay:** Health bar (red), XP bar (blue), positioned top-left with 6px margins
- **Benefits:** Always visible, smooth CSS transitions, no rendering issues

### Combat System

- **4-Directional Attacks:** Hitbox positioned based on last movement direction (WASD)
- **Damage Feedback:** Floating numbers, tint effects, knockback
- **Health Bars:** Real-time updates for all enemies above their sprites

### Debug Mode

To enable physics debug view, edit `game/src/main.js`:

```javascript
arcade: {
  debug: true  // Shows collision boxes and physics bodies
}
```

## 📝 License

This project uses the TinySwords asset pack. Please check the original asset license for usage rights.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- None currently

## 📮 Contact

Created by [@SchwenderOne](https://github.com/SchwenderOne)

## 🙏 Acknowledgments

- TinySwords asset pack creators
- Health Bar Asset Pack 2 by Adwit Rahman
- Phaser.js community
- [Phaser Documentation](https://phaser.io/docs)

---

**Current Status:** Fully playable with all core features implemented! ✅
