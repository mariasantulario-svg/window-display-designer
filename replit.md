# Window Display Designer

## Overview
An interactive educational web app for FP Basica de Comercio students. Students design bookshop window displays (escaparates) for 9 different festivities while practising English retail and holiday vocabulary through quizzes.

## Architecture
- **Frontend-only app** with localStorage for persistence
- React + Tailwind CSS + Shadcn UI components
- Pointer events for drag-and-drop within the canvas
- Kawaii-style PNG images for decorations (90 decoration images + 4 seasonal trees)
- "Architects Daughter" handwriting font for the doodle aesthetic

## Key Files
- `client/src/data.json` - All 9 festivities JSON data (elements, quizzes, color palettes)
- `client/src/lib/festivities.ts` - Maps JSON data to app types, progressive unlock logic, answer shuffling, `getUnlockStatus()`
- `client/src/lib/progress.ts` - localStorage progress management, placement limits, lights state, light color, season mapping, furniture positions, hints tracking, screenshots
- `client/src/components/StickerIcon.tsx` - Kawaii image renderer component
- `client/src/components/WindowDisplay.tsx` - Main escaparate canvas with storefront frame, draggable/resizable furniture, spotlight lights, decoration placement, and contextual speech bubbles
- `client/src/components/ElementPanel.tsx` - Click-to-place decoration panel
- `client/src/components/QuizModal.tsx` - Vocabulary quiz dialog with unlock feedback
- `client/src/components/FestivalSelector.tsx` - Festivity dropdown selector
- `client/src/components/OnboardingCarousel.tsx` - First-time user onboarding carousel (5 slides)
- `client/src/pages/Home.tsx` - Main page with top bar, full-screen escaparate, bottom decorations drawer, screenshot banner, gallery

## UI Layout
- **Top bar**: Festivity dropdown selector + quiz score badge + Take Quiz button
- **Main area**: Full-screen escaparate (max-w-4xl, no sidebars)
- **Bottom slide-up drawer**: Bottom panel triggered by centered "Decorations" button, contains decorations on left and lights/background controls on right
- **Onboarding**: 5-slide carousel on first visit (stored in localStorage `onboarding_completed`)
- **Screenshot banner**: Appears when all features for a festivity are unlocked, allows capturing and viewing gallery
- **Contextual speech bubbles**: Hover hints on escaparate elements, auto-dismissed after first use

## Features
- 9 Festivities: Valentine's Day, Easter, Spring Sale, Mother's Day, Summer Sale, Back to School, Halloween, Black Friday, Christmas
- **Storefront Frame**: Blue-gray brick walls, fixed brown striped awning, editable shop name sign (persisted globally, customisable by clicking the sign), stone tile sidewalk, partial door on right
- **Seasonal Tree**: Kawaii tree on LEFT side of sidewalk, changes per festivity season (spring cherry blossoms, summer green, autumn orange, winter snow)
- **10 Spotlight Lights**: 3 top, 3 bottom, 2 each side. SVG spotlight fixtures. Unlocked progressively one-by-one based on quiz score. Toggle on/off individually or all at once. Choosable glow color (10 color options)
- **Draggable/Resizable Furniture**: 3 floor-standing pieces (bookcases, pedestal) + 6 wall shelves. Unlocked at 30% quiz score. Scale range 0.3-1.5, positions saved per festivity
- **6 Kawaii Fixed Items**: books-row, dictionary, notebook, globe, pencil-cup, book-stack — draggable and resizable but not removable, positions saved per festivity
- **90 Kawaii Decoration Images**: 10 per festivity (3 base + 7 bonus), cute chibi style
- Click elements to place on window display (max 5 copies each)
- Drag placed elements to reposition within the canvas
- Resize elements (scale 0.5x - 2.5x) with +/- controls
- Background color picker with 14 presets + festivity palette colors, progressively unlocked in groups of 3
- Light color picker with 10 color options
- **Quiz answer randomization**: Seeded shuffle so correct answer appears in varied positions (not always B)
- **Contextual Speech Bubbles**: Hover-triggered hints on background ("unlock more colours"), lights ("unlock more lights"), elements ("drag to move, +/- to resize"), furniture ("unlock/rearrange"), shop name sign. Each hint auto-dismissed after user performs the described action once. Uses localStorage key `window-display-hints-dismissed`.
- **Screenshot Capture**: When all features unlocked for a festivity (all decorations, lights, bg colors, furniture), a banner appears with Screenshot button. Uses html2canvas. Screenshots saved to localStorage (`window-display-screenshots`). Gallery modal shows all captured screenshots with delete option.
- **Progressive unlock system** (`getUnlockStatus()`):
  - Bonus decorations: proportional to score (score * items / total)
  - Lights: unlocked one-by-one at thresholds [2,3,4,5,6,7,8,8,9,10] scaled to quiz length
  - Background colors: 3 base + groups of 3 at thresholds [1,4,6,8,9,10]
  - Furniture: unlocked at 30% score threshold
  - Quiz results show "You've unlocked: X decorations, Y spotlights, Z colours" and "Next goals: Score N to unlock..."
- 7 unlockable bonus elements per festivity
- Progress saved in localStorage (decorations, lights, light color, background color, quiz scores, furniture positions)

## Running
- `npm run dev` starts the Express backend + Vite frontend on port 5000
