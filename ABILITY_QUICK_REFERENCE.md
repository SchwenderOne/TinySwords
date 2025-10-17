# ⚔️ Ability System Quick Reference

## 🎮 How to Use Abilities

**Press ESC** to open debug menu and disable enemies for easier testing!

Press number keys **1-0** to activate abilities:

```
1 = Quick Slash        (2s CD, 25 dmg, 150px range)
2 = Diagonal Strike    (3s CD, 30 dmg, 160px range)
3 = Vertical Smash     (4s CD, 40 dmg, 170px + 100px AOE) ⭐
4 = Spinning Slash     (5s CD, 35 dmg, 180px + 120px AOE) ⭐
5 = Power Strike       (6s CD, 50 dmg, 190px range)
6 = Cross Slash        (5.5s CD, 45 dmg, 160px + 110px AOE) ⭐
7 = Quick Jab          (1.5s CD, 20 dmg, 140px range) ⚡ FASTEST
8 = Circular Slash     (4.5s CD, 38 dmg, 175px + 130px AOE) ⭐
9 = Wave Slash         (4s CD, 35 dmg, 200px range)
0 = Ultimate Strike    (20s CD, 100 dmg, 220px + 200px AOE) 💥 POWERFUL
```

⭐ = AOE (hits multiple enemies)  
⚡ = Fast Cooldown  
💥 = Ultimate Ability

---

## 📍 Collision Box Locations

### **All Characters** (Player, Allies, Enemies Base)
**File:** `game/src/entities/BaseCharacter.js`  
**Line 55-56:**
```javascript
this.body.setSize(60, 80);     // Width, Height
this.body.setOffset(66, 90);   // X offset, Y offset
```

### **Enemies** (Red Warriors, Archers)
**File:** `game/src/entities/Enemy.js`  
**Line 44-45:**
```javascript
this.body.setSize(60, 80);
this.body.setOffset(66, 50);
```

### **Buildings** (`game/src/scenes/GameScene.js`)

**Castle** (Lines 112-113):
```javascript
castle.body.setSize(200, 160);
castle.body.setOffset(60, -64);
```

**Towers** (Lines 123-124, 134-135):
```javascript
tower.body.setSize(75, 200);
tower.body.setOffset(27, -144);
```

**Houses** (Lines 145-146, 156-157, 167-168, 178-179):
```javascript
house.body.setSize(85, 130);
house.body.setOffset(22, -68);
```

### **Trees** (`game/src/scenes/GameScene.js`)

**Large Trees** (Lines 230-231, repeated):
```javascript
tree.body.setSize(50, 90);
tree.body.setOffset(71, 76);
```

**Small Trees** (Lines 281-282, 289-290):
```javascript
tree.body.setSize(40, 70);
tree.body.setOffset(76, 52);
```

### **Attack Hitboxes**

**Player Attack** (`Player.js` Line 243):
```javascript
hitbox.body.setSize(80, 80);
```

**Ally Warrior Attack** (`AllyWarrior.js` Line 133):
```javascript
hitbox.body.setSize(80, 80);
```

---

## 🎯 Testing Workflow

1. **Start Game:** `cd game && npm run dev`
2. **Open:** http://localhost:3002/
3. **Spawn Enemies:** Wait for wave 1 to start
4. **Test Abilities:** Press 1-0 to see each slash effect
5. **Adjust Collision Boxes:** Edit files above, save, refresh browser

---

## 🔧 Quick Adjustments

### Make Ability More Powerful
**File:** `game/src/systems/AbilitySystem.js`  
**Find ability** (e.g., `ability1`) and change:
```javascript
damage: 50,        // Increase damage
cooldown: 1000,    // Reduce cooldown (faster)
range: 200,        // Increase range
```

### Change Slash Effect Appearance
**File:** `game/src/systems/AbilitySystem.js`, Line 245-248:
```javascript
slashSprite.setScale(0.5);           // Make bigger (0.3 = current)
slashSprite.setAlpha(1.0);           // More opaque (0.8 = current)
slashSprite.setBlendMode(Phaser.BlendModes.NORMAL);  // Change blend
```

### Adjust UI Icon Colors
**File:** `game/src/scenes/GameScene.js`, Lines 461-475:
```javascript
const colors = [
  0xff4444, // Red - Change these hex colors
  0xff8844, // Orange
  // ... etc
];
```

---

## ✅ Implementation Status

- [x] All 10 slash effects loaded
- [x] All 10 abilities implemented
- [x] Cooldown system working
- [x] Damage system integrated
- [x] UI with cooldown indicators
- [x] Number key bindings (1-0)
- [x] AOE damage support
- [x] Visual effects playing correctly

**All features working! Ready for testing! 🎉**

