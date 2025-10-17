# 🎯 Target Specification - Survivors-Like MVP

**Goal:** Transform TinySwords into a survivors-like game  
**Based On:** `mvp_game_spec_survivors_like.md`  
**Target Completion:** ~10-12 weeks part-time

---

## 🎮 Core Vision

A **fast-paced, wave-based survivors-like** where the player controls the Warrior and builds power through:
- AI allies spawned from buildings
- Ability unlocks at levels 3/5/8/10
- Meta progression currency for permanent upgrades

---

## ✅ What Stays from Current Game

- ✅ Single hero (Warrior) gameplay
- ✅ Wave-based combat system
- ✅ Leveling to max level 10
- ✅ Enemy spawning from castle gate
- ✅ Combat mechanics (attacks, guard, damage)
- ✅ Visual feedback (floating text, effects)
- ✅ Collision and physics systems

---

## 🆕 What Gets Added

### Phase 2: Ally System
**Goal:** AI companions that follow and assist

**Allies:**
- **Ally Warrior** (from Houses): Melee combat, auto-engage enemies
- **Ally Monk** (from Towers): Follow player, heal on damage

**AI Behaviors:**
- `follow`: Trail player at distance
- `engage`: Attack nearby enemies
- `assist`: Support player in combat

**Stats (from GameBalance.js):**
- Ally Warrior: 80 HP, 12 damage, 150 speed
- Ally Monk: 60 HP, 20 heal amount, 140 speed

---

### Phase 3: Building Interactions
**Goal:** Strategic building usage with cooldowns

**Mechanics:**
- Proximity detection (100px radius)
- "Press E to spawn ally" prompt
- 30-second cooldown per building
- Visual cooldown bar above building
- Particle effect on spawn

**Buildings:**
- **Houses (×4):** Spawn Ally Warriors
- **Towers (×2):** Spawn Ally Monks
- **Castle:** Landmark (non-interactive in MVP)

---

### Phase 4: Ability System
**Goal:** Power progression through unlockable abilities

**Ability Unlocks:**
- **Level 3:** Power Slash (slash1 effect)
- **Level 5:** Whirlwind (slash2 effect)
- **Level 8:** Battle Charge (slash5 effect)
- **Level 10:** Titan Strike (slash10 effect)

**Implementation:**
- Use slash effect assets from `craftpix-net-825597-free-slash-effects-sprite-pack/`
- Bind to number keys (1, 2, 3, 4)
- Cooldown system per ability
- Pause game on unlock, show modal

---

### Phase 5: Meta Progression
**Goal:** Persistent upgrades across runs

**Currency System:**
- Earn coins based on: wave reached, enemies killed, survival time
- Store in localStorage

**Upgrades (Examples):**
- +10 Max HP (50 coins)
- +2 Attack Damage (75 coins)
- Faster Ability Cooldowns (100 coins)
- Unlock new characters (500 coins)

**Post-Run Flow:**
1. Run ends (death or victory)
2. Show summary: waves, kills, time, currency earned
3. Options: [R] Restart | [M] Meta Menu
4. Meta Menu: Spend currency, view stats

---

## 🎯 Gameplay Loop (Target)

```
Start Run
    ↓
Fight Waves (castle gate spawns)
    ↓
    ├─→ Kill enemies → Gain XP → Level up → Unlock abilities (3/5/8/10)
    ├─→ Visit buildings (E key) → Spawn allies → Allies auto-fight
    ├─→ Collect health potions
    └─→ Use abilities (1-4 keys) for power spikes
    ↓
Wave 5 Complete or Death
    ↓
Post-Run Summary
    ↓
Earn Currency → Spend on Upgrades → Start New Run (stronger)
```

---

## 📊 Comparison: Current vs Target

| Feature | Current (Phase 1) | Target (MVP Complete) |
|---------|-------------------|----------------------|
| **Hero** | Warrior only ✅ | Warrior only ✅ |
| **Allies** | None ❌ | AI Warriors & Monks ✅ |
| **Buildings** | Decoration ❌ | Interactive spawners ✅ |
| **Abilities** | Attack + Guard ⚠️ | +4 unlockable abilities ✅ |
| **Spawns** | Castle gate ✅ | Castle gate ✅ |
| **Meta** | None ❌ | Currency & upgrades ✅ |
| **Waves** | 5 waves ✅ | 5-10 waves (tunable) ✅ |

---

## 🎨 Assets Available

### Already in Project:
- ✅ Black Warrior (player) - 5 animations
- ✅ Black Monk (ally) - 4 animations
- ✅ Red Warriors & Archers (enemies)
- ✅ Blue/Yellow units (future enemy variants)
- ✅ Buildings (castle, houses, towers)
- ✅ Decorations (trees, bushes, rocks)
- ✅ Map (6496×6640)

### Need to Load:
- ⚠️ Slash effects (10 variants) from `craftpix-net-825597-free-slash-effects-sprite-pack/`

---

## 🚧 Out of Scope for MVP

These are **NOT** included in the initial survivors-like MVP:

- ❌ Multiple playable characters (just Warrior)
- ❌ Boss battles
- ❌ Multiple maps/levels
- ❌ Equipment system
- ❌ Sound effects / music
- ❌ Mobile touch controls
- ❌ Multiplayer

**Why?** Focus on core loop first. These can be added post-MVP.

---

## ✅ Success Criteria

The MVP is complete when:

1. **Ally System Works:**
   - Buildings spawn allies
   - Allies follow and fight autonomously
   - Allies feel helpful (>20% of total damage)

2. **Progression Feels Good:**
   - Abilities unlock at 3/5/8/10 feel impactful
   - Building cooldowns create strategic decisions
   - Power growth is perceivable wave-to-wave

3. **Meta Loop Hooks:**
   - Currency feels rewarding
   - Upgrades provide meaningful advantage
   - Player wants to "try one more run"

4. **Technical Quality:**
   - 60 FPS stable with 6 allies + 10 enemies
   - 0 critical bugs
   - Smooth UI/UX throughout

---

## 🎓 Design Principles

1. **Clarity over Complexity:** Simple mechanics, executed well
2. **Immediate Feedback:** Visual/audio response to all actions
3. **Smooth Difficulty Curve:** Each wave slightly harder
4. **Strategic Depth:** Building timing, ability usage decisions
5. **Respectful of Time:** Runs complete in 10-15 minutes

---

**This document defines WHAT we're building.  
See `ROADMAP.md` for HOW we get there.**

