# 🗺️ Development Roadmap - Survivors-Like Pivot

**Timeline:** 10-12 weeks part-time (~10 hrs/week)  
**Current Status:** ✅ Phase 1 Complete → Starting Phase 2

---

## ✅ Phase 1: Foundation (Weeks 1-2) - COMPLETE

### Goals
- Eliminate code duplication
- Centralize configuration
- Simplify to single hero
- Centralize enemy spawns

### Completed Work
- [x] Created `BaseCharacter.js` - shared logic (280 lines)
- [x] Created `GameBalance.js` - centralized config (130 lines)
- [x] Refactored `Player.js` to extend BaseCharacter
- [x] Refactored `Monk.js` to extend BaseCharacter (ready for AI)
- [x] Removed character switching system
- [x] Centralized spawns at castle gate
- [x] Fixed critical bugs (game over, XP gain)

### Deliverables
✅ Clean architecture with 0% duplication  
✅ Single hero gameplay (Warrior)  
✅ Enemy spawns from castle gate  
✅ All tests passing, 0 linter errors

**Git Commits:**
- `14cbcfe` - Phase 1: Foundation refactor complete
- `900ffe7` - Fix critical bugs from Phase 1 refactor

---

## 🏗️ Phase 2: Ally System (Weeks 3-4) - NEXT

### Goals
- Create AI-controlled allies
- Implement follow/engage behaviors
- Test allies in combat

### Tasks

#### 2.1: AllyCharacter Base Class
- [ ] Create `src/entities/AllyCharacter.js` extending BaseCharacter
- [ ] Implement AI state machine (follow, engage)
- [ ] Add leader reference (follows player)
- [ ] Implement `updateAI()` core loop

#### 2.2: Ally Behaviors
- [ ] `followLeader()` - Trail player at distance
- [ ] `checkForEnemies()` - Detect enemies in assist radius
- [ ] `engageTarget()` - Move to and attack enemy
- [ ] Handle target death/escape (return to follow)

#### 2.3: Ally Variants
- [ ] Create `src/entities/AllyWarrior.js`
  - Melee combat (80 HP, 12 damage)
  - Auto-engage nearest enemy
- [ ] Create `src/entities/AllyMonk.js`
  - Follow player closely (60 HP)
  - Heal player when damaged (20 HP heal)

#### 2.4: Integration
- [ ] Add allies group to `GameScene`
- [ ] Setup collisions (allies ↔ enemies, environment)
- [ ] Manual spawn for testing (press key)
- [ ] Test with 2-3 allies + enemies

### Success Criteria
- Allies follow player smoothly
- Allies engage enemies within range
- AI feels responsive, not janky
- Performance stable (60 FPS)

### Estimated Time
8-10 hours over 2 weeks

---

## 🏠 Phase 3: Building Interactions (Weeks 5-6)

### Goals
- Make buildings interactive
- Implement cooldown system
- Connect buildings to ally spawning

### Tasks

#### 3.1: InteractiveBuilding Class
- [ ] Create `src/entities/InteractiveBuilding.js`
- [ ] Proximity detection (100px radius)
- [ ] Cooldown timer (30,000ms)
- [ ] Visual feedback (prompt, cooldown bar)

#### 3.2: UI Elements
- [ ] "Press E" prompt when in range
- [ ] Cooldown bar above building
- [ ] Particle effect on spawn
- [ ] Change prompt color based on cooldown

#### 3.3: Integration
- [ ] Add E key handler to GameScene
- [ ] Replace static buildings with InteractiveBuildings
- [ ] Connect Houses → spawn AllyWarrior
- [ ] Connect Towers → spawn AllyMonk

#### 3.4: Balancing
- [ ] Test ally count limits (max 4-6)
- [ ] Tune cooldown duration
- [ ] Adjust ally stats if too strong/weak

### Success Criteria
- Buildings clearly indicate interactivity
- Cooldown system feels fair
- Strategic decision: when to spawn allies
- Allies spawn with visual feedback

### Estimated Time
8-10 hours over 2 weeks

---

## ⚡ Phase 4: Ability System (Weeks 7-8)

### Goals
- Unlock abilities at levels 3/5/8/10
- Bind to number keys
- Visual impact on combat

### Tasks

#### 4.1: Asset Loading
- [ ] Load 10 slash effects from asset pack
- [ ] Create animations in BootScene
- [ ] Test slash effect rendering

#### 4.2: AbilitySystem Class
- [ ] Create `src/systems/AbilitySystem.js`
- [ ] Define ability pool (4 abilities)
- [ ] Cooldown management
- [ ] `useAbility(id)` execution

#### 4.3: Ability Definitions
- [ ] Lv3: Power Slash (35 damage, 2s CD)
- [ ] Lv5: Whirlwind (25 AOE, 4s CD)
- [ ] Lv8: Battle Charge (dash + damage, 6s CD)
- [ ] Lv10: Titan Strike (100 damage, 20s CD)

#### 4.4: Unlock System
- [ ] Hook into `Player.levelUp()`
- [ ] Pause game on unlock
- [ ] Show modal with ability preview
- [ ] Bind to number keys (1-4)

#### 4.5: UI
- [ ] Cooldown indicators
- [ ] Key hints (1, 2, 3, 4)
- [ ] Visual feedback on use

### Success Criteria
- Abilities feel impactful
- Level 3/5/8/10 moments are exciting
- UI communicates cooldowns clearly
- Animations look good

### Estimated Time
10-12 hours over 2 weeks

---

## 🎯 Phase 5: Enemy Spawn Tuning (Week 9)

### Goals
- Adjust for ally assistance
- Balance difficulty curve

### Tasks

#### 5.1: Difficulty Adjustment
- [ ] Test with full ally support
- [ ] Increase enemy counts if too easy
- [ ] Adjust enemy stats (HP, damage)
- [ ] Test wave 1-5 progression

#### 5.2: Wave Variety
- [ ] Consider elite enemies (Phase 5+)
- [ ] Vary spawn patterns
- [ ] Test different compositions

### Success Criteria
- Challenging but fair
- Each wave noticeably harder
- Victory feels earned

### Estimated Time
4-6 hours over 1 week

---

## 💰 Phase 6: Meta Progression (Weeks 10-11)

### Goals
- Persistent upgrades across runs
- Post-run flow

### Tasks

#### 6.1: MetaProgressionSystem
- [ ] Create `src/systems/MetaProgressionSystem.js`
- [ ] localStorage save/load
- [ ] Currency calculation
- [ ] Upgrade definitions

#### 6.2: Post-Run Screen
- [ ] Summary: waves, kills, time, currency
- [ ] Animate currency gain
- [ ] [R] Restart | [M] Meta Menu options

#### 6.3: Meta Menu Scene
- [ ] Create `src/scenes/MetaMenuScene.js`
- [ ] List available upgrades
- [ ] Purchase with currency
- [ ] Return to game

#### 6.4: Upgrades
- [ ] +10 Max HP
- [ ] +2 Attack Damage
- [ ] Faster Ability Cooldowns
- [ ] Start with bonus XP

### Success Criteria
- Currency feels rewarding
- Upgrades provide advantage
- UI is clean and intuitive
- Data persists correctly

### Estimated Time
12-15 hours over 2 weeks

---

## 🎨 Phase 7: Polish (Week 12)

### Goals
- Fix all bugs
- Improve feel
- Documentation

### Tasks
- [ ] Bug fixing pass
- [ ] Performance optimization
- [ ] Add tutorial hints
- [ ] Update all documentation
- [ ] Create gameplay GIF/video
- [ ] Final playtesting

### Estimated Time
6-8 hours over 1 week

---

## 📊 Progress Tracking

| Phase | Status | Time Spent | Git Commits |
|-------|--------|------------|-------------|
| Phase 1: Foundation | ✅ Complete | ~3 hours | 2 commits |
| Phase 2: Ally System | 🔜 Next | - | - |
| Phase 3: Buildings | ⏳ Pending | - | - |
| Phase 4: Abilities | ⏳ Pending | - | - |
| Phase 5: Tuning | ⏳ Pending | - | - |
| Phase 6: Meta | ⏳ Pending | - | - |
| Phase 7: Polish | ⏳ Pending | - | - |

---

## 🎯 Milestones

### Milestone 1: MVP Playable (End of Phase 3)
- Warrior + AI allies + building spawning
- Basic survivors-like loop functional

### Milestone 2: MVP Feature-Complete (End of Phase 4)
- All abilities unlocking
- Full progression curve

### Milestone 3: MVP Shippable (End of Phase 7)
- Meta progression
- Polished and tested
- Documented

---

## 🚦 Risk Management

### Potential Blockers

**1. Ally AI Complexity** 🟡
- **Risk:** Allies behave erratically or get stuck
- **Mitigation:** Start simple, test frequently, limit ally count
- **Fallback:** Simpler AI (just follow + basic attack)

**2. Performance Issues** 🟡
- **Risk:** FPS drops with many entities
- **Mitigation:** Profile early, optimize collision
- **Fallback:** Cap ally count at 4

**3. Scope Creep** 🟡
- **Risk:** Adding features beyond MVP
- **Mitigation:** Stick to TARGET_SPEC, defer nice-to-haves
- **Fallback:** Cut abilities to 2 instead of 4

---

## 📝 Development Workflow

### Starting Each Session
1. Read `CURRENT_STATE.md` to understand what's done
2. Check `ROADMAP.md` for current phase tasks
3. Run `git log` to see recent changes
4. Start dev server: `cd game && npm run dev`

### Ending Each Session
1. Commit work with descriptive message
2. Update `CURRENT_STATE.md` if phase complete
3. Update `ROADMAP.md` progress tracker
4. Note any blockers or decisions needed

---

**Next Action:** Begin Phase 2 - Create AllyCharacter.js

See `CURRENT_STATE.md` for exact codebase state.  
See `TARGET_SPEC.md` for end goals.

