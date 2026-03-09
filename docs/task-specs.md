# Task Specifications Archive

> Frontend Lead delegation specs. Updated 2026-03-07.

---

## Task: Backend Python Project Setup

**Delegated to:** backend-python-developer
**Status:** Done (executed by frontend lead directly)
**Date:** 2026-03-07

### What was done
1. Created project structure at `/home/mike/projects/diary-of-feelings-backend/`
2. Created virtual environment (`python3 -m venv venv`)
3. Created `requirements.txt` with all dependencies
4. Created `app/main.py` -- FastAPI app with CORS and health-check `/api/health`
5. Created `app/config.py` -- Settings via pydantic-settings
6. Created `app/database.py` -- SQLAlchemy async engine + session dependency
7. Created all `__init__.py` files for packages
8. Created `.env.example`, `.gitignore`, `README.md`
9. Created `docs/roadmap-backend.md`

### Next steps for backend developer
- Install dependencies: `source venv/bin/activate && pip install -r requirements.txt`
- Initialize Alembic: `alembic init migrations`
- Begin Phase 1: Auth + User API (see `docs/roadmap-backend.md`)

---

## Task: Design Specification -- Navigation and Screens

**Delegated to:** ui-design-architect
**Status:** Draft created by frontend lead
**Date:** 2026-03-07
**Output:** `/home/mike/projects/diary-of-feelings/docs/design/navigation-and-screens.md`

### What was created
Design spec covering:
1. Splash screen (wave SVG animation)
2. Home screen tree graph (SVG interactive, two branches)
3. Swipe transitions between sections
4. Sticky notes (3 colors, paper texture, drag preview)
5. Calendar grid (monthly view, sticker dots)
6. Bottom navigation (two variants: Tasks / Emotions)
7. Design tokens (new CSS variables for sticky colors, sections, transitions)

### Needs from designer
- Visual mockups / wireframes for each screen
- SVG tree graph prototype
- Animation timing refinement
- Paper texture CSS pattern
- Mobile breakpoint specifics
- Accessibility review (contrast, touch targets)

---

## Task: Frontend Phase 0 -- Foundation Cleanup

**Delegated to:** developer agent (pending)
**Status:** Not started
**Date:** 2026-03-07

### Context
Project is undergoing full restart. New architecture replaces pill-navbar with tree graph home,
splits app into two sections (Tasks / Emotions) with separate bottom navs.

### Acceptance Criteria
- [ ] Install GSAP: `npm install gsap`
- [ ] Install VueDraggable: `npm install vuedraggable@next`
- [ ] Delete stub views: ArticleView, TimeTrackerView
- [ ] Delete AppNavbar.vue
- [ ] Restructure router/index.js for new route structure
- [ ] Make AppBottomNav.vue context-aware (tasks nav vs emotions nav)
- [ ] Update App.vue layout (remove pill-navbar references)

### Technical Constraints
- Keep existing emotion/CBT components intact (they will be adapted later)
- Keep API layer, stores, composables, theme system
- Router must support: /splash, /home, /tasks/*, /emotions/*, /profile, /onboarding
- Bottom nav must read current route to determine which nav to show
