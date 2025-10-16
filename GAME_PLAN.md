# Implementation Plan: Medieval Browser Game with Phaser 3

## Technology Stack
**Game Engine**: Phaser 3.87.0 (latest stable)  
**Build Tool**: Vite (fast modern bundler, hot reload)  
**Language**: JavaScript (ES6+)  
**Server**: Local development server (Vite dev server)

---

## Project Structure
```
game/
├── index.html                 # Main HTML entry point
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── src/
│   ├── main.js              # Phaser game initialization
│   ├── scenes/
│   │   ├── BootScene.js     # Asset loading
│   │   └── GameScene.js     # Main gameplay scene
│   ├── entities/
│   │   ├── Player.js        # Black Warrior player class
│   │   └── Enemy.js         # Red enemy units
│   └── utils/
│       └── CollisionMap.js  # Island boundary detection
└── assets/
    ├── map-2.png            # Level 1 background (copied)
    └── units/               # All sprite sheets (copied)
```

---

## Implementation Steps

### 1. Project Setup & Dependencies
**File: `package.json`**
- Dependencies: `phaser@^3.87.0`, `vite@^5.0.0`
- Dev scripts: `npm run dev`, `npm run build`

**File: `vite.config.js`**
- Configure asset handling for PNG files
- Set up dev server on port 3000

### 2. Map & Collision System
**File: `src/utils/CollisionMap.js`**
- Analyze `map-2.png` pixel data to identify green island boundaries
- Create collision mask from RGB values (green island pixels vs water)
- Implement `isWalkable(x, y)` method to check if position is on island
- Island detection: Check if pixel color matches green terrain (RGB range detection)

### 3. Black Warrior Player Entity
**File: `src/entities/Player.js`**

**Sprite Loading:**
- Load all 5 Black Warrior sprite sheets from `/Units/Black Units/Warrior/`
- Configure animations:
  - `idle`: 8 frames @ 6 FPS (loop)
  - `run`: 6 frames @ 10 FPS (loop)
  - `attack1`: 4 frames @ 12 FPS (no loop)
  - `attack2`: 4 frames @ 10 FPS (no loop)  
  - `guard`: 6 frames @ 6 FPS (loop)

**Frame Configuration:**
```javascript
// Each sprite sheet: 192px frame width
frameWidth: 192
frameHeight: 192
```

**Controls:**
- W/A/S/D: 8-directional movement (200 pixels/sec)
- SPACE: Attack (cycles between attack1/attack2)
- SHIFT: Guard/block state

**Collision Box:**
- X: 32, Y: 64, Width: 128, Height: 128 (per documentation)
- Anchor point: Center-bottom (96, 192)

**Movement Logic:**
- Before moving, check `CollisionMap.isWalkable(newX, newY)`
- If water detected, stop movement and play idle animation
- If valid terrain, apply velocity and play run animation

### 4. Combat System
**File: `src/entities/Player.js` (attack methods)**

**Attack Mechanics:**
- Hitbox extends 40px in facing direction during attack frames 2-3
- Damage values: attack1 (15 dmg), attack2 (25 dmg)
- Attack cooldown: 500ms between attacks
- Hitbox detection using Phaser arcade physics overlap

**Enemy Damage:**
- Check overlap between player hitbox and enemy collision boxes
- Apply damage and knockback to hit enemies
- Visual feedback: enemy flash red, health bar update

### 5. Enemy System (Red Units)
**File: `src/entities/Enemy.js`**

**Initial Enemy Types:**
- Red Warrior: Patrol behavior, melee combat
- Red Archer: Stationary, ranged attacks (use Arrow.png projectile)

**AI Behaviors:**
- Patrol: Move between waypoints on island
- Chase: When player within 300px range
- Attack: When player within attack range (melee: 60px, ranged: 400px)
- Health: Warriors (100 HP), Archers (60 HP)

**Spawning:**
- 2-3 Red Warriors patrolling island perimeter
- 1-2 Red Archers on elevated positions

### 6. Game Scene Setup
**File: `src/scenes/GameScene.js`**

**Create Method:**
1. Load map-2.png as static background image
2. Identify spawn point: Analyze map to find green island top-left coordinates (approximately x: 350, y: 300 based on visual)
3. Instantiate Black Warrior at spawn point
4. Create enemy group and spawn Red units
5. Setup collision detection between player, enemies, and terrain boundaries
6. Configure camera to follow player with lerp smoothing (0.1)

**Update Loop:**
- Process WASD input → update player velocity
- Check terrain collision before applying movement
- Update enemy AI behaviors
- Check combat hitbox overlaps
- Update camera position

**Camera Configuration:**
```javascript
this.cameras.main.startFollow(player, true, 0.1, 0.1);
this.cameras.main.setZoom(1.5); // Closer view for detail
```

### 7. Asset Loading
**File: `src/scenes/BootScene.js`**

**Load all required assets:**
- Background: `map-2.png`
- Black Warrior sprites (5 files)
- Red Warrior sprites (5 files)  
- Red Archer sprites (4 files)
- Shadow overlay: `Terrain/Shadow.png`

**Spritesheet configuration:**
```javascript
this.load.spritesheet('black-warrior-idle', 
  'assets/units/Black Units/Warrior/Warrior_Idle.png',
  { frameWidth: 192, frameHeight: 192 }
);
```

### 8. Input System
**File: `src/scenes/GameScene.js` (create method)**

```javascript
this.keys = {
  W: this.input.keyboard.addKey('W'),
  A: this.input.keyboard.addKey('A'),
  S: this.input.keyboard.addKey('S'),
  D: this.input.keyboard.addKey('D'),
  SPACE: this.input.keyboard.addKey('SPACE'),
  SHIFT: this.input.keyboard.addKey('SHIFT')
};
```

**Movement calculation in update():**
- Check 8 directions (W+A = diagonal up-left)
- Normalize velocity vector for consistent diagonal speed
- Apply to player physics body if terrain valid

---

## Key Technical Decisions

1. **Collision Detection Approach**: Pixel-perfect terrain detection by analyzing map image data, stored as collision mask for performance

2. **Sprite Animation System**: Use Phaser's AnimationManager with frame-based sprite sheets (horizontal strips)

3. **Combat Hit Detection**: Arcade physics overlap with timed hitbox activation during attack animation frames

4. **Enemy AI**: Simple state machine (Patrol → Chase → Attack) with distance-based triggers

5. **Camera**: Smooth follow with 1.5x zoom to show character detail while keeping combat area visible

---

## Expected Deliverables

1. Fully playable browser game running on `localhost:3000`
2. Black Warrior controlled with WASD, confined to green island
3. Combat system: SPACE to attack, SHIFT to guard
4. Red enemy units with basic AI (patrol/chase/attack)
5. Camera follows player smoothly
6. Asset integration: All sprites properly animated with correct frame rates

---

This plan creates a complete foundation for the medieval strategy game, with modular architecture allowing easy addition of more units, levels, and mechanics in future iterations.

