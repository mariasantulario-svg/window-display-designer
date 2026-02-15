import { useState, useRef, useCallback } from "react";
import type { PlacedElement } from "@/lib/progress";
import type { DecorativeElement, Festivity } from "@/lib/festivities";
import { StickerIcon } from "./StickerIcon";
import { Trash2, Plus, Minus } from "lucide-react";

interface WindowDisplayProps {
  festivity: Festivity;
  placedElements: PlacedElement[];
  allElements: DecorativeElement[];
  onRemoveElement: (index: number) => void;
  onUpdateElement: (index: number, updates: Partial<PlacedElement>) => void;
  bgColor: string;
}

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function ShelfBooks({ dark }: { dark: boolean }) {
  const stroke = dark ? "#aaa" : "#333";
  return (
    <g>
      <rect x="60" y="260" width="30" height="50" rx="2" fill="#1a3a5c" stroke={stroke} strokeWidth="2" />
      <text x="75" y="290" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="6" fill="#FFD700" transform="rotate(-90 75 290)">OXFORD</text>
      <rect x="95" y="265" width="25" height="45" rx="2" fill="#8B0000" stroke={stroke} strokeWidth="2" />
      <text x="108" y="292" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#FFD700" transform="rotate(-90 108 292)">CAMBRIDGE</text>
      <rect x="125" y="268" width="22" height="42" rx="2" fill="#2E8B57" stroke={stroke} strokeWidth="2" />
      <text x="136" y="293" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#fff" transform="rotate(-90 136 293)">GRAMMAR</text>
      <rect x="152" y="272" width="18" height="38" rx="2" fill="#4169E1" stroke={stroke} strokeWidth="2" />
      <text x="161" y="295" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="4" fill="#fff" transform="rotate(-90 161 295)">VERBS</text>
      <rect x="400" y="262" width="28" height="48" rx="2" fill="#6B3FA0" stroke={stroke} strokeWidth="2" />
      <text x="414" y="290" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#FFD700" transform="rotate(-90 414 290)">ENGLISH A1</text>
      <rect x="432" y="268" width="24" height="42" rx="2" fill="#B22222" stroke={stroke} strokeWidth="2" />
      <text x="444" y="293" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#fff" transform="rotate(-90 444 293)">READING</text>
      <rect x="460" y="270" width="20" height="40" rx="2" fill="#1a3a5c" stroke={stroke} strokeWidth="2" />
      <text x="470" y="294" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="4" fill="#ADD8E6" transform="rotate(-90 470 294)">SKILLS</text>
      <rect x="220" y="275" width="16" height="35" rx="1" fill="#FFD700" stroke={stroke} strokeWidth="1.5" />
      <rect x="240" y="278" width="14" height="32" rx="1" fill="#FF6347" stroke={stroke} strokeWidth="1.5" />
      <rect x="258" y="280" width="14" height="30" rx="1" fill="#4169E1" stroke={stroke} strokeWidth="1.5" />
      <rect x="276" y="276" width="16" height="34" rx="1" fill="#32CD32" stroke={stroke} strokeWidth="1.5" />
      <rect x="296" y="280" width="12" height="30" rx="1" fill="#DDA0DD" stroke={stroke} strokeWidth="1.5" />
    </g>
  );
}

function ShelfStructure({ dark }: { dark: boolean }) {
  const stroke = dark ? "#999" : "#333";
  return (
    <g>
      <rect x="40" y="308" width="520" height="8" rx="2" fill="#8B7355" stroke={stroke} strokeWidth="2" />
      <rect x="40" y="308" width="520" height="4" fill="#A0896C" opacity="0.5" />
      <rect x="48" y="316" width="8" height="30" fill="#8B7355" stroke={stroke} strokeWidth="1.5" />
      <rect x="544" y="316" width="8" height="30" fill="#8B7355" stroke={stroke} strokeWidth="1.5" />
      <rect x="40" y="345" width="520" height="6" rx="2" fill="#7A6548" stroke={stroke} strokeWidth="1.5" />
    </g>
  );
}

function StationeryItems({ dark }: { dark: boolean }) {
  const stroke = dark ? "#999" : "#333";
  return (
    <g>
      <line x1="80" y1="342" x2="80" y2="320" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <polygon points="80,318 78,324 82,324" fill="#FFF5E1" stroke={stroke} strokeWidth="1" />
      <line x1="90" y1="342" x2="90" y2="325" stroke="#FF6347" strokeWidth="3" strokeLinecap="round" />
      <polygon points="90,323 88,329 92,329" fill="#FFF5E1" stroke={stroke} strokeWidth="1" />
      <rect x="100" y="322" width="20" height="22" rx="1" fill="#87CEEB" stroke={stroke} strokeWidth="1.5" />
      <line x1="105" y1="328" x2="116" y2="328" stroke="#fff" strokeWidth="1" />
      <line x1="105" y1="332" x2="116" y2="332" stroke="#fff" strokeWidth="1" />
      <line x1="105" y1="336" x2="112" y2="336" stroke="#fff" strokeWidth="1" />
      <ellipse cx="440" cy="335" rx="16" ry="10" fill="#DEB887" stroke={stroke} strokeWidth="1.5" />
      <circle cx="435" cy="332" r="3" fill="#FF6347" />
      <circle cx="440" cy="330" r="3" fill="#4169E1" />
      <circle cx="445" cy="332" r="3" fill="#32CD32" />
      <rect x="470" y="324" width="40" height="20" rx="2" fill="#FF69B4" stroke={stroke} strokeWidth="1.5" />
      <circle cx="476" cy="334" r="3" fill="#FFD700" stroke={stroke} strokeWidth="0.5" />
      <circle cx="484" cy="334" r="3" fill="#FF0000" stroke={stroke} strokeWidth="0.5" />
      <circle cx="492" cy="334" r="3" fill="#4169E1" stroke={stroke} strokeWidth="0.5" />
      <circle cx="500" cy="334" r="3" fill="#32CD32" stroke={stroke} strokeWidth="0.5" />
    </g>
  );
}

export function WindowDisplay({ festivity, placedElements, allElements, onRemoveElement, onUpdateElement, bgColor }: WindowDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const dark = isDark(bgColor);
  const titleColor = dark ? "#ffffffdd" : "#333";

  const handleScale = (index: number, delta: number) => {
    const currentScale = placedElements[index].scale || 1;
    const newScale = Math.max(0.5, Math.min(2.5, currentScale + delta));
    onUpdateElement(index, { scale: newScale });
  };

  const getPercentPosition = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 50, y: 50 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedIndex(index);
    setDraggingIndex(index);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex === null) return;
    e.preventDefault();
    const pos = getPercentPosition(e.clientX, e.clientY);
    onUpdateElement(draggingIndex, pos);
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full overflow-visible rounded-xl"
      style={{
        aspectRatio: "600/400",
        border: `3px solid ${festivity.color}`,
      }}
      onClick={() => setSelectedIndex(null)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid="window-display-canvas"
    >
      <svg viewBox="0 0 600 400" className="w-full h-full pointer-events-none">
        <defs>
          <pattern id="doodle-bg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill={dark ? "#ffffff" : "#333"} opacity="0.06" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="600" height="400" rx="8" fill={bgColor} />
        <rect x="0" y="0" width="600" height="400" rx="8" fill="url(#doodle-bg)" />
        <text x="300" y="55" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="24" fill={titleColor} fontWeight="bold" data-testid="text-festivity-name">
          {festivity.name}
        </text>
        <ShelfBooks dark={dark} />
        <ShelfStructure dark={dark} />
        <StationeryItems dark={dark} />
      </svg>

      {placedElements.map((placed, index) => {
        const element = allElements.find(el => el.id === placed.elementId);
        if (!element) return null;
        const isSelected = selectedIndex === index;

        return (
          <div
            key={`placed-${index}`}
            className={`absolute touch-none select-none ${
              draggingIndex === index ? "cursor-grabbing z-50" : "cursor-grab z-10"
            } ${isSelected ? "z-50" : ""}`}
            style={{
              left: `${placed.x}%`,
              top: `${placed.y}%`,
              transform: `translate(-50%, -50%) scale(${placed.scale || 1})`,
            }}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onClick={(e) => e.stopPropagation()}
            data-testid={`placed-element-${index}`}
          >
            <div className={`${isSelected ? "ring-2 ring-blue-400 ring-offset-2 rounded-lg" : ""} p-0.5`}>
              <StickerIcon imagePath={element.imagePath} name={element.name} size={56} />
            </div>

            {isSelected && (
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-[60]"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="flex gap-1 bg-white shadow-xl border rounded-full p-1">
                  <button
                    onClick={() => handleScale(index, 0.3)}
                    className="p-1 rounded-full text-blue-600"
                    data-testid={`button-enlarge-${index}`}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => handleScale(index, -0.3)}
                    className="p-1 rounded-full text-blue-600"
                    data-testid={`button-shrink-${index}`}
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => { onRemoveElement(index); setSelectedIndex(null); }}
                    className="p-1 rounded-full text-red-600"
                    data-testid={`button-remove-${index}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {placedElements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className={`text-sm px-4 py-2 rounded-full ${dark ? "text-white/50 bg-white/10" : "text-slate-400 bg-white/80"}`}>
            Click decorations to place them here
          </p>
        </div>
      )}
    </div>
  );
}
