# ✨ Cleric Character Sprite Documentation

## 1. Asset Overview
| Field | Description |
|-------|-------------|
| **Name** | Cleric Character Sprite Set |
| **Category** | Character |
| **Art Style** | Pixel Art – Chibi/Cartoon, Top-down/Isometric 2D |
| **Resolution** | Each frame: 192×192 px (character sprites) / 186×186 px (effects) |
| **Color Palette** | Muted blue robes, beige hair, golden trim, green healing particles. |
| **File Types** | PNG (individual sprite sheets per animation) |
| **Animation Format** | Horizontal sprite sheet, equal-sized frames per row |
| **Use Context** | Support/healer class character using healing and defensive spells. |

---

## 2. Asset Components
| Filename | Description | Dimensions | Frames | Notes |
|-----------|-------------|-------------|---------|--------|
| `Idle.png` | Standing idle pose | 192×768 px | 4 | Subtle breathing motion |
| `Run.png` | Movement animation | 192×1152 px | 6 | Continuous walking/running cycle |
| `Heal.png` | Healing cast animation | 186×2048 px | 11 | Hands raised, magical glow |
| `Heal_Effect.png` | Healing particle effect | 186×2048 px | 11 | Green energy circle + sparkles; matches `Heal.png` timing |

---

## 3. Animation Sequences
| Animation | Frame Order | FPS / Duration | Loop | Notes |
|------------|-------------|----------------|------|-------|
| **Idle** | 1 → 4 | 6 FPS | ✅ | Slight robe movement |
| **Run** | 1 → 6 | 10 FPS | ✅ | Gentle stride motion |
| **Heal** | 1 → 11 | 12 FPS | ❌ | Casting animation (syncs with `Heal_Effect`) |
| **Heal_Effect** | 1 → 11 | 12 FPS | ❌ | Plays alongside Heal; centered on ground |

---

## 4. Collision & Gameplay Data
| Field | Description |
|--------|-------------|
| **Collision Box** | X:32 Y:64 W:128 H:128 |
| **Anchor Point** | Center bottom (X:96, Y:192) |
| **Cast Radius** | 160 px (AOE Heal) |
| **Movement Speed** | 3.5 units/s |
| **Special States** | Cannot move during Heal frames 4–9 |

---

## 5. Layering & Z-Index Rules
```
Ground (z = 0)
Shadow (z = 1)
Cleric (z = 2)
Heal_Effect (z = 3)
UI / Buff Indicators (z = 10)
```

---

## 6. Dependencies & Variants
- `Heal_Effect.png` must be aligned with the Cleric’s center pivot.
- Possible recolor variants for different magic types (blue = mana heal, green = HP heal).
- Optional glowing rune circle layer can be composited beneath effect.

---

## 7. Suggested Implementation Notes
> Implement as a support unit with state machine handling `idle`, `run`, and `heal` states. The Heal animation triggers the `Heal_Effect` concurrently. The effect should appear below the character but above ground tiles. Healing occurs between frames 5–7. Movement resumes when animation completes.

