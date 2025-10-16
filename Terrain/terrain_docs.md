# 🌿 Terrain & Environment Tile Documentation

## 1. Asset Overview
| Field | Description |
|-------|-------------|
| **Name** | Terrain & Environmental Tile Set |
| **Category** | Environment / Tilemap |
| **Art Style** | Pixel Art – Soft-Outlined Cartoon, Top-down Perspective |
| **Resolution** | Tiles: 64×64 px (standard), 192×192 px (shadow) |
| **Color Palette** | Lush greens, teal water tones, grey-blue rock foundations. |
| **File Types** | PNG (individual tile and animation sheets) |
| **Animation Format** | Horizontal frame strips for animated tiles (e.g. water foam) |
| **Use Context** | Modular overworld terrain system — used for building natural landscapes including grass platforms, cliffs, and water zones. |

---

## 2. Asset Components
| Filename | Description | Dimensions | Frames | Notes |
|-----------|-------------|-------------|---------|--------|
| `Shadow.png` | Character/object shadow | 192×192 px | 1 | Semi-transparent dark blue oval, used under units |
| `Water Background color.png` | Base water fill tile | 64×64 px | 1 | Solid teal fill used below animated water layer |
| `Water Foam.png` | Water surface animation | 128×2048 px | 16 | Looping animation showing surface motion |
| `Tilemap_color1.png` | Terrain tileset variant 1 (bright green grass) | 384×576 px | — | Contains grass-top, edges, and cliff tiles |
| `Tilemap_color2.png` | Terrain tileset variant 2 (neutral green tone) | 384×576 px | — | Used for slightly different biomes or blending |
| `Tilemap_color3.png` | Terrain tileset variant 3 (vivid, saturated grass) | 384×576 px | — | Brighter palette for high-energy maps |
| `Tilemap_color4.png` | Terrain tileset variant 4 (cool blue-green hue) | 384×576 px | — | Used in shaded or wet environments |
| `Tilemap_color5.png` | Terrain tileset variant 5 (dry/yellowed grass) | 384×576 px | — | Suitable for arid or autumn maps |

---

## 3. Tile Composition & Layout
Each `Tilemap_colorX.png` contains modular tile groups:
- **Top Tiles** – Grass-covered, rounded corners for soft natural edges.
- **Side Tiles** – Vertical cliff faces with stone texture.
- **Corner/Edge Tiles** – Smooth transitions between elevations.
- **Inner Fills** – Flat ground tiles for larger areas.
- **Diagonal Connectors** – Used to blend terrain heights seamlessly.

Tiles are grid-aligned (64×64 px) and can be combined freely across color variants to create smooth biome transitions.

---

## 4. Animation Sequences
| Animation | Source | Frame Order | FPS / Duration | Loop | Notes |
|------------|---------|-------------|----------------|------|-------|
| **Water Foam** | `Water Foam.png` | 1 → 16 | 8 FPS | ✅ | Continuous looping wave motion |

---

## 5. Layering & Z-Index Rules
```
Base Water (z = 0)
Water Foam Animation (z = 1)
Terrain Cliff (z = 2)
Grass Surface (z = 3)
Objects & Units (z = 4)
Shadows (z = 5)
UI / Overlays (z = 10)
```

---

## 6. Variants & Environmental Usage
- Each tilemap variant supports thematic environments:
  - **Color 1–3:** Standard grasslands / forest biomes.
  - **Color 4:** Swamp or mountain lakes.
  - **Color 5:** Desert plains or late-summer settings.
- Variants can be blended horizontally to represent **biome transitions** (e.g. color2 → color5).
- Water foam can overlay any `Water Background` tile for animated river/lake effects.

---

## 7. Suggested Implementation Notes
> Combine `Water Background` as the base tile with looping `Water Foam` on top for animation. Terrain tiles can be used as modular autotiles in Godot, Unity Tilemap, or Tiled editor. Ensure all variants follow the same grid alignment (64×64). Use `Shadow.png` under moving units for visual depth.

