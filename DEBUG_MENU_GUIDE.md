# 🎮 Debug Menu Guide

## 📋 Overview

A pause/debug menu has been added to help you test abilities and features without enemy interference.

---

## 🎯 How to Use

### Opening the Menu
**Press ESC** at any time during gameplay

### Menu Features

#### 🔴 Toggle Enemies Button (Top)
- **Green Button = Enemies Enabled** (default)
- **Red Button = Enemies Disabled** (testing mode)

#### ⚡ Toggle Cooldowns Button (Bottom) - NEW!
- **Green Button = Cooldowns Enabled** (default)
- **Red Button = Cooldowns Disabled** (testing mode)

**What happens when you disable enemies:**
1. All current enemies are immediately destroyed
2. No new enemies spawn from waves
3. You can freely test abilities and movement
4. Perfect for testing slash effects!

**What happens when you disable cooldowns:**
1. All ability cooldowns instantly reset to 0
2. You can use abilities repeatedly without waiting
3. Press any ability key (1-0) as fast as you want
4. Perfect for rapid testing and visual comparison!

### Closing the Menu
**Press ESC again** to close and resume gameplay

---

## ⚙️ Menu Behavior

### When Menu is Open
- ✅ Physics paused (everything stops moving)
- ✅ You can click the button to toggle enemies
- ✅ Dark overlay covers the game
- ✅ All inputs work (ESC to close)

### When Menu is Closed
- ✅ Physics resume (game continues)
- ✅ Your selected settings persist
- ✅ No overlay

---

## 🧪 Testing Workflow

### Perfect for Ability Testing
1. **Press ESC** to open menu
2. **Click "Enemies: ENABLED"** button to disable
3. Button turns red: "Enemies: DISABLED"
4. **Press ESC** to close menu
5. **Press 1-0** to test all slash effects without interruption!
6. No enemies to distract you

### Re-enable Enemies
1. **Press ESC** to open menu
2. **Click "Enemies: DISABLED"** button to re-enable
3. Button turns green: "Enemies: ENABLED"
4. **Press ESC** to close menu
5. Waves will resume spawning enemies

---

## 🎨 Visual Design

**Menu Panel:**
- Dark gray background (0x222222)
- White border
- Centered on screen

**Button States:**
- **Green** = Enemies Enabled (hover: lighter green)
- **Red** = Enemies Disabled (hover: lighter red)
- **Interactive** = Hover effects + click feedback

**Text:**
- Title: "DEBUG MENU" (bold, white, outlined)
- Button: Current state displayed
- Footer: "Press ESC to close"

---

## 🔧 Technical Details

### Files Modified
- **`game/src/scenes/GameScene.js`**
  - Added `enemiesEnabled` flag
  - Added `menuOpen` flag
  - Created `createDebugMenu()` method
  - Created `toggleMenu()` method
  - Created `toggleEnemies()` method
  - Modified `startWave()` to check flag
  - Added ESC key handler

### Key Functions

**`toggleMenu()`**
- Shows/hides all menu elements
- Pauses/resumes physics

**`toggleEnemies()`**
- Toggles `enemiesEnabled` flag
- Destroys all active enemies when disabled
- Updates button appearance
- Logs status to console

**`startWave()` modification**
- Checks `enemiesEnabled` before spawning
- Skips wave if enemies disabled

---

## 🎯 Use Cases

### 1. **Testing Slash Effects**
Disable enemies to see each slash animation clearly without combat

### 2. **Testing Movement & Collision**
Explore the map and test collision boxes without enemy pressure

### 3. **Testing Ally Behavior**
Spawn allies from buildings and watch their idle/follow behavior

### 4. **Screenshot/Video Capture**
Disable enemies for clean screenshots of abilities

### 5. **Learning Controls**
Practice abilities in a safe environment

---

## ⌨️ Updated Controls

```
WASD      - Move
SPACE     - Attack
SHIFT     - Guard
E         - Interact with Buildings
1-0       - Use Abilities
ESC       - Open/Close Debug Menu
```

---

## 💡 Tips

- **Enemies disabled** is saved while menu is open/closed
- You can toggle enemies on/off as many times as you want
- The menu pauses physics, so it's safe to leave open
- Console logs show when enemies are enabled/disabled
- Perfect for ability testing without interruption!

---

## 🐛 Console Messages

When you toggle enemies, you'll see:
```
Enemies ENABLED
// or
Enemies DISABLED
```

When waves are skipped (enemies disabled):
```
Wave skipped - enemies disabled
```

---

**Pro Tip:** Disable enemies, spawn some allies from buildings, and test all 10 abilities with 1-0 keys for the best testing experience! 🎮✨

