import { useDroppable } from "@dnd-kit/core";
import type { PlacedElement } from "@/lib/progress";
import type { DecorativeElement, Festivity } from "@/lib/festivities";
import { DoodleIcon } from "./DoodleSvgs";

interface WindowDisplayProps {
  festivity: Festivity;
  placedElements: PlacedElement[];
  allElements: DecorativeElement[];
  onRemoveElement: (index: number) => void;
}

function ShelfBooks() {
  return (
    <g>
      <rect x="60" y="260" width="30" height="50" rx="2" fill="#1a3a5c" stroke="#333" strokeWidth="2" />
      <text x="75" y="290" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="6" fill="#FFD700" transform="rotate(-90 75 290)">OXFORD</text>

      <rect x="95" y="265" width="25" height="45" rx="2" fill="#8B0000" stroke="#333" strokeWidth="2" />
      <text x="108" y="292" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#FFD700" transform="rotate(-90 108 292)">CAMBRIDGE</text>

      <rect x="125" y="268" width="22" height="42" rx="2" fill="#2E8B57" stroke="#333" strokeWidth="2" />
      <text x="136" y="293" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#fff" transform="rotate(-90 136 293)">GRAMMAR</text>

      <rect x="152" y="272" width="18" height="38" rx="2" fill="#4169E1" stroke="#333" strokeWidth="2" />
      <text x="161" y="295" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="4" fill="#fff" transform="rotate(-90 161 295)">VERBS</text>

      <rect x="400" y="262" width="28" height="48" rx="2" fill="#6B3FA0" stroke="#333" strokeWidth="2" />
      <text x="414" y="290" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#FFD700" transform="rotate(-90 414 290)">ENGLISH A1</text>

      <rect x="432" y="268" width="24" height="42" rx="2" fill="#B22222" stroke="#333" strokeWidth="2" />
      <text x="444" y="293" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="5" fill="#fff" transform="rotate(-90 444 293)">READING</text>

      <rect x="460" y="270" width="20" height="40" rx="2" fill="#1a3a5c" stroke="#333" strokeWidth="2" />
      <text x="470" y="294" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="4" fill="#ADD8E6" transform="rotate(-90 470 294)">SKILLS</text>

      <rect x="220" y="275" width="16" height="35" rx="1" fill="#FFD700" stroke="#333" strokeWidth="1.5" />
      <rect x="240" y="278" width="14" height="32" rx="1" fill="#FF6347" stroke="#333" strokeWidth="1.5" />
      <rect x="258" y="280" width="14" height="30" rx="1" fill="#4169E1" stroke="#333" strokeWidth="1.5" />
      <rect x="276" y="276" width="16" height="34" rx="1" fill="#32CD32" stroke="#333" strokeWidth="1.5" />
      <rect x="296" y="280" width="12" height="30" rx="1" fill="#DDA0DD" stroke="#333" strokeWidth="1.5" />
    </g>
  );
}

function ShelfStructure() {
  return (
    <g>
      <rect x="40" y="308" width="520" height="8" rx="2" fill="#8B7355" stroke="#333" strokeWidth="2" />
      <rect x="40" y="308" width="520" height="4" fill="#A0896C" opacity="0.5" />

      <rect x="48" y="316" width="8" height="30" fill="#8B7355" stroke="#333" strokeWidth="1.5" />
      <rect x="544" y="316" width="8" height="30" fill="#8B7355" stroke="#333" strokeWidth="1.5" />

      <rect x="40" y="345" width="520" height="6" rx="2" fill="#7A6548" stroke="#333" strokeWidth="1.5" />
    </g>
  );
}

function StationeryItems() {
  return (
    <g>
      <line x1="80" y1="342" x2="80" y2="320" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <polygon points="80,318 78,324 82,324" fill="#FFF5E1" stroke="#333" strokeWidth="1" />

      <line x1="90" y1="342" x2="90" y2="325" stroke="#FF6347" strokeWidth="3" strokeLinecap="round" />
      <polygon points="90,323 88,329 92,329" fill="#FFF5E1" stroke="#333" strokeWidth="1" />

      <rect x="100" y="322" width="20" height="22" rx="1" fill="#87CEEB" stroke="#333" strokeWidth="1.5" />
      <line x1="105" y1="328" x2="116" y2="328" stroke="#fff" strokeWidth="1" />
      <line x1="105" y1="332" x2="116" y2="332" stroke="#fff" strokeWidth="1" />
      <line x1="105" y1="336" x2="112" y2="336" stroke="#fff" strokeWidth="1" />

      <ellipse cx="440" cy="335" rx="16" ry="10" fill="#DEB887" stroke="#333" strokeWidth="1.5" />
      <circle cx="435" cy="332" r="3" fill="#FF6347" />
      <circle cx="440" cy="330" r="3" fill="#4169E1" />
      <circle cx="445" cy="332" r="3" fill="#32CD32" />

      <rect x="470" y="324" width="40" height="20" rx="2" fill="#FF69B4" stroke="#333" strokeWidth="1.5" />
      <circle cx="476" cy="334" r="3" fill="#FFD700" stroke="#333" strokeWidth="0.5" />
      <circle cx="484" cy="334" r="3" fill="#FF0000" stroke="#333" strokeWidth="0.5" />
      <circle cx="492" cy="334" r="3" fill="#4169E1" stroke="#333" strokeWidth="0.5" />
      <circle cx="500" cy="334" r="3" fill="#32CD32" stroke="#333" strokeWidth="0.5" />
    </g>
  );
}

export function WindowDisplay({ festivity, placedElements, allElements, onRemoveElement }: WindowDisplayProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "window-display" });

  return (
    <div
      ref={setNodeRef}
      className="relative w-full overflow-visible"
      style={{ aspectRatio: "600/400" }}
      data-testid="window-display-canvas"
    >
      <svg
        viewBox="0 0 600 400"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
      >
        <defs>
          <pattern id="doodle-bg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill="#333" opacity="0.08" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="600" height="400" rx="8" fill="#FFF9F0" stroke="#333" strokeWidth="3" />
        <rect x="0" y="0" width="600" height="400" rx="8" fill="url(#doodle-bg)" />

        <rect x="20" y="15" width="560" height="60" rx="4" fill="none" />
        <text
          x="300"
          y="55"
          textAnchor="middle"
          fontFamily="'Architects Daughter', cursive"
          fontSize="28"
          fill="#333"
          fontWeight="bold"
        >
          {festivity.name} - Window Display
        </text>
        <line x1="120" y1="65" x2="480" y2="65" stroke="#333" strokeWidth="1.5" strokeDasharray="6 4" />

        <ShelfBooks />
        <ShelfStructure />
        <StationeryItems />

        <rect x="6" y="6" width="588" height="388" rx="6" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="8 6" opacity="0.3" />
      </svg>

      {placedElements.map((placed, index) => {
        const element = allElements.find(el => el.id === placed.elementId);
        if (!element) return null;
        return (
          <div
            key={`${placed.elementId}-${index}`}
            className="absolute cursor-pointer group"
            style={{
              left: `${placed.x}%`,
              top: `${placed.y}%`,
              transform: `translate(-50%, -50%) scale(${placed.scale})`,
              transition: "transform 0.15s ease",
            }}
            onClick={() => onRemoveElement(index)}
            data-testid={`placed-element-${index}`}
          >
            <DoodleIcon icon={element.svgIcon} color={element.color} size={50} />
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-white text-xs font-bold invisible group-hover:visible"
              style={{ fontSize: "10px" }}
            >
              x
            </div>
          </div>
        );
      })}

      {isOver && (
        <div className="absolute inset-0 rounded-md border-2 border-dashed border-primary pointer-events-none" style={{ backgroundColor: "rgba(240, 160, 60, 0.08)" }} />
      )}
    </div>
  );
}
