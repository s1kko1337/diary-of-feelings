# Frontend Lead -- Agent Memory

## Project State (as of 2026-03-05)

### Fully Implemented
- Core shell: App.vue, AppNavbar, AppHeader, AppBottomNav
- Theme system: theme.css (light + dark), useTheme composable
- Onboarding: 6-step flow (TopicSelector, OptionSelector, OnboardingProgress, OnboardingStep)
- Emotion Diary: EmotionWheel, EmotionEntryForm, EmotionHistory (warm empty state), EmotionChart (echarts)
- CBT Diary (SMER): CbtView (list + filters + stats), CbtEntryView (full form + advanced mode), CbtEntryCard, CbtStatCard, CbtProgressBar, CbtEmotionPicker, CbtDistortionPicker
- API layer: client.js, emotions.js, cbt.js, user.js + corresponding mocks
- Stores: user.js, emotions.js, cbt.js (all Pinia composition)
- HomeView: hero + quick emotions + article stubs (static) + AI advice placeholder
- ProfileView: full settings (theme, notifications, CBT mode, sound, data reset)
- MoreView: glassmorphism-styled overflow nav

### Stub Views (consistent page-title pattern, no functionality)
- TasksView, TimeTrackerView, NotesView, LibraryView, ReportView, ArticleView

### Design Audit (completed 2026-03-05)
All known violations fixed:
- `-webkit-backdrop-filter` added where missing (AppHeader)
- Hardcoded `white`/`#fff` replaced with `var(--color-surface-solid)` everywhere
- EmotionsView: loading skeleton + error state added
- EmotionHistory: warm empty state with decorative orb
- MoreView: glassmorphism + hover lift on links
- AppBottomNav: hover state for non-active items
- HomeView: article cards got glass effect, .card de-duplication, AI card got glass-card-elevated
- useChartColors: surfaceSolid ref added
- Stub views: consistent page-title pattern (1.75rem, 700, -0.03em)

### Key Patterns Confirmed
- CSS custom property binding via `:style` is acceptable Vue pattern (NOT an inline-style violation)
- API: src/api/xxx.js wraps src/api/mock/xxx.mock.js via request()
- Mock storage: localStorage with STORAGE_KEY constant
- Store: Pinia composition with async actions wrapping API calls
- Composable: useXxx.js exporting function useXxx() returning refs/computed
- Theme: singleton isDark ref outside function
- Emotion wheel: two-level drill-down, data in emotions-wheel.js
- CBT form: progressive disclosure (basic SMER -> advanced with distortions/challenging)

### Priority Order for Next Modules
1. Daily Articles -- central content feature, HomeView stubs ready
2. AI Assistant -- HomeView placeholder ready, depends on emotions + CBT data
3. Notes -- low friction quick capture
4. Tasks -- contextual planner with intentions
5. Library -- aggregation, depends on other modules
6. Time Tracker -- awareness tool
7. Report -- depends on accumulated data

### Roadmap
See `docs/roadmap.md` for full roadmap with statuses.
See `task-specs.md` for delegation specs archive.
