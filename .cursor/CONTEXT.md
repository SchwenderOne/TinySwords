# 🤖 AI Assistant Context - TinySwords

**For:** Claude, GPT, and other AI assistants  
**Purpose:** Quick project understanding for seamless cross-session development

---

## ⚡ Quick Start (30 seconds)

```bash
cd game && npm run dev  # → http://localhost:3002/
```

**Current State:** Phase 1 Complete ✅  
**Next Task:** Phase 2 - Build Ally System  
**Read First:** `CURRENT_STATE.md` for exact implementation

---

## 📦 Project Overview

**TinySwords** - Browser-based 2D action RPG (Phaser 3)  
**Goal:** Transform into survivors-like game  
**Status:** Mid-refactor (Phase 1/7 complete)

### What It Is Now (v0.2.0)
- Single hero (Warrior) wave survival
- 5 waves, enemies from castle gate
- Level 1-10, XP system, health potions
- Clean architecture (BaseCharacter, GameBalance)

### What It Will Be (Target)
- Warrior + AI allies (from buildings)
- Abilities unlock at Lv3/5/8/10
- Building interactions (spawn allies)
- Meta progression (currency, upgrades)

---

## 🗂️ Documentation Map

| File | Purpose | When to Read |
|------|---------|--------------|
| `CURRENT_STATE.md` | **Exact current implementation** | Every session start |
| `TARGET_SPEC.md` | What we're building (end goal) | Understand scope |
| `ROADMAP.md` | How we get there (phases) | Plan work |
| `README.md` | User-facing (how to run) | Public info |

---

## 🏗️ Architecture (Post-Phase 1)

```
BaseCharacter (abstract)
  ├── Player extends BaseCharacter
  │     ├── Input handling (WASD, SPACE, SHIFT)
  │     ├── Attack system (4-directional)
  │     └── Guard ability
  │
  └── Monk extends BaseCharacter
        ├── Currently not used (character switching removed)
        └── Ready to convert to AllyMonk in Phase 2

GameBalance.js
  └── Centralized config for ALL game values

GameScene.js (573 lines)
  ├── Main game loop
  ├── Wave system (5 waves)
  ├── Enemy spawning (castle gate)
  └── Simplified (no character switching)
```

---

## 🎯 Key Files to Know

### Core Systems
- `game/src/config/GameBalance.js` - All tunable values
- `game/src/entities/BaseCharacter.js` - Shared character logic
- `game/src/scenes/GameScene.js` - Main game loop

### Entities
- `game/src/entities/Player.js` - Warrior implementation
- `game/src/entities/Monk.js` - Ready for AI conversion
- `game/src/entities/Enemy.js` - AI opponents
- `game/src/entities/HealthPotion.js` - Collectible item

### Utils
- `game/src/utils/CollisionMap.js` - Terrain detection
- `game/src/utils/FloatingText.js` - Visual feedback
- `game/src/utils/UIBars.js` - DOM health/XP bars

---

## 💡 Common Tasks

### Tune Game Balance
```javascript
// Edit: game/src/config/GameBalance.js
GameBalance.player.warrior.startHealth = 150;
GameBalance.enemies.warrior.damage = 15;
```

### Add Animation
```javascript
// In BootScene.js
this.load.spritesheet('key', '/assets/path.png', {
  frameWidth: 192, frameHeight: 192
});

// In entity createAnimations()
anims.create({
  key: 'anim-name',
  frames: anims.generateFrameNumbers('key', { start: 0, end: 5 }),
  frameRate: 10,
  repeat: -1
});
```

### Debug Physics
```javascript
// game/src/main.js, line 12
arcade: { debug: true }  // Shows collision boxes
```

---

## 🚨 Important Constraints

### What We Removed (Phase 1)
- ❌ Character switching (ESC menu)
- ❌ Monk as playable character
- ❌ currentCharacter state tracking

### Don't Add These (Yet)
- ❌ Multiple heroes (just Warrior)
- ❌ Boss battles (Phase 5+)
- ❌ Equipment system (out of scope)
- ❌ Sound/music (nice-to-have)

### Always Update
- ✅ `GameBalance.js` for new values
- ✅ `CURRENT_STATE.md` after phase completion
- ✅ Git commit messages (descriptive!)

---

## 🎮 Current Gameplay

**Objective:** Survive 5 waves from castle gate

**Controls:**
- WASD: Move
- SPACE: Attack (4-directional)
- SHIFT: Guard (50% damage reduction)
- R: Restart

**Mechanics:**
- Kill enemies → Gain XP → Level up (max 10)
- Level up: HP +20, Damage +5, full heal
- Health potions: 30% drop, 30 HP heal
- Enemies spawn from castle gate in circle

---

## 📊 Code Quality Standards

### We Maintain
- ✅ 0 code duplication
- ✅ All values in GameBalance.js
- ✅ JSDoc comments on public methods
- ✅ 0 linter errors
- ✅ Descriptive git commits

### Architecture Principles
1. **DRY:** Use BaseCharacter, don't duplicate
2. **Config:** All magic numbers in GameBalance.js
3. **Modularity:** One class = one file
4. **Testing:** Test after every change
5. **Commits:** Small, focused, descriptive

---

## 🔍 Debugging Tips

### Game Crashes?
1. Check browser console (F12)
2. Look for undefined references
3. Check if BaseCharacter methods called with `super.`

### Collision Issues?
1. Enable debug mode (see above)
2. Check body.setSize() and setOffset()
3. Verify collision groups and colliders

### XP/Leveling Broken?
1. Check Enemy.die() grants XP
2. Verify gainXP() calls BaseCharacter method
3. Check levelUp() stat increases

---

## 🚀 Phase 2 Preview (Next)

### What You'll Build
```javascript
// AllyCharacter.js - AI base class
export default class AllyCharacter extends BaseCharacter {
  constructor(scene, x, y, type) {
    super(scene, x, y, spriteKey, stats);
    this.aiState = 'follow'; // or 'engage'
    this.leader = scene.player;
  }
  
  updateAI() {
    if (this.aiState === 'follow') {
      this.followLeader();
      this.checkForEnemies();
    } else if (this.aiState === 'engage') {
      this.engageTarget();
    }
  }
}

// AllyWarrior.js
export default class AllyWarrior extends AllyCharacter {
  // Melee combat, auto-engage
}

// AllyMonk.js
export default class AllyMonk extends AllyCharacter {
  // Heal player when damaged
}
```

**See `ROADMAP.md` Phase 2 for full task list.**

---

## 📝 Session Workflow

### Start Session
1. `cd game && npm run dev`
2. Read `CURRENT_STATE.md` 
3. Check `ROADMAP.md` for next task
4. Review recent git commits

### During Session
1. Make small, testable changes
2. Test in browser after each change
3. Check console for errors
4. Commit frequently

### End Session
1. Commit all work
2. Update `CURRENT_STATE.md` if needed
3. Note blockers in ROADMAP
4. Push to git

---

## 🎯 Success Metrics

**You're doing it right if:**
- ✅ Game runs without errors
- ✅ Changes are in small commits
- ✅ Documentation stays updated
- ✅ Code follows existing patterns
- ✅ No duplication introduced

**Red flags:**
- ❌ Console errors ignored
- ❌ Large uncommented changes
- ❌ Hardcoded values added
- ❌ Documentation out of sync
- ❌ Breaking existing features

---

## 🔗 Asset Reference

### Sprite Dimensions
- All characters: 192×192px per frame
- Animations: horizontal strips

### Map
- Size: 6496×6640px
- Player spawn: (2310, 2040)
- Castle gate: (2310, 1850)

### Available Assets
- Player: Black Warrior (5 animations)
- Allies: Black Monk, Blue/Yellow units
- Enemies: Red Warriors, Red Archers
- Effects: 10 slash variants (not loaded yet)
- Buildings: Castle, Houses×4, Towers×2

---

## 💬 Communication Style

When working with humans:
- Be direct and practical
- Show code examples
- Test before suggesting
- Explain "why" not just "what"
- Acknowledge mistakes quickly

When uncertain:
- Read the code first
- Check CURRENT_STATE.md
- Ask specific questions
- Propose solutions, don't wait

---

**Last Updated:** October 17, 2025 (Post-Phase 1)  
**Next Update:** After Phase 2 completion

**Remember:** This is a live project. Always check git log and CURRENT_STATE.md for the latest!

