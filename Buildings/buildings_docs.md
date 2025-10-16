# 🏰 Building Asset Documentation

## 1. Asset Overview
| Field | Description |
|-------|-------------|
| **Name** | Building & Structure Set |
| **Category** | Environment / Structures |
| **Art Style** | Pixel Art – Medieval Fantasy, Isometric 2D |
| **Resolution** | 192×128 px (houses), 256×128–320 px (castle/tower) |
| **Color Palette** | Stone grey, navy-blue roofs, light beige walls with teal shading |
| **File Types** | PNG (individual structure sprites) |
| **Use Context** | Core architectural elements for settlements, fortifications, and map landmarks. |

---

## 2. Asset Components
| Filename | Description | Dimensions | Notes |
|-----------|-------------|-------------|--------|
| `House1.png` | Small cottage (front-facing) | 192×128 px | Wooden frame, stone base, central doorway |
| `House2.png` | Angled cottage (isometric left) | 192×128 px | Provides depth variation for settlements |
| `House3.png` | Rear-facing house | 192×128 px | Rear wall variant with lit window pattern |
| `Tower.png` | Tall defensive tower | 256×128 px | Round base, battlement top; can serve as defense or lookout |
| `Castle.png` | Large fortification structure | 256×320 px | Multi-entry castle wall with stone stairs; suitable as HQ or stronghold |

---

## 3. Visual & Structural Design
### Common Elements
- All buildings share the **same stone texture** for cohesive settlement design.
- Roof tiles are rendered in a **navy-to-slate gradient** with subtle highlights.
- Wooden beams frame windows and edges for visual consistency.

### Architectural Hierarchy
| Type | Relative Scale | Function |
|------|----------------|-----------|
| **House** | Small | Civilian dwellings, background filler |
| **Tower** | Medium | Defensive structure, line-of-sight marker |
| **Castle** | Large | Command building or end-level objective |

---

## 4. Placement & Collision Data
| Structure | Ground Footprint | Anchor Point | Height Layer (Z) |
|------------|------------------|---------------|------------------|
| **House1 / House2 / House3** | 3×2 tiles (192×128 px) | Bottom center | z = 2 |
| **Tower** | 2×2 tiles (256×128 px) | Bottom center | z = 3 |
| **Castle** | 5×3 tiles (256×320 px) | Bottom center | z = 4 |

All buildings should be aligned to the tile grid (64×64 px base units) to ensure clean integration with terrain.

---

## 5. Layering & Z-Index Rules
```
Ground / Terrain (z = 0)
Building Shadow (z = 1)
Structure Base (z = 2–4)
Roof Overhangs / Details (z = 5)
UI / Markers (z = 10)
```

---

## 6. Variants & Customization
- All assets can be recolored for faction or biome variety:
  - Blue Roof → Red/Green Roof (regional themes)
  - Stone Walls → Sandstone (desert) or Dark Basalt (mountain)
- Tower and Castle share modular stone pattern → usable for **wall extensions**.
- Can be combined with **terrain cliff tiles** for elevated placements.

---

## 7. Suggested Implementation Notes
> Treat all buildings as static objects with collision boxes scaled to their visible base. The castle and tower can be multi-layered with separate collision for ramparts. For night/day cycles, add emissive light overlays to window pixels (House3). These structures can also serve as spawn points or upgrade nodes in tower defense gameplay.

