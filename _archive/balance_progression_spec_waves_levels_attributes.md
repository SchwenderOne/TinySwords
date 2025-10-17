# ⚖️ Balance & Progression Spec — 20 Waves • 20 Levels • Attributes

> Scope: Survivors‑like MVP extended to 20 levels and 20 waves. Uses existing hero/ally art (Warrior, Archer, Lancer, Monk/Cleric). Enemy roster = 12 archetypes (color variants + roles). No engine/tech details — design only.

---

## 1) Attribute Model (shared vocabulary)

**Core (all units):** Health (HP), Damage (DMG), Attack Rate (AR, attacks/sec), Move Speed (MS), Range, Armor (flat reduction), Resistance (percent vs effects), Crit Chance (CR), Knockback (KB) susceptibility.

**Player-only extras:** Pickup Range, Dash Charges, Ability Slots (milestone unlocks), Luck (drop odds).\
**Enemy-only extras:** Spawn Weight (per-wave quota share), Elite Flag (bigger HP/DMG, on‑death reward), Special (e.g., explode, heal, summon).\
**Allies:** Follow Logic (idle/follow/engage), Leash Range, Priority (heal > protect > attack) for support units.

---

## 2) Player Levels (1–20)

- **XP cadence target:** early levels quick, mid steady, late slower.
- **Level awards:** every level grants *core stat growth* plus milestones at 3/5/8/10 (ability unlocks) and soft boosts at 13/16/20 (small global perks).

### 2.1 Per‑Level Growth (additive & multiplicative mix)

- **HP:** +6%/level (multiplicative).
- **DMG:** +4%/level.
- **AR:** +2%/level.
- **MS:** +1%/level (cap +15% total).
- **Pickup Range:** +3 px/level (capped).
- **Armor:** +1 flat at L5/L10/L15/L20 (total +4).
- **Luck:** +2% at L7 and L14.

### 2.2 Milestones

- **L3 / L5 / L8 / L10:** Unlock a new ability from the ability kit (exact content defined in that kit).
- **L13:** +5% global damage vs elites.
- **L16:** +1 dash/evade charge.
- **L20:** Final spike: +10% HP & +10% DMG on top of the regular level gains.

> Note: The earlier MVP cap at 10 is a strict subset of this plan.

---

## 3) Allies — 4 Unit Types (scale with player)

**A1 Ally Warrior (house):** Melee bruiser; engages nearest enemy.\
**A2 Ally Monk (tower):** Healer that follows the player; heals after the player takes damage; light poke when idle.\
**A3 Ally Archer:** Ranged support with line‑of‑sight preference.\
**A4 Ally Lancer:** Reach melee; intercepts fast runners.

**Ally scaling rule:**

- **Base stats** defined per ally (see table below).
- **Inheritance:** Each ally also gains **60% of the player’s current HP and 40% of the player’s current DMG**, updated on player level‑ups.
- **Milestones:** At player **L10/L15/L20**, allies gain +5% DMG and +5% AR (stacking).

| Ally    | Role      | Base HP | Base DMG | AR  | MS  | Notes                                       |
| ------- | --------- | ------- | -------- | --- | --- | ------------------------------------------- |
| Warrior | Frontline | 220     | 14       | 1.0 | 100 | Short cleave, modest armor                  |
| Monk    | Healer    | 160     | 6        | 0.8 | 105 | Heal pulses on player‑hit; won’t overextend |
| Archer  | Ranged    | 140     | 10       | 1.1 | 100 | Prioritizes closest low‑HP target           |
| Lancer  | Reach     | 180     | 12       | 0.9 | 102 | Long thrust; minor knockback                |

*(Speeds are relative; tune visually to match existing run cycles.)*

---

## 4) Enemy Roster — 12 Archetypes

E1 **Grunt** (melee baseline)\
E2 **Spearman** (reach melee)\
E3 **Archer** (ranged)\
E4 **Rogue** (fast melee, low HP)\
E5 **Shieldbearer** (front armor, slow)\
E6 **Heavy Knight** (tank, very slow)\
E7 **Bomber** (suicide burst, telegraphed)\
E8 **Mage** (ranged AoE projectile)\
E9 **Healer** (heals nearby enemies; low DMG)\
E10 **Summoner** (spawns E1 adds on a cooldown)\
E11 **Captain (Elite)** (buffs nearby; higher HP/DMG)\
E12 **Colossus (Mini‑Boss)** (very high HP; slow wide swings)

**Relative stat weights (vs Grunt = 1.0):**

- **HP:** Grunt 1.0, Spearman 1.1, Archer 0.8, Rogue 0.6, Shield 1.6, Heavy 2.2, Bomber 0.9, Mage 0.9, Healer 0.9, Summoner 1.4, Captain 2.0, Colossus 8.0.
- **DMG:** Grunt 1.0, Spearman 1.1, Archer 0.9, Rogue 1.1, Shield 0.8, Heavy 1.6, Bomber 2.5 (self‑sacrifice), Mage 1.2 (splash), Healer 0.4, Summoner 0.7, Captain 1.6, Colossus 3.0.
- **MS:** Grunt 1.0, Spearman 0.95, Archer 0.95, Rogue 1.2, Shield 0.75, Heavy 0.6, Bomber 1.1, Mage 0.9, Healer 0.9, Summoner 0.85, Captain 0.95, Colossus 0.55.

**Base numbers (wave‑1 tuning anchor):** Grunt = **HP 100, DMG 8, AR 1.0, MS 100**. Other enemies derive from the multipliers above.

---

## 5) Progression Curves (20 waves)

**Enemy scaling per wave:**

- **HP:** ×1.12 each wave (mild exponential).
- **DMG:** +0.6 flat each wave (linear).
- **MS:** +1% at waves **6, 11, 16** (step increases).
- **Elites:** From wave 5 onward, some spawns become **Elites** (×1.6 HP & ×1.25 DMG; bonus XP/loot).
- **Summoner output:** adds 1 E1 add every 6s; add HP follows current wave scaling.

**Player survivability target:**

- TTK (time‑to‑kill) on equal‑wave Grunt ≈ **1.5–2.5s** at midgame with no items.
- Two Rogues hitting simultaneously should be threatening but survivable with healer support.

### 5.1 Waves 1–20 (composition & pacing)

> Spawn quotas are totals over the wave. Split across 2–4 sub‑pulses to avoid all‑at‑once blobs. Boss/mini‑boss appears at the end of its wave.

| Wave | Enemies (quota)                                           | Notes               |
| ---- | --------------------------------------------------------- | ------------------- |
| 1    | E1 Grunt ×10                                              | Tutorial pressure   |
| 2    | E1 ×12, E3 Archer ×4                                      | Introduce ranged    |
| 3    | E1 ×18, E3 ×4                                             | Density up          |
| 4    | E1 ×20, E3 ×6, E4 Rogue ×2                                | First speed threat  |
| 5    | **Mini‑boss:** E11 Captain ×1 + E1 ×18, E3 ×6             | First elite moment  |
| 6    | E2 Spearman ×14, E3 ×8, E4 ×4                             | Reach melee joins   |
| 7    | E1 ×16, E2 ×8, E4 ×6, E5 Shield ×2                        | Mixed frontlines    |
| 8    | E2 ×12, E3 ×8, E8 Mage ×4, E5 ×4                          | AoE pressure        |
| 9    | E4 ×14, E5 ×6, E8 ×6, E9 Healer ×2                        | Focus fire test     |
| 10   | **Mini‑boss:** E12 Colossus ×1 + E7 Bomber ×8 + mixed ×20 | Dodge & burst check |
| 11   | E1 ×18, E7 ×8, E3 ×6, E5 ×4                               | Bomb spacing test   |
| 12   | E2 ×14, E8 ×6, E9 ×6, E5 ×4                               | Sustain check       |
| 13   | E4 ×20, E3 ×8, **E11** ×2                                 | Mobility check      |
| 14   | E7 ×12, E2 ×12, E5 ×8, E8 ×4                              | Crowd control test  |
| 15   | **Mini‑boss duo:** **E11** ×2 + mixed ×24                 | Spike               |
| 16   | **E10 Summoner ×6** + E1 ×24 (adds over time)             | Add control         |
| 17   | E9 ×12, E8 ×12, E5 ×12, E4 ×12                            | Full kit challenge  |
| 18   | E7 ×12, E2 ×12, E3 ×12, E1 ×12, **E11** ×4                | Chaos mix           |
| 19   | E10 ×4, E4 ×16, E5 ×16, E8 ×8, E7 ×8                      | Pre‑final gauntlet  |
| 20   | **Final:** **E12 Colossus ×2** + mixed ×30                | Endurance & burst   |

---

## 6) XP & Level Pace (to 20)

- **XP per wave goal:** Levels \~1–6 by wave 6, \~10–12 by wave 12, \~16–18 by wave 18, **20 by wave 20** with average performance.
- **Drop rules:** Each enemy drops XP orbs tuned by type weight (e.g., Grunt 1×, Archer 1.1×, Shield 1.2×, Heavy 1.6×, Colossus 8×).
- **Catch‑up:** Small global pickup magnet after level‑ups for 2s.

---

## 7) Itemization Hooks (balance levers)

- **Anti‑ranged:** shields/deflects mitigate E3/E8 pressure.
- **Anti‑armor:** penetration counters E5/E6.
- **Anti‑healer:** grievous effect halves healing (vs E9).
- **Anti‑summon:** bonus damage vs summoned adds.

---

## 8) Readability & Fairness Rules

- Telegraph dangerous actions (Bomber fuse, Colossus slam).
- Avoid instant off‑screen spawns on the player.
- Respect separation of concerns: healers don’t heal bombers post‑ignite; summoners have visible cooldowns.

---

## 9) Tuning Notes & Safe Ranges

- If early waves feel too easy, raise **DMG per wave** from +0.6 → **+0.8**.
- If allies overshadow the player, reduce ally inheritance to **50% HP / 30% DMG**.
- If ranged feels oppressive, lower **Archer/Mage** AR by 10% or spawn weight −20% in waves 8–14.

---

### Hand‑off Summary

- 20‑level player growth with milestone unlocks.
- Allies scale with the player via inheritance + milestones.
- 12‑archetype enemy roster with a clear 20‑wave composition plan.
- Mixed linear/exponential scaling for a firm but fair curve across a short run.

