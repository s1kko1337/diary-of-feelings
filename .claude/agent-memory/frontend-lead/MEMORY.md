# Frontend Lead — Agent Memory

## Project State (as of 2026-03-05)

### Fully Implemented
- Core shell: App.vue, AppNavbar, AppHeader, AppBottomNav
- Theme system: theme.css (light + dark), useTheme composable
- Onboarding: 6-step flow with TopicSelector, OptionSelector, OnboardingProgress, OnboardingStep
- Emotion Diary: EmotionWheel, EmotionEntryForm, EmotionHistory, EmotionChart (echarts)
- API layer: client.js (request + ApiError), emotions.js wrapper, emotions.mock.js (localStorage)
- Stores: user.js, emotions.js (both Pinia composition)
- HomeView: hero + quick emotions + daily articles (static stubs) + AI advice placeholder
- ProfileView: full settings (theme, notifications, CBT mode, sound, data reset)
- MoreView: mobile overflow nav menu

### Stub Views (title only, no functionality)
- CbtView.vue, CbtEntryView.vue, TasksView.vue, TimeTrackerView.vue
- NotesView.vue, LibraryView.vue, ReportView.vue, ArticleView.vue

### Audit Issues Found
- Stub views use inline styles `:style="{ color: 'var(--color-text)' }"` -- violates no-inline-styles rule
- Stub views use Tailwind classes for title but inline style for color -- inconsistent
- HomeView line 47: `style="margin: 0"` -- inline style violation
- MoreView uses inline `:style` on links -- should use scoped CSS
- glass-card classes in main.css lack `-webkit-backdrop-filter` for Safari
- EmotionChart hardcodes colors (rgba values) instead of using CSS variables
- AppNavbar lacks `-webkit-backdrop-filter` alongside `backdrop-filter`
- HomeView .card duplicates glassmorphism pattern instead of using .glass-card global class

### Key Patterns Confirmed
- API pattern: src/api/xxx.js wraps src/api/mock/xxx.mock.js via request()
- Mock storage: localStorage with STORAGE_KEY constant
- Store pattern: Pinia composition with async actions wrapping API calls
- Composable pattern: useXxx.js exporting function useXxx() returning refs/computed
- Theme: singleton isDark ref outside function, shared across instances
- Emotion wheel: two-level drill-down (category -> emotions), data in emotions-wheel.js

### Priority Order for Next Modules
1. CBT Diary (CMER) -- core therapeutic feature, design specs in CLAUDE.md
2. Daily Articles -- central content feature, most visible to users
3. Notes -- low friction quick capture, simple to implement
4. Tasks -- contextual planner with intentions
5. Library -- aggregation view, depends on other modules having content
6. Time Tracker -- lower priority, awareness tool
7. Report -- depends on accumulated data from other modules

See `task-specs.md` for detailed delegation specs.
