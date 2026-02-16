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
- `client/src/lib/festivities.ts` - Maps JSON data to app types, progressive unlock logic
- `client/src/lib/progress.ts` - localStorage progress management, placement limits, lights state, light color, season mapping
- `client/src/components/StickerIcon.tsx` - Kawaii image renderer component
- `client/src/components/WindowDisplay.tsx` - Main escaparate canvas with storefront frame, schematic furniture, spotlight lights, and decoration placement
- `client/src/components/ElementPanel.tsx` - Click-to-place decoration panel
- `client/src/components/QuizModal.tsx` - Vocabulary quiz dialog
- `client/src/components/FestivalSelector.tsx` - Festivity picker sidebar
- `client/src/pages/Home.tsx` - Main page with all components wired together
- `client/public/kawaii/` - All kawaii PNG images (90 decorations + 4 seasonal trees)

## Features
- 9 Festivities: Valentine's Day, Easter, Spring Sale, Mother's Day, Summer Sale, Back to School, Halloween, Black Friday, Christmas
- **Storefront Frame**: Blue-gray brick walls, fixed brown striped awning, editable shop name sign (persisted globally), stone tile sidewalk, partial door on right
- **Seasonal Tree**: Kawaii tree emerging from terracotta planter, changes per festivity season (spring cherry blossoms, summer green, autumn orange, winter snow)
- **10 Spotlight Lights**: 3 top, 3 bottom, 2 each side. SVG spotlight fixtures. Toggle on/off individually or all at once. Choosable glow color (10 color options)
- **Schematic Furniture**: 3 floor-standing pieces (bookcases, pedestal) aligned to floor + 6 wall shelves with L-brackets at various heights (not draggable, clean line-art style)
- **6 Kawaii Fixed Items**: books-row, dictionary, notebook, globe, pencil-cup, book-stack — draggable and resizable but not removable, positions saved per festivity
- **90 Kawaii Decoration Images**: 10 per festivity (3 base + 7 bonus), cute chibi style
- Click elements to place on window display (max 5 copies each)
- Drag placed elements to reposition within the canvas
- Resize elements (scale 0.5x - 2.5x) with +/- controls
- Background color picker with 14 presets + festivity palette colors
- Light color picker with 10 color options
- Vocabulary quizzes (A1-A2 English) with progressive unlocking:
  - 40% score = 1 item, 60% = 3 items, 80% = 5 items, 100% = all items
- 7 unlockable bonus elements per festivity
- Progress saved in localStorage (decorations, lights, light color, background color, quiz scores)

## Running
- `npm run dev` starts the Express backend + Vite frontend on port 5000
