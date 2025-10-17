# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TinySwords is a browser-based 2D action RPG built with Phaser 3. It features wave-based combat, two playable characters (Warrior and Monk), leveling system (max level 10), and character switching. The game is production-ready with all core features implemented.

## Quick Start

```bash
# Navigate to game directory
cd game

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Architecture

### Hybrid Rendering System

The game uses a **hybrid Canvas + DOM approach**:

- **DOM Overlay (z-index: 1000)**: Health and XP bars (top-left, fixed position)
  - Managed by `UIBars.js`
  - Styled in `index.html` CSS
  - **Critical**: DOM was chosen because Phaser Graphics had rendering issues

- **Phaser Canvas**: Game world, characters, enemies, effects
  - Map: 6496×6640 pixels
  - Camera: 1.5x zoom, follows active character
  - Physics: Arcade (no gravity, top-down)

### Project Structure

```
game/
├── index.html              # Entry point + DOM UI overlay
├── src/
│   ├── main.js            # Phaser config (1024×768, Arcade physics)
│   ├── scenes/
│   │   ├── BootScene.js   # Asset preloading
│   │   └── GameScene.js   # Main game logic (~700 lines)
│   ├── entities/
│   │   ├── Player.js      # Warrior character (~360 lines)
│   │   ├── Monk.js        # Healer character (~300 lines)
│   │   ├── Enemy.js       # AI opponents (~450 lines)
│   │   └── HealthPotion.js
│   └── utils/
│       ├── CollisionMap.js    # Pixel-perfect terrain detection
│       ├── FloatingText.js    # Visual feedback (damage, XP, level-up)
│       └── UIBars.js          # DOM bar controller
└── public/assets/         # Sprites, map, buildings, decorations
```

### Entry Points for Understanding the Codebase

1. **`GameScene.js`** - Start here. Contains wave system, character switching, environment setup
2. **`Player.js`** - Warrior mechanics (WASD, attack, guard, leveling)
3. **`Monk.js`** - Healer mechanics (WASD, AOE heal, leveling)
4. **`Enemy.js`** - AI state machine (patrol → chase → attack)

## Core Systems

### Wave System

Located in `GameScene.js` (~lines 338-391):

- 5 waves with scaling difficulty
- Formula: `enemyCount = (wave * 2) + 1`
- Composition: ~60% warriors, ~40% archers
- Rest periods between waves
- Victory after Wave 5

### Leveling System

Implemented in `Player.js` and `Monk.js` (~lines 306-340):

- Max level: 10 (hard cap)
- XP formula: `xpToNextLevel = level * 100`
- Sources: +50 XP (warrior kill), +30 XP (archer kill)
- Warrior scaling: +20 HP, +5 damage per level
- Monk scaling: +15 HP, +5 heal per level
- Full heal on level up with particle effects

### Combat System

**4-Directional Attacks** (`Player.js` ~lines 211-243):
- Hitbox positioned based on last WASD movement direction
- Vertical priority over horizontal for diagonal movement
- Hitbox: 80×80px, 50ms duration
- Damage: 15 (attack1), 25 (attack2)

**Enemy AI** (`Enemy.js` ~lines 190-290):
- State machine: PATROL → CHASE → ATTACK
- Warrior: 300 detection, 100 attack range, melee
- Archer: 450 detection, 400 attack range, projectiles

### Collision System

**Terrain** (`CollisionMap.js`):
- Method: Pixel-perfect RGB analysis of map image
- Green island detection: `r(100-180), g(150-220), b(80-160)`
- Check type: Center-point only (optimized, more forgiving)

**Environment Collisions** (`GameScene.js` ~lines 39-41, 99-173, 180-246):
- Buildings: Static physics bodies with custom collision boxes
  - Castle: 200×80px body, offset (60, 16)
  - Towers: 80×80px body, offset (24, 16)
  - Houses: 90×60px body, offset (19, 12)
- Trees: Static physics bodies with trunk-based collision
  - Large trees (Tree1/2): 40×60px body, offset (76, 46)
  - Small trees (Tree3/4): 30×40px body, offset (81, 52)
- Bushes & Rocks: Non-collidable (walkable)
- Physics groups: `buildingsGroup` and `treesGroup`

**Character Collisions** (Arcade Physics):
- Player ↔ Enemies: Collider (pushes back)
- Player ↔ Buildings: Collider (blocks movement)
- Player ↔ Trees: Collider (blocks movement)
- Monk ↔ Buildings/Trees: Collider (blocks movement)
- Enemies ↔ Buildings/Trees: Collider (navigation)
- Player ↔ Potions: Overlap (auto-pickup)
- Hitboxes ↔ Enemies: Overlap (damage)

**Depth Sorting** (`GameScene.js` ~lines 593-623):
- System: Y-position based depth (`depth = entity.y`)
- Objects lower on screen render in front
- Applied to: players, enemies, buildings, trees, decorations
- Shadows always at depth 0 (bottom layer)
- Health bars at character depth + 1/+2

### Character Switching

Implemented in `GameScene.js` (~lines 541-686):
- Press ESC to open menu
- Switch between Warrior and Monk
- Dead characters revive at full HP on switch
- Camera follows active character
- UI updates automatically

## Common Development Tasks

### Adjusting Game Balance

**Enemy Stats** (`Enemy.js`, lines 17-31):
```javascript
// Red Warrior
this.health = 100;
this.attackDamage = 10;
this.moveSpeed = 120;
this.attackRange = 100;
this.detectionRange = 300;
```

**Player Stats** (`Player.js`, lines 16-19):
```javascript
this.health = 100;
this.maxHealth = 100;
this.moveSpeed = 200;
this.attackDamage = 20;
```

**Wave Count** (`GameScene.js`, line 14):
```javascript
this.maxWaves = 5;  // Change to add more waves
```

**Level Cap** (`Player.js` & `Monk.js`, ~line 315):
```javascript
if (this.level >= 10) return;  // Change 10 to new cap
```

### Adding a New Enemy Type

1. Add sprite sheets to `public/assets/{faction}-{unit}/`
2. Load in `BootScene.js` with `frameWidth: 192, frameHeight: 192`
3. Create animations in `Enemy.js` constructor (~line 60)
4. Add type logic in `Enemy.js` constructor (~line 17)
5. Spawn in `GameScene.js` `startWave()` (~line 360)

### Adding a New Character

1. Create class file in `src/entities/` extending `Phaser.Physics.Arcade.Sprite`
2. Implement `constructor()`, `createAnimations()`, `update()`, `levelUp()`
3. Import in `GameScene.js`
4. Add to character switching menu (~line 450)
5. Handle in `update()` loop (~line 500)

### Debugging Common Issues

**Character spawns in wrong location:**
- Check `GameScene.js`, line 42: `new Player(this, 2310, 2040, ...)`
- Player spawn: (2310, 2040) on 6496×6640 map

**Collision detection too strict/loose:**
- Adjust RGB ranges in `CollisionMap.js`, line 30

**UI bars not updating:**
- Check `UIBars.js` is being called in `GameScene.js` update loop (~lines 510-511)
- Verify DOM elements exist: `document.getElementById('health-bar')`

**Enemies not attacking:**
- Check `Enemy.js` attack range (~line 200)
- Verify `attackCooldown` is decrementing (~line 171)

## Key Technical Decisions

### Why DOM Overlay for Health/XP Bars?

**Problem**: Phaser Graphics/Rectangles had rendering issues (invisible despite correct settings)

**Solution**: HTML/CSS fixed-position overlay with `UIBars.js` controller

**Benefits**: Guaranteed visibility, smooth CSS transitions, no Phaser rendering quirks

### Why Center-Point Collision Only?

**Problem**: Area-based collision (5 points) was too strict

**Solution**: Check only center point of character

**Benefits**: More forgiving movement, better performance, matches player expectations

### Why 4-Directional Attacks?

**Problem**: Initial design only supported left/right

**Solution**: Track last WASD direction, position hitbox accordingly

**Benefits**: Intuitive combat, covers all directions, horizontal priority feels natural

### Why Level Cap at 10?

**Problem**: Unlimited leveling causes balance issues

**Solution**: Hard cap with XP clamping

**Benefits**: Predictable balance, sense of completion, prevents power creep

## Asset Guidelines

### Sprite Sheet Format
- Size: 192×192 pixels per frame
- Layout: Horizontal strip
- Format: PNG with transparency
- Naming: `{Unit}_{Animation}.png`

### Frame Rates
- Idle: 6 FPS
- Run: 8-10 FPS
- Attack: 10-12 FPS
- Special: 12 FPS

### Loading in BootScene.js
```javascript
this.load.spritesheet('key-name', '/assets/path/file.png', {
  frameWidth: 192,
  frameHeight: 192
});
```

## Important Constants

- **Map Size**: 6496×6640 pixels
- **Player Spawn**: (2310, 2040)
- **Camera Zoom**: 1.5x
- **Max Waves**: 5
- **Max Level**: 10
- **Health Potion Drop Rate**: 30%
- **Health Potion Heal**: 30 HP

## Physics Configuration

```javascript
// main.js
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 },  // Top-down, no gravity
    debug: false        // Set true to see collision boxes
  }
}
```

## Controls

- **WASD**: Movement
- **SPACE**: Attack (Warrior) / Heal (Monk)
- **SHIFT**: Guard (Warrior only, 50% damage reduction)
- **ESC**: Character selection menu
- **R**: Restart game (when game over/victory)

## Performance Notes

- Target: 60 FPS on modern browsers
- Optimizations: Center-point collision, enemy AI state machines, DOM UI caching
- Potential bottlenecks: >20 enemies, >50 floating text objects
- Collision boxes: 60×80 (offset 66, 90) for characters

## Debug Mode

Enable in `main.js`:
```javascript
arcade: {
  debug: true  // Shows collision boxes, velocities, etc.
}
```

## Testing Quick Checklist

1. Load game → Island visible, player spawns, bars display
2. WASD → Movement works, stays on island
3. SPACE → Attack/heal animation plays
4. Defeat enemy → XP gain, floating numbers, maybe potion drop
5. Level up → "LEVEL UP!" text, full heal, stat increase
6. ESC → Menu opens, character switching works
7. Defeat all enemies → Next wave announcement
8. Wave 5 complete → Victory screen
9. Press R → Restart works

## Additional Documentation

- **README.md**: User-facing documentation, features, controls
- **DEVELOPMENT_GUIDE.md**: Detailed development guide with code locations
- **GAME_PLAN.md**: Complete architecture and technical breakdown
- **IMPLEMENTATION_SUMMARY.md**: Technical implementation details

## Technology Stack

- Phaser 3.90.0 (game framework)
- Vite 5.0 (build tool, dev server)
- JavaScript ES6+ (modules)
- DOM/CSS (UI overlay)
- to memorize Always use the available mcp servers proactively.