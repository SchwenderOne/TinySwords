# 🛡️ Warrior Character Sprite Documentation

## 1. Asset Overview
| Field | Description |
|-------|-------------|
| **Name** | Warrior Character Sprite Set |
| **Category** | Character |
| **Art Style** | Pixel Art – Chibi/Cartoon, Top-down/Isometric 2D |
| **Resolution** | Each frame: 192×192 px. Sprite sheets vary in width depending on frame count. |
| **Color Palette** | Desaturated medieval palette – steel grey armor, beige tunic, gold accents, dark blue tones. |
| **File Types** | PNG (individual sprite sheets per animation) |
| **Animation Format** | Horizontal sprite sheet, equal-sized frames per row |
| **Use Context** | Player or NPC warrior character with sword and shield; suitable for action or tower defense gameplay. |

---

## 2. Asset Components
| Filename | Description | Dimensions | Frames | Notes |
|-----------|-------------|-------------|---------|--------|
| `Warrior_Idle.png` | Idle stance (breathing/ready) | 192×1536 px | 8 | Base state animation |
| `Warrior_Run.png` | Running animation | 192×1152 px | 6 | Smooth running cycle |
| `Warrior_Guard.png` | Guard / Blocking stance | 192×1152 px | 6 | Shield raised; defensive pose |
| `Warrior_Attack1.png` | Attack animation (slash 1) | 192×768 px | 4 | Fast horizontal sword slash |
| `Warrior_Attack2.png` | Attack animation (slash 2) | 192×768 px | 4 | Heavier diagonal sword slash |

---

## 3. Animation Sequences
| Animation | Frame Order | FPS / Duration | Loop | Notes |
|------------|-------------|----------------|------|-------|
| **Idle** | 1 → 8 | 6 FPS | ✅ | Subtle breathing motion |
| **Run** | 1 → 6 | 10 FPS | ✅ | Continuous movement cycle |
| **Guard** | 1 → 6 | 6 FPS | ✅ | Can loop while defending |
| **Attack1** | 1 → 4 | 12 FPS | ❌ | Quick sword slash; short cooldown |
| **Attack2** | 1 → 4 | 10 FPS | ❌ | Stronger slash with more motion blur |

---

## 4. Collision & Gameplay Data
| Field | Description |
|--------|-------------|
| **Collision Box** | X:32 Y:64 W:128 H:128 |
| **Anchor Point** | Center bottom (X:96, Y:192) |
| **Hitbox (Sword)** | Extends ~40px in attack direction on Attack frames 2–3 |
| **Movement Speed** | 4.0 units/s |
| **Special States** | Invulnerable while Guarding (frames 2–5) |

---

## 5. Layering & Z-Index Rules
```
Ground (z = 0)
Shadow (z = 1)
Warrior (z = 2)
Weapon Effects (z = 3)
UI / HP Bar (z = 10)
```

---

## 6. Dependencies & Variants
- Optional **shadow sprite** (black ellipse 64×32 px)
- Possible color variants: red/blue armor for team identification
- Can be paired with sword-slash effect sprites or particle bursts

---

## 7. Suggested Implementation Notes
> Implement a finite-state machine controlling the warrior’s animation states: `idle`, `run`, `guard`, `attack1`, `attack2`. Transition between attack states when combo chaining is detected. Guard can interrupt attacks. Ensure frame timing syncs with hit detection.

---

## 8. Example Code Integration (Godot GDScript)
```gdscript
# Warrior.gd
extends CharacterBody2D

@onready var sprite = $AnimatedSprite2D

func _ready():
    sprite.frames = load("res://assets/characters/warrior/warrior_sprites.tres")
    sprite.play("idle")

func _process(delta):
    if Input.is_action_pressed("move_right"):
        velocity.x = 200
        sprite.play("run")
    elif Input.is_action_pressed("guard"):
        sprite.play("guard")
    elif Input.is_action_just_pressed("attack"):
        sprite.play("attack1")
    else:
        velocity = Vector2.ZERO
        sprite.play("idle")

    move_and_slide()
```

---

## 9. Summary
This warrior sprite pack includes **five animations** suitable for a complete player character: idle, run, guard, and two attacks. Each animation is provided as a horizontal strip of uniformly sized frames. These assets can be directly imported into engines like **Godot**, **Unity**, or **Construct** with minimal setup, using the provided documentation for automatic frame slicing and animation timing.

