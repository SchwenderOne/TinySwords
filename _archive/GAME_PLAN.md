# Game Architecture & Implementation Plan

## Current Status: ✅ COMPLETE - Production Ready

This document outlines the architecture of the TinySwords medieval browser game. All features described below are **fully implemented and tested**.

---

## Technology Stack

**Game Engine**: Phaser 3.90.0  
**Build Tool**: Vite 5.0 (fast HMR, optimized builds)  
**Language**: JavaScript ES6+ (modules)  
**UI System**: Hybrid (Phaser Canvas + DOM Overlay)  
**Dev Server**: Vite dev server (port 3000)

---

## Architecture Overview

### Hybrid Rendering System

```
┌─────────────────────────────────────┐
│   DOM Layer (z-index: 1000)        │
│   - Health Bar (Red gradient)       │
│   - XP Bar (Blue gradient)          │
│   - Position: Fixed top-left (6px)  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Phaser Canvas Layer               │
│   - Game world (6496×6640)          │
│   - Characters (players & enemies)  │
│   - Buildings & decorations         │
│   - Effects & animations            │
│   - Camera (1.5x zoom, follows)     │
└─────────────────────────────────────┘
```

**Why Hybrid?**
- DOM overlays guarantee UI visibility (no Phaser rendering issues)
- Canvas handles game world, physics, and animations efficiently
- Clean separation of concerns

---

## Project Structure

```
game/
├── index.html                 # HTML5 entry + DOM UI overlay
├── package.json              # Phaser 3.90, Vite 5.0
├── vite.config.js            # Asset optimization, dev server
│
├── src/
│   ├── main.js               # Phaser game config (1024×768, Arcade)
│   │
│   ├── scenes/
│   │   ├── BootScene.js      # Asset preloading with progress bar
│   │   └── GameScene.js      # Main game logic (700 lines)
│   │       ├── Wave system (5 waves, scaling difficulty)
│   │       ├── Character switching (ESC menu)
│   │       ├── Environment (buildings, decorations)
│   │       ├── Enemy spawning (warriors & archers)
│   │       ├── Victory/GameOver handling
│   │       └── UI integration (DOM bars + Phaser text)
│   │
│   ├── entities/
│   │   ├── Player.js         # Warrior class (~360 lines)
│   │   │   ├── WASD movement (200 speed)
│   │   │   ├── 4-directional attacks (SPACE)
│   │   │   ├── Guard ability (SHIFT, 50% damage reduction)
│   │   │   ├── XP & leveling (max level 10)
│   │   │   ├── Stat scaling (+20 HP, +5 damage/level)
│   │   │   └── 5 animations (idle, run, attack1, attack2, guard)
│   │   │
│   │   ├── Monk.js           # Healer class (~300 lines)
│   │   │   ├── WASD movement (175 speed)
│   │   │   ├── Area heal ability (SPACE, 160 radius)
│   │   │   ├── XP & leveling (max level 10)
│   │   │   ├── Stat scaling (+15 HP, +5 heal/level)
│   │   │   └── 4 animations (idle, run, heal, heal-effect)
│   │   │
│   │   ├── Enemy.js          # AI opponent (~450 lines)
│   │   │   ├── Two types: Warrior (melee) & Archer (ranged)
│   │   │   ├── State machine: Patrol → Chase → Attack
│   │   │   ├── Health bars (positioned above sprite)
│   │   │   ├── XP drops (+50 warrior, +30 archer)
│   │   │   ├── Health potion drops (30% chance)
│   │   │   └── Animations (idle, run, attack, shoot)
│   │   │
│   │   └── HealthPotion.js   # Collectible item (~50 lines)
│   │       ├── 30 HP restoration
│   │       ├── Physics sprite (pickupable)
│   │       └── Auto-collect on overlap
│   │
│   └── utils/
│       ├── CollisionMap.js   # Pixel-perfect terrain detection
│       │   ├── Map image analysis (RGB color matching)
│       │   ├── Green island identification
│       │   └── isWalkable(x, y) boundary checking
│       │
│       ├── FloatingText.js   # Visual feedback system
│       │   ├── Damage numbers (red, float up)
│       │   ├── Heal numbers (green, float up)
│       │   ├── XP gain (yellow, float up)
│       │   └── Level up (gold, large, bounce)
│       │
│       └── UIBars.js         # DOM health/XP bar controller
│           ├── updateHealth(current, max)
│           ├── updateXP(current, toNext, level)
│           └── show() / hide()
│
└── public/assets/
    ├── map-2.png             # 6496×6640 island battlefield
    ├── black-warrior/        # Player sprites (5 animations)
    ├── black-monk/           # Monk sprites (4 animations)
    ├── red-warrior/          # Enemy warrior sprites
    ├── red-archer/           # Enemy archer sprites + Arrow.png
    ├── buildings/            # Castle, houses, towers
    ├── decorations/          # Trees, bushes, rocks
    ├── health-bar-*.png      # Health/XP bar assets (unused now)
    ├── potion-red.png        # Health potion sprite
    └── Shadow.png            # Shadow overlay
```

---

## Core Systems

### 1. Game Loop (GameScene.js)

```javascript
create() {
  // 1. Load map (6496×6640 background)
  // 2. Generate collision map from map image
  // 3. Create buildings & decorations
  // 4. Spawn player at (2310, 2040)
  // 5. Spawn monk (inactive initially)
  // 6. Setup camera (1.5x zoom, follow player)
  // 7. Initialize UI (DOM bars + Phaser text)
  // 8. Start Wave 1
  // 9. Setup ESC menu for character switching
}

update(time, delta) {
  // Per-frame logic:
  // 1. Update active character (player or monk)
  // 2. Update all enemies (AI, health bars)
  // 3. Update health potions (check pickup)
  // 4. Update DOM bars (health, XP, level)
  // 5. Check wave completion
  // 6. Dynamic depth sorting (buildings/decorations)
  // 7. Handle game over / victory conditions
}
```

### 2. Wave System

```javascript
Wave Formula: enemyCount = (wave * 2) + 1
Composition: ~60% warriors, ~40% archers

Wave 1: 3 enemies  → 2 warriors, 1 archer
Wave 2: 5 enemies  → 3 warriors, 2 archers
Wave 3: 7 enemies  → 4 warriors, 3 archers
Wave 4: 9 enemies  → 5 warriors, 4 archers
Wave 5: 11 enemies → 6 warriors, 5 archers

Flow:
1. showWaveMessage("Wave X") → fade in/out
2. spawnEnemies(count)
3. Wait for all enemies defeated
4. If wave < 5: betweenWaves = true, nextWave()
5. If wave == 5: Victory screen
```

### 3. Leveling System

```javascript
// XP System
maxLevel = 10
xpToNextLevel = level * 100  // 100, 200, 300, ..., 1000

// XP Sources
warrior_kill: +50 XP
archer_kill: +30 XP

// Level Up Benefits
Warrior:
  maxHealth += 20  // 100 → 280 at level 10
  attackDamage += 5  // 20 → 65 at level 10
  
Monk:
  maxHealth += 15  // 80 → 215 at level 10
  healAmount += 5  // 30 → 75 at level 10

// Visual Feedback
- Floating "LEVEL UP!" text (gold, size 24)
- Particle burst (gold tint, 20 particles)
- Full health restoration
- XP bar reset
```

### 4. Combat System

```javascript
// Player Attacks (4-directional)
Hitbox Positioning:
  if (lastMovementY !== 0) {
    // Vertical attack (up/down)
    hitboxY = player.y + (lastMovementY * 60)
  } else {
    // Horizontal attack (left/right)
    hitboxX = player.x + (lastMovementX * 60)
  }

Hitbox Size: 80×80px
Hitbox Duration: 50ms
Damage: 15 (attack1), 25 (attack2)
Knockback: 100 velocity in attack direction

// Enemy AI (State Machine)
States: PATROL → CHASE → ATTACK

Transitions:
  distanceToPlayer > detectionRange → PATROL
  detectionRange >= distance > attackRange → CHASE
  distance <= attackRange && cooldown == 0 → ATTACK

Warrior:
  detectionRange: 300
  attackRange: 100
  attackCooldown: 1500ms
  attackDamage: 10

Archer:
  detectionRange: 450
  attackRange: 400
  attackCooldown: 2000ms
  attackDamage: 8
  projectileSpeed: 300 px/s
```

### 5. Collision System

```javascript
// Terrain Collision (CollisionMap.js)
Method: Pixel-perfect RGB analysis
Green Island Detection:
  r >= 100 && r <= 180
  g >= 150 && g <= 220
  b >= 80 && b <= 160

Check Type: Center-point only (optimized)
  isWalkable(character.x, character.y)

// Character Collision (Arcade Physics)
Player ↔ Enemies: Collider (pushes back)
Player ↔ Potions: Overlap (auto-pickup)
Hitboxes ↔ Enemies: Overlap (damage detection)

Collision Boxes:
  Player/Monk: 60×80 (offset 66, 90)
  Enemies: 60×80 (offset 66, 90)
  Hitboxes: 80×80 (temporary, 50ms)
```

### 6. UI System

```javascript
// DOM Overlay (index.html + UIBars.js)
Health Bar:
  Element: <div class="bar-fill health">
  Gradient: #ff4444 → #cc0000
  Width: 200px × 14px
  Update: Every frame via UIBars.updateHealth()

XP Bar:
  Element: <div class="bar-fill xp">
  Gradient: #4488ff → #0044cc
  Width: 200px × 14px
  Update: Every frame via UIBars.updateXP()

Position: Fixed top-left (6px, 6px)
Transition: 0.2s ease (CSS)

// Phaser UI (scrollFactor 0, depth 100)
- Controls text (top-left)
- Character indicator
- Wave counter (top-center)
- Wave announcements (center, fade)
- Game Over / Victory screens
```

---

## Animation Configuration

### Sprite Sheet Format
- **Frame Size:** 192×192 pixels
- **Layout:** Horizontal strips
- **Naming:** `{faction}-{unit}-{animation}`

### Frame Counts & Rates

**Black Warrior (Player):**
```
idle:    8 frames @ 6 FPS  (loop)
run:     6 frames @ 10 FPS (loop)
attack1: 4 frames @ 12 FPS (no loop)
attack2: 4 frames @ 10 FPS (no loop)
guard:   4 frames @ 8 FPS  (loop)
```

**Black Monk:**
```
idle:        6 frames @ 6 FPS  (loop)
run:         4 frames @ 8 FPS  (loop)
heal:        11 frames @ 12 FPS (no loop)
heal-effect: 11 frames @ 12 FPS (no loop, overlay)
```

**Red Warrior (Enemy):**
```
idle:    8 frames @ 6 FPS  (loop)
run:     6 frames @ 10 FPS (loop)
attack1: 4 frames @ 12 FPS (no loop)
guard:   4 frames @ 8 FPS  (loop)
```

**Red Archer (Enemy):**
```
idle:  8 frames @ 6 FPS  (loop)
run:   6 frames @ 10 FPS (loop)
shoot: 8 frames @ 10 FPS (no loop)
Arrow: Static sprite (projectile)
```

---

## Development Commands

```bash
# Install dependencies
cd game && npm install

# Development server (hot reload)
npm run dev
# → http://localhost:3000

# Production build
npm run build
# → outputs to game/dist/

# Preview production build
npm run preview
```

---

## Key Design Decisions

### 1. Why DOM Overlay for Health/XP Bars?
**Problem:** Phaser Graphics/Rectangles had rendering issues (invisible despite correct depth/scrollFactor)  
**Solution:** HTML/CSS fixed-position overlay  
**Benefits:**
- Guaranteed visibility (DOM renders on top of canvas)
- Smooth CSS transitions
- No Phaser rendering quirks
- Easy styling and debugging

### 2. Why Center-Point Collision Only?
**Problem:** Area-based collision (checking 5 points) was too strict  
**Solution:** Check only center point of character  
**Benefits:**
- More forgiving movement (characters can walk near edges)
- Better performance (fewer collision checks)
- Matches player expectations

### 3. Why 4-Directional Attacks Instead of 8?
**Problem:** Initial design only allowed left/right attacks  
**Solution:** Track last movement direction (WASD), position hitbox accordingly  
**Benefits:**
- More intuitive combat (attack where you're facing)
- Covers all cardinal directions
- Horizontal priority for diagonal movement (feels natural)

### 4. Why Level Cap at 10?
**Problem:** Unlimited leveling leads to balance issues  
**Solution:** Hard cap with XP clamping  
**Benefits:**
- Predictable balance (max stats known)
- Sense of completion
- Prevents exponential power growth

---

## Performance Considerations

**Target:** 60 FPS on modern browsers

**Optimizations:**
- Center-point collision only (not area-based)
- Enemy AI state machines (efficient state transitions)
- DOM UI updates only on value change
- Depth sorting only for visible objects
- Sprite pooling for projectiles (archers)

**Potential Bottlenecks:**
- >20 enemies on screen (AI updates)
- >50 floating text objects (manual cleanup)
- Map size (6.5MB image, but loaded once)

---

## Future Expansion Ideas

**Gameplay:**
- [ ] More enemy types (Lancer, additional units)
- [ ] Boss battles (end of waves)
- [ ] Multiple maps / levels
- [ ] Difficulty modes (easy/normal/hard)
- [ ] Power-ups / buffs (speed, damage, shield)

**Characters:**
- [ ] Blue faction units (different stats)
- [ ] Yellow faction units
- [ ] Special abilities (ultimate attacks)
- [ ] Equipment system (weapons, armor)

**Systems:**
- [ ] Save/load game state (localStorage)
- [ ] Sound effects & music
- [ ] Mobile touch controls
- [ ] Gamepad support
- [ ] Multiplayer (co-op or PvP)

**Polish:**
- [ ] Minimap (corner overlay)
- [ ] Better particle effects
- [ ] Screen shake on impacts
- [ ] Damage numbers with random offset
- [ ] Victory screen with stats (kills, time, level)

---

## Testing Checklist

✅ **Warrior Mechanics**
- Movement in all directions (WASD)
- Attack in all 4 directions (SPACE + movement)
- Guard reduces damage by 50% (SHIFT)
- Level up increases HP and damage
- XP bar fills correctly
- Health bar decreases on damage

✅ **Monk Mechanics**
- Movement at correct speed (175)
- Heal ability restores HP (SPACE)
- Heal effect animation plays
- Level up increases HP and heal amount
- Can heal self when damaged

✅ **Character Switching**
- ESC opens menu
- Menu shows both characters
- Switching updates camera follow
- Dead characters revive at full HP on switch
- Active character indicator updates

✅ **Enemy AI**
- Warriors patrol when player far
- Warriors chase within 300px
- Warriors attack within 100px
- Archers shoot within 400px
- Health bars update correctly
- XP drops on death
- Potions drop 30% of time

✅ **Wave System**
- Wave 1 starts automatically
- Waves scale correctly (3, 5, 7, 9, 11)
- Wave announcements appear
- Rest periods between waves
- Victory screen after Wave 5

✅ **UI**
- Health bar visible top-left
- XP bar visible below health
- Bars update in real-time
- Text shows correct values
- Wave counter shows correct wave

✅ **Combat**
- Player attacks deal damage
- Enemies take damage and die
- Health potions heal player
- Floating damage numbers appear
- Level-up effects trigger
- Knockback works correctly

---

## Known Technical Details for Development

### Map Coordinates
- **Map Size:** 6496×6640 pixels
- **Player Spawn:** (2310, 2040)
- **Island Center:** ~(2300, 2200)
- **Camera Bounds:** (0, 0, 6496, 6640)
- **Camera Zoom:** 1.5x

### Phaser Configuration
```javascript
{
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  scenes: [BootScene, GameScene]
}
```

### Asset Paths
```
/assets/map-2.png
/assets/black-warrior/Warrior_{Idle|Run|Attack1|Attack2|Guard}.png
/assets/black-monk/{Idle|Run|Heal}.png
/assets/black-monk/Heal_Effect.png
/assets/red-warrior/Warrior_{Idle|Run|Attack1|Guard}.png
/assets/red-archer/Archer_{Idle|Run|Shoot}.png
/assets/red-archer/Arrow.png
/assets/buildings/{Castle|House1|House2|House3|Tower}.png
/assets/decorations/{Tree1-4|Bush1-3|Rock1-4}.png
/assets/potion-red.png
/assets/Shadow.png
```

---

**This document serves as the complete technical reference for the TinySwords game. All systems described are fully implemented and functional.**

**Last Updated:** October 2024  
**Status:** ✅ Production Ready
