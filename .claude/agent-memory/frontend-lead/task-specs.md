# Task Specifications — Delegated Work

Generated: 2026-03-05

---

## Task 1: Fix Existing Code Quality Issues (Developer Agent)

**Module:** Cross-cutting
**Priority:** High
**Type:** Bug Fix / Refactor

### Context
The initial implementation has several CLAUDE.md violations that should be fixed before building new features, to avoid pattern drift.

### Acceptance Criteria
- [ ] Remove all inline styles from stub views (CbtView, CbtEntryView, TasksView, TimeTrackerView, NotesView, LibraryView, ReportView, ArticleView)
- [ ] Remove inline style from HomeView line 47 (`style="margin: 0"`)
- [ ] Remove inline `:style` from MoreView links -- use scoped CSS
- [ ] Add `-webkit-backdrop-filter` alongside every `backdrop-filter` in: main.css (.glass-card, .glass-card-elevated), AppNavbar.vue (.navbar-inner), HomeView.vue (.card)
- [ ] Replace HomeView .card with global .glass-card or .glass-card-elevated class
- [ ] Refactor EmotionChart to use CSS variables instead of hardcoded rgba values (use getComputedStyle or pass via props)

### Technical Constraints
- Files to modify: all stub views, HomeView.vue, MoreView.vue, main.css, AppNavbar.vue, EmotionChart.vue
- Stub views should use a consistent page-title class with scoped styles matching the pattern in EmotionsView.vue and ProfileView.vue
- Follow CLAUDE.md: no inline styles, `-webkit-backdrop-filter` required

### Definition of Done
- `npm run lint && npm run format` passes
- No inline `:style` attributes in any Vue template
- All `backdrop-filter` rules have matching `-webkit-backdrop-filter`

---

## Task 2: CBT Diary (CMER) — Design (Designer Agent)

**Module:** CBT Diary (CMER)
**Priority:** High
**Type:** New Feature — Design Phase

### Context
The CBT diary is the second core therapeutic module after the Emotion Diary. It follows the CMER model (Situation, Thoughts, Emotions, Reaction). The concept doc and CLAUDE.md define a basic mode (S+M+E) and advanced mode (full CMER + cognitive distortions + challenging + alternative thought + emotions after).

User scenario: A person experienced a stressful situation. They open the CBT diary, create a new entry. In basic mode they describe the situation, write automatic thoughts, and select emotions with intensity. In advanced mode they additionally identify cognitive distortions, challenge the thought, write an alternative, and re-rate emotions.

### Design Requirements
- Entry list view (CbtView): list of past entries, sorted by date, with a prominent "new entry" action
- Entry creation/editing flow (CbtEntryView): step-by-step or single-page form
- Basic mode toggle vs advanced mode (user preference stored in profile, but switchable per-entry)
- Cognitive distortion picker: list of common distortions with brief descriptions
- Emotion picker for "emotions" and "emotions after" fields: reuse EmotionWheel pattern or simplified version
- Empty state: warm, encouraging, no pressure
- Card-based layout using glassmorphism system
- Palette: use lavender as primary accent for CBT module
- Animations: calm transitions between form sections
- Mobile-first, responsive to desktop

### Constraints
- Palette: lavender, peach, mint, rose via CSS variables
- Max 5 glass layers per screen
- Icons: lucide, stroke-width 1.8, size 18-22
- No sidebars, content centered max-width 720px
- Tone: warm, supportive, not clinical

---

## Task 3: CBT Diary (CMER) — Implementation (Developer Agent)

**Module:** CBT Diary (CMER)
**Priority:** High
**Type:** New Feature
**Depends on:** Task 2 (design specs)

### Context
Implement the full CBT diary module based on designer agent specs. This is a core therapeutic module.

### Acceptance Criteria
- [ ] CbtView.vue: list of CMER entries, create new entry button, empty state
- [ ] CbtEntryView.vue: full CMER form (basic + advanced mode)
- [ ] Cognitive distortion selector component
- [ ] API layer: src/api/cbt.js + src/api/mock/cbt.mock.js (localStorage persistence)
- [ ] Store: src/stores/cbt.js (Pinia composition)
- [ ] Route params: /cbt (list), /cbt/new (create), /cbt/:id (view/edit)
- [ ] Basic mode: Situation + Thoughts + Emotions
- [ ] Advanced mode: + Reaction + Distortion + Challenge + Alternative + Emotions After
- [ ] Mode toggle respects user preference from profile but can be overridden per entry

### Technical Constraints
- Architecture: API -> mock -> localStorage pattern (see emotions.mock.js for reference)
- Store: Pinia composition syntax with async actions
- Components in src/components/cbt/
- Routes: add /cbt/new route to router/index.js
- Design: glassmorphism cards, lavender accent, scoped styles
- Reuse EmotionWheel or create simplified emotion picker for CBT emotion fields

### Data Model (CMER entry)
```js
{
  id: string,
  date: string (YYYY-MM-DD),
  situation: string,
  thoughts: string,
  emotions: [{ emotion: string, intensity: number }],
  reaction: string | null,           // advanced
  distortion: string | null,          // advanced
  challenge: string | null,           // advanced
  alternativeThought: string | null,  // advanced
  emotionsAfter: [{ emotion: string, intensity: number }] | null, // advanced
  mode: 'basic' | 'advanced',
  createdAt: string (ISO),
  updatedAt: string (ISO),
}
```

### Cognitive Distortions List
catastrophizing, mind-reading, black-and-white, personalization, overgeneralization, emotional-reasoning, should-statements, fortune-telling, labeling, discounting-positives

### Definition of Done
- Linting passes
- Vue 3 `<script setup>`, scoped styles, no inline styles
- All UI text in Russian
- Responsive: works on mobile and desktop

---

## Task 4: Daily Articles Module — Design (Designer Agent)

**Module:** Daily Articles
**Priority:** Medium
**Type:** New Feature — Design Phase

### Context
Three articles per day with a warming structure: (1) warm-up, (2) depth, (3) reflection. Currently HomeView shows static stubs. Need to design the article reading experience.

### Design Requirements
- ArticleView: full article reading page with progress indicator
- "Thought of the day" prompt after each article
- Save to library action
- Article card design for home and library views
- Reading progress bar (subtle, non-distracting)
- Tags/categories visual treatment

### Constraints
- Same glassmorphism + palette rules
- Editorial feel, generous whitespace
- Typography: body 0.9rem, line-height 1.65, headings 2-2.5rem weight 700

---

## Task 5: Notes Module — Implementation (Developer Agent)

**Module:** Notes & Ideas
**Priority:** Medium
**Type:** New Feature

### Context
Quick capture notepad with tags. Low friction, minimal UI. This is a simpler module that can be implemented without extensive design consultation.

### Acceptance Criteria
- [ ] NotesView.vue: list of notes, create new note inline, tag filter
- [ ] Note model: { id, text, tags[], createdAt, updatedAt }
- [ ] Tag system: idea, plan, quote, question (predefined + custom)
- [ ] API layer: src/api/notes.js + src/api/mock/notes.mock.js
- [ ] Store: src/stores/notes.js

### Technical Constraints
- Same patterns as emotions module
- Tags rendered as colored pills
- Empty state: encouraging, warm
- Inline creation (no separate page needed)

### Definition of Done
- Linting passes, scoped styles, no inline styles
- All UI text in Russian
