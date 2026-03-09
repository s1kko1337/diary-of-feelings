# Frontend Lead -- Agent Memory

## Project State (as of 2026-03-07)

### FULL RESTART -- v2.0 Architecture
Project underwent complete vision restart. Old pill-navbar + module-list architecture replaced with:
- **Tree graph home** (SVG, two branches: Tasks / Emotions)
- **Two sections** with separate bottom navs
- **API-first pipeline**: Backend (FastAPI) -> Design -> Frontend
- **Backend added**: Python FastAPI at `/home/mike/projects/diary-of-feelings-backend/`

### New Module Structure
**Tasks section** (bottom nav: Zadachi / Zametki / Biblioteka):
- Tasks: calendar grid + colored sticky notes (drag & drop)
- Notes: iOS Notes style, AI parses content
- Library: documents (Word, PDF), personal knowledge base

**Emotions section** (bottom nav: Emotsii / Pomoshchnik / Otchyot):
- Emotions: emotion wheel + CBT kanban board (drag & drop cards)
- Assistant: AI chat interface (not just advice cards)
- Report: analytics for selected period

### What Carries Over from v1
- API client (client.js, request() pattern)
- Theme system (theme.css, useTheme.js)
- Emotion wheel components (EmotionWheel, EmotionEntryForm, EmotionHistory, EmotionChart)
- CBT components (will be adapted from list to kanban)
- Pinia stores (user, emotions, cbt -- will be adapted)
- Composables (useTheme, useChartColors, useEmotionWheel)
- Global styles (main.css glass-card classes)
- Onboarding flow, ProfileView

### What's Deleted from v1
- AppNavbar.vue (pill-navbar) -> replaced by tree graph
- MoreView.vue (overflow nav) -> replaced by bottom navs
- ArticleView, TimeTrackerView stubs -> modules removed from concept
- Daily articles module, Time tracker module -> removed

### New Tech Additions
- GSAP (complex animations: splash, tree graph, page transitions)
- VueDraggable / Sortable.js (sticky notes + CBT kanban)
- shadcn-vue dropped from stack

### Key Patterns Confirmed (still valid)
- CSS custom property binding via `:style` is acceptable (NOT inline-style violation)
- API: src/api/xxx.js wraps src/api/mock/xxx.mock.js via request()
- Mock storage: localStorage with STORAGE_KEY constant
- Store: Pinia composition with async actions wrapping API calls
- Composable: useXxx.js exporting function useXxx() returning refs/computed
- Emotion wheel: two-level drill-down, data in emotions-wheel.js

### Backend Setup (completed 2026-03-07)
- Location: `/home/mike/projects/diary-of-feelings-backend/`
- FastAPI + SQLAlchemy async + Pydantic, health check at `/api/health`
- Needs: `pip install -r requirements.txt`, alembic init

### Key Documents
- `CLAUDE.md` -- rewritten for v2.0
- `docs/concept.md` -- full product concept v2.0
- `docs/roadmap-frontend.md` -- phases 0-6
- `docs/roadmap-backend.md` -- phases 0-6 (in backend repo)
- `docs/design/navigation-and-screens.md` -- screen design specs
- `docs/task-specs.md` -- delegation archive

### Next Priority: Frontend Phase 0 (Foundation Cleanup)
1. Install GSAP + VueDraggable
2. Delete obsolete views (ArticleView, TimeTrackerView, MoreView) and AppNavbar
3. Restructure router for new route tree
4. Make AppBottomNav context-aware (tasks vs emotions)
5. Update App.vue layout
