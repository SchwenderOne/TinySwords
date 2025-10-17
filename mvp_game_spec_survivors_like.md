# 🕹️ MVP Game Spec – Survivors‑Like (Warrior Focus)

## 1) Vision & Scope

A fast‑paced, wave‑based **survivors‑like** where the player chooses a character and tries to outscale escalating enemy waves via level‑ups, items, and abilities. This MVP focuses on the **Warrior** as the playable hero. Additional hero colors represent **enemy factions** for this first version.

**Run structure (high level):**

1. Select Warrior → spawn on island map.
2. Survive progressively harder waves that spawn near the **castle gate**.
3. Level up to **cap 10**; unlock abilities at **Lv3, 5, 8, 10**.
4. Use buildings every **30s** to spawn limited **ally units** (auto‑combat/assist).
5. Run ends on player death (MVP). Post‑run summary + meta currency awarded.

## 2) Core Loop

**Explore → Fight → Collect → Level Up → Power Spike → Survive Next Wave.**

- Pickups (coins, items) drive build growth.
- Objectives (building interactions) supply allies and utility.
- The tension escalates through larger/faster/tougher waves.

## 3) MVP Feature Set (must‑have)

- **Playable Hero:** Warrior  Movement, basic attack(s), guard.
- **Enemies:** Reskinned from other color variants of the same unit sets.
- **Map:** Current island map with **castle** landmark; defined spawn regions.
- **Allies via Buildings:**
  - **Houses** → spawn **Ally Warrior** (auto‑engage enemies).
  - **Towers** → spawn **Ally Monk** (follows player, **heals player on damage**).
  - Global building interaction **cooldown: 30s per building**.
- **HUD:** Health bar + Experience bar; level cap **10**.
- **Level‑Up Panel:** Appears each level; shows stat increases; unlocks at Lv3/5/8/10.
- **Waves:** Periodic, escalating enemy groups originating **in front of the castle door**.
- **Meta Progression (lightweight):** Post‑run currency to unlock/upgrade heroes/attributes for future runs (foundational screens only; numbers minimal in MVP).

## 4) Entities & Behaviors

### Player – Warrior (Hero)

- **Role:** Melee frontliner with defensive options.
- **Stats shown:** Health, Damage, Attack Rate, Move Speed, Armor/Reduction (names only; no numbers in spec).
- **Progression:**
  - **Level cap:** 10.
  - **Unlocks:** New abilities granted at **Lv3**, **Lv5**, **Lv8**, **Lv10** (from separate ability asset kit).
  - **On level‑up:** Immediate stat screen → accept to continue.

### Enemies (Waves)

- **Source:** Color‑variant units representing hostile factions.
- **Spawn zone:** **Ground in front of the castle entrance** (use a radius area), never directly on top of the player.
- **Escalation knobs:** Wave size, elite presence, speed, health, damage, and resistances increase over time.
- **Behavior:** Move toward the player (or nearest ally if taunted/blocked) and attack in melee/ranged per unit type.

### Allies (Building‑spawned)

- **Ally Warrior (from Houses):**
  - Auto‑seek nearest enemy; engages in melee; does not stray excessively far from spawn unless enemies pull them.
- **Ally Monk (from Towers):**
  - Trails the player at short distance; prioritizes **healing the player after damage** events; secondary light attack if idle.
- **Spawn rules:**
  - Interaction window appears when near an eligible building; **cooldown 30s per building**.
  - Allies have finite lifetime or count (designer choice) to preserve performance/clarity.

### Buildings

- **Castle:** Landmark and primary enemy **spawn landmark** (doorfront). Non‑interactive in MVP (may host objectives later).
- **Houses:** Interactive (spawn Ally Warrior, 30s cd). Non‑movable world objects with ground‑level collision only.
- **Towers:** Interactive (spawn Ally Monk, 30s cd). Non‑movable; ground‑level collision only.

## 5) Systems

### Combat

- **Contact model:** Player vs enemies (hits), allies vs enemies. Clear on‑hit feedback (flash/small particles/sound).
- **Damage intake:** Player can be healed by Monk or items. Guard reduces damage if available.

### Experience & Leveling

- **XP is automatically gained after killing a enemy**
- **Level cap:** 10.
- **Level‑Up Panel:**
  - Shows **stat increases** (concise list) and communicates **new ability** at Lv3/5/8/10 when reached.
  - Gameplay pauses until the panel is closed.

### Items & Pickups

- **Drops:** Enemies have a chance to drop items  occasionaly .
- **Item types (MVP examples):** Flat stat boosts, regen/on‑hit effects, short duration buffs. Keep pool small and readable.
- **Rarity:** Optional; if used, communicate clearly with color/shape.

### Waves & Pacing

- **Wave cadence:** Regular intervals; brief lulls between waves for pickup/positioning.
- **Difficulty scaling:** Increase enemy count first; then moderate boosts to speed/health; introduce elites after baseline waves.
- **Anti‑frustration:** Avoid off‑screen instant spawns on top of player; telegraph heavy waves.

### Objectives (MVP)

- **Building spawns** are the primary objective loop: return to structures every **30s** to bolster forces.

### Meta Progression (Foundations)

- **Meta currency** awarded on run end (amount weighted by wave reached and enemies defeated).
- **Unlocks:** New characters, traits, or starting bonuses become available globally.
- **Persistence:** Core unlocks carry over between runs; individual run items/levels do not.

## 6) Map & World Rules (MVP)

- **Map:** Current island layout with **player spawn on the green island**.

- **Enemy spawn region:** Defined zone **in front of castle door** with safe margin from the player.

## 7) UI / UX

- **HUD:** Health bar (top‑left), Experience bar (top or bottom), concise counters (coins/items), optional wave timer.
- **Level‑Up Panel:** Center modal with stat change list and ability unlock message; single confirm action.
- **Building Interaction Prompt:** Contextual prompt when in range; shows **30s** cooldown if unavailable.
- **Pause/Menu:** Basic pause; run summary on death (time survived, waves cleared, enemies defeated, currency earned).

## 8) Content Boundaries for MVP

- Single playable hero (**Warrior**).
- Enemy roster can reuse existing color variants.
- Two ally types (Warrior, Monk) from buildings only.
- Level cap **10**, abilities at **3/5/8/10**.
- No boss encounter required in MVP.

## 9) Success Criteria (MVP)

- A full run delivers: clear survivability challenge, perceivable power growth, meaningful level‑up moments, and impactful ally support cadence. Players should intuitively understand: **survive waves, collect, level up, use buildings, repeat**.

