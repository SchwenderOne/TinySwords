# ⚔️ Lancer Character Sprite Documentation (Updated)

## 1. Asset Overview
| Field | Description |
|-------|-------------|
| **Name** | Lancer Character Sprite Set |
| **Category** | Character |
| **Art Style** | Pixel Art – Chibi/Cartoon, Top-down/Isometric 2D |
| **Resolution** | Each frame: 320×320 px |
| **Color Palette** | Steel armor, navy-blue tunic, silver spearhead, muted gold highlights. |
| **File Types** | PNG (individual sprite sheets per animation direction) |
| **Animation Format** | Horizontal sprite sheets with equal-sized frames per row |
| **Use Context** | Melee unit with long reach; performs spear thrusts and maintains directional defenses. |

---

## 2. Asset Components
| Filename | Description | Dimensions | Frames | Notes |
|-----------|-------------|-------------|---------|--------|
| `Lancer_Idle.png` | Neutral standing stance | 320×1920 px | 6 | Slight idle movement with steady spear |
| `Lancer_Run.png` | Forward running animation | 320×1920 px | 6 | Smooth directional run cycle |
| `Lancer_Right_Attack.png` | Forward spear thrust (right-facing) | 320×960 px | 3 | Basic attack pattern; short reach burst |
| `Lancer_DownRight_Attack.png` | Diagonal spear thrust (down-right) | 320×960 px | 3 | Used for oblique attack directions |
| `Lancer_Up_Attack.png` | Upward spear thrust | 320×960 px | 3 | Anti-air or high attack variant |
| `Lancer_UpRight_Attack.png` | Diagonal upward spear thrust | 320×960 px | 3 | Completes diagonal attack directions |
| `Lancer_Down_Attack.png` | Downward spear thrust | 320×960 px | 3 | Ground-level spear attack for close combat |
| `Lancer_Right_Defence.png` | Defensive block (right-facing) | 320×1920 px | 6 | Defensive stance with forward spear |
| `Lancer_Up_Defence.png` | Upward guard animation | 320×1920 px | 6 | Shielding motion above head |
| `Lancer_Down_Defence.png` | Downward guard animation | 320×960 px | 3 | Guarding motion against low attacks |
| `Lancer_UpRight_Defence.png` | Diagonal-up defensive position | 320×1920 px | 6 | Transition stance; used for dynamic defense |
| `Lancer_DownRight_Defence.png` | Diagonal-down defensive position | 320×960 px | 3 | Used when crouching or lowering spear for block |

---

## 3. Animation Sequences
| Animation | Frame Order | FPS / Duration | Loop | Notes |
|------------|-------------|----------------|------|-------|
| **Idle** | 1 → 6 | 6 FPS | ✅ | Minimal breathing motion |
| **Run** | 1 → 6 | 10 FPS | ✅ | Balanced stride motion |
| **Right_Attack** | 1 → 3 | 12 FPS | ❌ | Spear thrust; frame 2 triggers hit detection |
| **DownRight_Attack** | 1 → 3 | 12 FPS | ❌ | Lower diagonal spear strike |
| **UpRight_Attack** | 1 → 3 | 12 FPS | ❌ | Diagonal upward spear strike |
| **Down_Attack** | 1 → 3 | 12 FPS | ❌ | Close-range downward stab |
| **Up_Attack** | 1 → 3 | 10 FPS | ❌ | High thrust motion |
| **Right_Defence** | 1 → 6 | 8 FPS | ✅ | Looping guard animation |
| **Up_Defence** | 1 → 6 | 8 FPS | ✅ | Maintains raised spear guard |
| **Down_Defence** | 1 → 3 | 6 FPS | ✅ | Stationary low guard |
| **UpRight_Defence** | 1 → 6 | 8 FPS | ✅ | Partial rotation guard; intermediate stance |
| **DownRight_Defence** | 1 → 3 | 6 FPS | ✅ | Used for crouched defence |

---

## 4. Collision & Gameplay Data
| Field | Description |
|--------|-------------|
| **Collision Box** | X:48 Y:96 W:192 H:192 |
| **Anchor Point** | Center bottom (X:160, Y:320) |
| **Attack Range** | 160 px spear reach from center pivot |
| **Hitbox Frame** | Frame 2 (attack animations) |
| **Movement Speed** | 3.8 units/s |
| **Defense Multiplier** | 0.5 damage reduction during guard frames |
| **Special States** | Cannot attack while defending; defense can be maintained indefinitely |

---

## 5. Layering & Z-Index Rules
```
Ground (z = 0)
Shadow (z = 1)
Lancer (z = 2)
Spear Tip Highlights (z = 3)
UI / HP Bar (z = 10)
```

---

## 6. Dependencies & Variants
- Includes full 8-directional attack/defence coverage.
- Optional spark or flash effects on hit contact.
- Possible variants: enemy lancer (red armor), elite lancer (silver trim). 

---

## 7. Suggested Implementation Notes
> The Lancer uses a comprehensive direction-based system managing eight attack and defence states (`attack_up`, `attack_down`, `defend_upright`, etc.). Hit detection occurs during frame 2 for all attacks. The animation set enables full directional combat coverage suitable for isometric or top-down games.

