# 🏹 Archer Character Sprite Documentation

## 1. Asset Overview
| Field | Description |
|-------|-------------|
| **Name** | Archer Character Sprite Set |
| **Category** | Character |
| **Art Style** | Pixel Art – Chibi/Cartoon, Top-down/Isometric 2D |
| **Resolution** | Each frame: 192×192 px (character), 64×64 px (arrow projectile) |
| **Color Palette** | Dark steel armor, navy blue clothing, gold trim, light brown bow and arrow shaft. |
| **File Types** | PNG (individual sprite sheets per animation) |
| **Animation Format** | Horizontal sprite sheet, equal-sized frames per row |
| **Use Context** | Ranged unit character; fires arrows at enemies from a distance. |

---

## 2. Asset Components
| Filename | Description | Dimensions | Frames | Notes |
|-----------|-------------|-------------|---------|--------|
| `Archer_Idle.png` | Standing ready pose | 192×1152 px | 6 | Subtle breathing with slight bow movement |
| `Archer_Run.png` | Running animation | 192×1152 px | 6 | Light-footed stride for ranged unit movement |
| `Archer_Shoot.png` | Bow draw and release | 192×1536 px | 8 | Draws bowstring and fires projectile |
| `Arrow.png` | Projectile sprite | 64×64 px | 1 | Single-frame arrow with wooden shaft and steel tip |

---

## 3. Animation Sequences
| Animation | Frame Order | FPS / Duration | Loop | Notes |
|------------|-------------|----------------|------|-------|
| **Idle** | 1 → 6 | 6 FPS | ✅ | Default breathing loop |
| **Run** | 1 → 6 | 10 FPS | ✅ | Continuous stride motion |
| **Shoot** | 1 → 8 | 12 FPS | ❌ | Frame 6 triggers projectile spawn |

---

## 4. Collision & Gameplay Data
| Field | Description |
|--------|-------------|
| **Collision Box** | X:32 Y:64 W:128 H:128 |
| **Anchor Point** | Center bottom (X:96, Y:192) |
| **Projectile Origin** | Offset +40px forward from bow hand (frame 6) |
| **Movement Speed** | 4.5 units/s |
| **Attack Range** | 480 px |
| **Projectile Speed** | 12 units/s |
| **Special States** | Cannot move during frame 5–7 of shoot animation |

---

## 5. Layering & Z-Index Rules
```
Ground (z = 0)
Shadow (z = 1)
Archer (z = 2)
Arrow (z = 3)
UI / Indicators (z = 10)
```

---

## 6. Dependencies & Variants
- `Arrow.png` projectile must be rotated to face its travel direction.
- Optionally, attach a faint motion trail or glow for hit feedback.
- Recolor variants: red archer (enemy), blue archer (ally).

---

## 7. Suggested Implementation Notes
> The Archer uses three states: `idle`, `run`, and `shoot`. The `shoot` state should trigger a projectile instantiation based on frame timing. Ensure projectile travel direction matches Archer’s facing direction. The unit can move freely except while shooting (frames 5–7).

