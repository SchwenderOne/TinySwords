# 🏰 TinySwords - Medieval Warriors Game

A browser-based 2D action game built with Phaser 3, featuring medieval warriors battling on a pixelated island battlefield.

![Game Screenshot](map-2.png)

## 🎮 Features

- **Two Playable Characters:**
  - **Warrior** - Melee combat specialist with sword attacks and guard ability
  - **Monk** - Support healer with area-of-effect healing ability

- **Character Switching:** Press `ESC` to switch between characters mid-game
- **Enemy AI:** Red team warriors and archers with patrol, chase, and attack behaviors
- **Pixel-Perfect Collision:** Map-based collision detection for terrain boundaries
- **Smooth Animations:** All characters feature idle, run, and action animations
- **Dynamic Combat:** Real-time melee and ranged combat system

## 🕹️ Controls

- **WASD** - Move character
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
- Buildings (Castle, Houses, Towers)
- Terrain tiles and decorations
- Water, trees, rocks, and other environmental elements

## 🛠️ Technology Stack

- **Phaser 3.90.0** - Game framework
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language

## 📁 Project Structure

```
TinySwords/
├── game/                    # Game source code
│   ├── src/
│   │   ├── entities/       # Player, Monk, Enemy classes
│   │   ├── scenes/         # BootScene, GameScene
│   │   ├── utils/          # CollisionMap utility
│   │   └── main.js         # Game configuration
│   ├── public/assets/      # Game assets (sprites, maps)
│   ├── index.html
│   └── package.json
├── Units/                   # Original sprite sheets
├── Buildings/              # Building assets
├── Decorations/            # Environmental decorations
├── Terrain/                # Terrain tiles
└── map-2.png               # Game map
```

## 🎯 Gameplay

### Objective
Defeat all enemy warriors and archers on the island to achieve victory!

### Characters

**Warrior (Black)**
- Health: 100
- Speed: 200
- Damage: 20
- Special: Guard (50% damage reduction)

**Monk (Black)**
- Health: 80
- Speed: 175
- Damage: 0
- Special: Area Heal (30 HP, 160 radius, 3s cooldown)

### Enemies

**Red Warrior**
- Health: 100
- Speed: 100
- Damage: 15
- Behavior: Patrols, chases, melee attacks

**Red Archer**
- Health: 60
- Speed: 80
- Damage: 10
- Behavior: Stationary, ranged attacks (400 range)

## 🔧 Development

### Key Components

- **CollisionMap.js** - Pixel-perfect collision detection based on map terrain
- **Player.js** - Warrior character controller
- **Monk.js** - Monk character controller with healing mechanics
- **Enemy.js** - AI-controlled enemy with state machine (patrol/chase/attack)
- **GameScene.js** - Main game logic and scene management

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
- Phaser.js community
- [Phaser Documentation](https://phaser.io/docs)

