# Window Display Designer

## Overview
An interactive educational web app for FP Basica de Comercio students. Students design bookshop window displays (escaparates) for 9 different festivities while practising English retail and holiday vocabulary through quizzes.

## Architecture
- **Frontend-only app** with localStorage for persistence
- React + Tailwind CSS + Shadcn UI components
- Drag and drop via @dnd-kit/core
- Doodle/line-art visual style using SVG components
- "Architects Daughter" handwriting font for the doodle aesthetic

## Key Files
- `client/src/lib/festivities.ts` - All 9 festivities data (elements, quizzes, config)
- `client/src/lib/progress.ts` - localStorage progress management
- `client/src/components/DoodleSvgs.tsx` - All SVG doodle icons
- `client/src/components/WindowDisplay.tsx` - The main escaparate canvas
- `client/src/components/ElementPanel.tsx` - Draggable decoration panel
- `client/src/components/QuizModal.tsx` - Vocabulary quiz dialog
- `client/src/components/FestivalSelector.tsx` - Festivity picker sidebar
- `client/src/pages/Home.tsx` - Main page with all components wired together

## Features
- 9 Festivities: Easter, Valentine's, Spring Sale, Mother's Day, Summer Sale, Back to School, Halloween, Black Friday, Christmas
- Drag & drop decorative elements onto window display
- Vocabulary quizzes (A1-A2 English) to unlock bonus decorations
- Progress saved in localStorage
- Doodle/hand-drawn SVG art style

## Running
- `npm run dev` starts the Express backend + Vite frontend on port 5000
