# 📚 Documentation Guide

**TinySwords** - Lean Documentation Structure for Seamless Development

---

## 🗂️ Documentation Files

### 📖 For Everyone

**README.md** - Start Here!
- What the game is
- How to install and run
- Current features and controls
- Quick start guide

### 👨‍💻 For Developers

**CURRENT_STATE.md** - ⭐ **Read First Every Session**
- Exact current implementation (post-Phase 1)
- What's working right now
- Code structure and architecture
- Known issues and fixes
- Quick reference for common tasks

**TARGET_SPEC.md** - Where We're Going
- End goal: Survivors-like MVP
- Feature specifications
- What stays vs what's added
- Success criteria
- Design principles

**ROADMAP.md** - How We Get There
- 7-phase development plan
- Current phase: Phase 2 (Ally System)
- Task checklists for each phase
- Time estimates and milestones
- Risk management

### 🤖 For AI Assistants

**.cursor/CONTEXT.md** - Quick Reference
- 30-second project overview
- Common tasks with code examples
- What to avoid
- Session workflow
- Debugging tips

---

## 📊 Information Architecture

```
README.md
    │
    ├─→ Users: What is this? How do I play?
    │
    ├─→ Developers: How do I run/build?
    │
    └─→ Contributors: Where's the dev docs?
            │
            ├─→ CURRENT_STATE.md
            │       │
            │       ├─→ What's implemented now?
            │       ├─→ How is code organized?
            │       └─→ Quick reference
            │
            ├─→ TARGET_SPEC.md
            │       │
            │       ├─→ What are we building?
            │       ├─→ Why these features?
            │       └─→ Success criteria
            │
            ├─→ ROADMAP.md
            │       │
            │       ├─→ What's next?
            │       ├─→ How long will it take?
            │       └─→ Task breakdown
            │
            └─→ .cursor/CONTEXT.md
                    │
                    ├─→ Quick AI onboarding
                    ├─→ Code patterns
                    └─→ Common pitfalls
```

---

## 🎯 When to Read What

### Starting a New Session
1. **CURRENT_STATE.md** - Understand exact state
2. **ROADMAP.md** - Check current phase tasks
3. **Git log** - See recent changes

### Planning New Features
1. **TARGET_SPEC.md** - Check if feature is in scope
2. **ROADMAP.md** - Find appropriate phase
3. **CURRENT_STATE.md** - Check dependencies

### Onboarding New Developers
1. **README.md** - Project overview
2. **.cursor/CONTEXT.md** - Quick start for AI
3. **CURRENT_STATE.md** - Deep dive into code
4. **TARGET_SPEC.md** - Understand vision

### Contributing Code
1. **CURRENT_STATE.md** - See code patterns
2. **Game/src/config/GameBalance.js** - Check values
3. Test changes
4. Update CURRENT_STATE.md if phase complete

---

## 📝 Documentation Maintenance

### Update Frequency

**Every Commit:**
- Keep code comments updated
- Commit messages descriptive

**After Phase Completion:**
- Update CURRENT_STATE.md
- Check off tasks in ROADMAP.md
- Update README.md version number

**Major Milestones:**
- Archive old documentation
- Create changelog
- Update screenshots/GIFs

### Who Updates What

| File | When | Who |
|------|------|-----|
| README.md | Version bump, features | Lead dev |
| CURRENT_STATE.md | Phase completion | Any dev |
| TARGET_SPEC.md | Scope changes | Lead dev |
| ROADMAP.md | Task progress | Any dev |
| .cursor/CONTEXT.md | Architecture changes | Any dev |

---

## 🗑️ Archived Documentation

Old planning and pre-refactor docs moved to `_archive/`:
- GAME_PLAN.md (pre-refactor architecture)
- DEVELOPMENT_GUIDE.md (outdated guide)
- IMPLEMENTATION_SUMMARY.md (pre-refactor state)
- ANALYSIS_SUMMARY.md (refactor planning)
- ARCHITECTURE_VISUAL.md (old diagrams)
- CODE_EXAMPLES.md (refactor examples)
- QUICK_START_REFACTOR.md (Phase 1 guide)
- REFACTORING_PLAN.md (Phase 1 plan)
- PHASE_1_COMPLETE.md (Phase 1 summary)

**When to Reference:**
- Understanding refactor decisions
- Learning from past architecture
- Historical context

**Don't Use For:**
- Current implementation details
- Active development

---

## ✅ Documentation Quality Standards

### Good Documentation
- ✅ Accurate (reflects current code)
- ✅ Concise (no redundancy)
- ✅ Organized (clear hierarchy)
- ✅ Actionable (specific tasks)
- ✅ Dated (last updated timestamp)

### Bad Documentation
- ❌ Outdated (describes old code)
- ❌ Redundant (duplicates info)
- ❌ Vague (unclear actions)
- ❌ Scattered (hard to navigate)
- ❌ Undated (unknown freshness)

---

## 🎓 Documentation Philosophy

### Principles

1. **Lean Over Comprehensive**
   - 4 core docs > 15 redundant docs
   - Quick reference > exhaustive detail
   - Actionable > theoretical

2. **Current Over Historical**
   - CURRENT_STATE.md always accurate
   - Archive old docs, don't delete
   - Git log for history

3. **Task-Oriented Over Explanatory**
   - "How to do X" > "What X is"
   - Code examples > prose
   - Quick wins > deep theory

4. **Maintainable Over Perfect**
   - Easy to update > beautiful prose
   - Simple structure > complex org
   - Living document > polished PDF

---

## 🚀 Quick Reference

### Common Questions

**"What's the current state?"**
→ Read CURRENT_STATE.md

**"What are we building?"**
→ Read TARGET_SPEC.md

**"What should I work on?"**
→ Check ROADMAP.md current phase

**"How do I [common task]?"**
→ See .cursor/CONTEXT.md

**"Why did we [past decision]?"**
→ Check git log or _archive/

**"Where's [specific code]?"**
→ CURRENT_STATE.md has file map

---

## 📊 Success Metrics

Documentation is working if:
- ✅ New devs productive in <30 mins
- ✅ AI assistants understand context immediately
- ✅ No duplicate information across files
- ✅ Everyone knows which doc to check
- ✅ Docs stay updated (current within 1 week)

Documentation needs work if:
- ❌ Devs ask "what's implemented?"
- ❌ AI assistants suggest outdated patterns
- ❌ Same info in multiple files
- ❌ Unclear where to look
- ❌ Docs contradict code

---

## 🔄 Version History

**v1.0** (Oct 17, 2025)
- Created lean documentation structure
- 4 core files + AI context
- Archived 9 old planning docs
- Current, accurate, actionable

---

**Remember:** Documentation serves the code, not the other way around.  
Keep it lean, keep it current, keep it useful.

