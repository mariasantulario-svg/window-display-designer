# Window Display Designer

## Overview
An interactive educational web app for FP Basica de Comercio students. Students design bookshop window displays (escaparates) for 9 different festivities while practising English retail and holiday vocabulary through quizzes.

## Architecture
- **Frontend-only app** with localStorage for persistence
- React + Tailwind CSS + Shadcn UI components
- Pointer events for drag-and-drop within the canvas
- Lucide-react icons with sticker styling (dashed borders, soft backgrounds)
- "Architects Daughter" handwriting font for the doodle aesthetic

## Key Files
- `client/src/data.json` - All 9 festivities JSON data (elements, quizzes, color palettes)
- `client/src/lib/festivities.ts` - Maps JSON data to app types, progressive unlock logic
- `client/src/lib/progress.ts` - localStorage progress management, placement limits
- `client/src/components/StickerIcon.tsx` - Lucide-react icon wrapper with sticker/doodle styling
- `client/src/components/WindowDisplay.tsx` - The main escaparate canvas with drag, resize, color
- `client/src/components/ElementPanel.tsx` - Click-to-place decoration panel
- `client/src/components/QuizModal.tsx` - Vocabulary quiz dialog
- `client/src/components/FestivalSelector.tsx` - Festivity picker sidebar
- `client/src/pages/Home.tsx` - Main page with all components wired together

## Features
- 9 Festivities: Valentine's Day, Easter, Spring Sale, Mother's Day, Summer Sale, Back to School, Halloween, Black Friday, Christmas
- Click elements to place on window display (max 5 copies each)
- Drag placed elements to reposition within the canvas
- Resize elements (scale 0.5x - 2.5x) with +/- controls
- Change element color from festivity color palette (7 colors per festivity)
- Vocabulary quizzes (A1-A2 English) with progressive unlocking:
  - 40% score = 1 item, 60% = 3 items, 80% = 5 items, 100% = all items
- 7 unlockable bonus elements per festivity
- Progress saved in localStorage

## Running
- `npm run dev` starts the Express backend + Vite frontend on port 5000
