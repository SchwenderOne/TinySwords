# Medieval Warriors Game

A browser-based medieval strategy game built with Phaser 3 using the ReplitSwords asset pack.

## 🎮 Game Features

- **Black Warrior Player Character** with fluid animations
- **WASD Movement Controls** - 8-directional movement confined to the island
- **Combat System**:
  - SPACE: Attack (alternates between two attack types)
  - SHIFT: Guard/Block (50% damage reduction)
- **Enemy AI**:
  - Red Warriors: Patrol the island and chase the player
  - Red Archers: Stationary ranged attackers
- **Island Collision System**: Pixel-perfect terrain detection keeps player on the green island
- **Camera System**: Smooth following camera with 1.5x zoom
- **Health System**: Player and enemy health with visual feedback

## 🕹️ Controls

- **W/A/S/D**: Move in 8 directions
- **SPACE**: Attack (cycles between Attack 1 and Attack 2)
- **SHIFT**: Guard/Block stance
- **R**: Restart game (after game over or victory)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Navigate to the game directory:
```bash
cd game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
game/
├── index.html              # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── src/
│   ├── main.js           # Phaser game initialization
│   ├── scenes/
│   │   ├── BootScene.js  # Asset loading
│   │   └── GameScene.js  # Main gameplay scene
│   ├── entities/
│   │   ├── Player.js     # Black Warrior player class
│   │   └── Enemy.js      # Red enemy units (Warrior & Archer)
│   └── utils/
│       └── CollisionMap.js  # Island boundary detection
└── public/
    └── assets/           # All game sprites and images
```

## 🎨 Asset Credits

This game uses the ReplitSwords pixel art asset pack featuring:
- Black Warrior (Player) - 5 animation states
- Red Warriors & Archers (Enemies)
- Medieval terrain and map design

## 🛠️ Technical Details

- **Engine**: Phaser 3.87.0
- **Build Tool**: Vite 5.0
- **Physics**: Arcade Physics (top-down, no gravity)
- **Collision System**: Custom pixel-perfect terrain detection
- **Animation**: Sprite sheet based with frame-by-frame animations
- **Resolution**: 1024x768 game canvas

## 🎯 Game Objective

Defeat all Red enemies on the island while staying within the green terrain boundaries!

## 🐛 Debug Mode

To enable physics debug mode (shows collision boxes), edit `src/main.js`:

```javascript
physics: {
  arcade: {
    debug: true  // Change to true
  }
}
```

## 📝 License

Game assets from ReplitSwords pack. Game code MIT licensed.

