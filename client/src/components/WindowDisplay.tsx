import { useState, useRef, useCallback } from "react";
import type { PlacedElement } from "@/lib/progress";
import type { DecorativeElement, Festivity } from "@/lib/festivities";
import { getSeasonTreePath } from "@/lib/progress";
import { StickerIcon } from "./StickerIcon";
import { Trash2, Plus, Minus } from "lucide-react";

interface WindowDisplayProps {
  festivity: Festivity;
  placedElements: PlacedElement[];
  allElements: DecorativeElement[];
  onRemoveElement: (index: number) => void;
  onUpdateElement: (index: number, updates: Partial<PlacedElement>) => void;
  bgColor: string;
  lightsOn: boolean[];
  onToggleLight: (index: number) => void;
  lightColor: string;
}

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

interface LightPosition {
  x: number;
  y: number;
  side: "top" | "bottom" | "left" | "right";
}

const LIGHT_POSITIONS: LightPosition[] = [
  { x: 20, y: 0, side: "top" },
  { x: 50, y: 0, side: "top" },
  { x: 80, y: 0, side: "top" },
  { x: 20, y: 100, side: "bottom" },
  { x: 50, y: 100, side: "bottom" },
  { x: 80, y: 100, side: "bottom" },
  { x: 0, y: 33, side: "left" },
  { x: 0, y: 67, side: "left" },
  { x: 100, y: 33, side: "right" },
  { x: 100, y: 67, side: "right" },
];

function SpotLightFixture({ position, isOn, onClick, color, index }: {
  position: LightPosition;
  isOn: boolean;
  onClick: () => void;
  color: string;
  index: number;
}) {
  const glowColor = color + "50";
  const glowStrong = color + "25";

  let posStyle: React.CSSProperties = {};
  let fixtureRotation = "0deg";

  if (position.side === "top") {
    posStyle = { left: `${position.x}%`, top: "-18px", transform: "translateX(-50%)" };
    fixtureRotation = "180deg";
  } else if (position.side === "bottom") {
    posStyle = { left: `${position.x}%`, bottom: "-18px", transform: "translateX(-50%)" };
    fixtureRotation = "0deg";
  } else if (position.side === "left") {
    posStyle = { left: "-18px", top: `${position.y}%`, transform: "translateY(-50%)" };
    fixtureRotation = "90deg";
  } else {
    posStyle = { right: "-18px", top: `${position.y}%`, transform: "translateY(-50%)" };
    fixtureRotation = "-90deg";
  }

  return (
    <>
      <button
        className="absolute z-[70] w-9 h-9 flex items-center justify-center cursor-pointer"
        style={posStyle}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Toggle ${position.side} light ${index + 1}`}
        data-testid={`button-light-${index}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `rotate(${fixtureRotation})` }}>
          <rect x="10" y="0" width="4" height="6" rx="1" fill="#666" stroke="#444" strokeWidth="0.5" />
          <path d="M5,6 L19,6 L16,18 L8,18 Z" fill={isOn ? "#333" : "#555"} stroke="#444" strokeWidth="0.5" />
          <ellipse cx="12" cy="18" rx="5" ry="2" fill={isOn ? color : "#777"} opacity={isOn ? 1 : 0.4} />
          {isOn && (
            <ellipse cx="12" cy="18" rx="4" ry="1.5" fill="#fff" opacity="0.6" />
          )}
        </svg>
        {isOn && (
          <div className="absolute w-3 h-3 rounded-full" style={{
            bottom: position.side === "top" ? "2px" : position.side === "bottom" ? "auto" : "50%",
            top: position.side === "bottom" ? "2px" : "auto",
            left: position.side === "right" ? "2px" : position.side === "left" ? "auto" : "50%",
            right: position.side === "left" ? "2px" : "auto",
            transform: position.side === "top" || position.side === "bottom" ? "translateX(-50%)" : "translateY(-50%)",
            boxShadow: `0 0 6px 3px ${color}80`,
            background: color,
            opacity: 0.7,
          }} />
        )}
      </button>
      {isOn && (
        <div
          className="absolute pointer-events-none z-[5]"
          style={{
            ...getHaloStyle(position),
            background: getHaloGradient(position, glowColor, glowStrong),
          }}
        />
      )}
    </>
  );
}

function getHaloGradient(position: LightPosition, glowColor: string, glowStrong: string): string {
  if (position.side === "top") {
    return `radial-gradient(ellipse 60% 100% at 50% 0%, ${glowColor} 0%, ${glowStrong} 40%, transparent 80%)`;
  } else if (position.side === "bottom") {
    return `radial-gradient(ellipse 60% 100% at 50% 100%, ${glowColor} 0%, ${glowStrong} 40%, transparent 80%)`;
  } else if (position.side === "left") {
    return `radial-gradient(ellipse 100% 60% at 0% 50%, ${glowColor} 0%, ${glowStrong} 40%, transparent 80%)`;
  } else {
    return `radial-gradient(ellipse 100% 60% at 100% 50%, ${glowColor} 0%, ${glowStrong} 40%, transparent 80%)`;
  }
}

function getHaloStyle(position: LightPosition): React.CSSProperties {
  const w = 140;
  const h = 100;
  if (position.side === "top") {
    return { left: `${position.x}%`, top: "0%", width: `${w}px`, height: `${h}px`, transform: "translateX(-50%)" };
  } else if (position.side === "bottom") {
    return { left: `${position.x}%`, bottom: "0%", width: `${w}px`, height: `${h}px`, transform: "translateX(-50%)" };
  } else if (position.side === "left") {
    return { left: "0%", top: `${position.y}%`, width: `${h}px`, height: `${w}px`, transform: "translateY(-50%)" };
  } else {
    return { right: "0%", top: `${position.y}%`, width: `${h}px`, height: `${w}px`, transform: "translateY(-50%)" };
  }
}

function SchematicFurniture({ dark }: { dark: boolean }) {
  const woodFill = dark ? "#5a4a3a" : "#c4a37a";
  const woodStroke = dark ? "#7a6a5a" : "#8B7355";
  const shelfFill = dark ? "#4a3a2a" : "#b89868";
  const metalFill = dark ? "#666" : "#999";

  return (
    <g className="pointer-events-none">
      <rect x="30" y="240" width="120" height="8" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="1" />
      <rect x="32" y="248" width="4" height="90" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="144" y="248" width="4" height="90" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="30" y="280" width="120" height="6" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="30" y="315" width="120" height="6" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="30" y="338" width="120" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />

      <rect x="240" y="300" width="100" height="6" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="1" />
      <rect x="250" y="306" width="6" height="54" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="324" y="306" width="6" height="54" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="240" y="360" width="100" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />

      <rect x="430" y="190" width="6" height="170" fill={metalFill} stroke={woodStroke} strokeWidth="0.5" />
      <rect x="400" y="190" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="400" y="250" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="400" y="310" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="400" y="356" width="70" height="8" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />

      <rect x="195" y="180" width="80" height="4" rx="1" fill={metalFill} stroke={woodStroke} strokeWidth="0.5" />
      <line x1="200" y1="176" x2="200" y2="180" stroke={metalFill} strokeWidth="2" />
      <line x1="270" y1="176" x2="270" y2="180" stroke={metalFill} strokeWidth="2" />

      <rect x="510" y="280" width="50" height="6" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="512" y="286" width="4" height="44" fill={woodFill} stroke={woodStroke} strokeWidth="0.5" />
      <rect x="554" y="286" width="4" height="44" fill={woodFill} stroke={woodStroke} strokeWidth="0.5" />
      <rect x="510" y="308" width="50" height="5" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.5" />
      <rect x="510" y="330" width="50" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />

      <line x1="30" y1="364" x2="570" y2="364" stroke={woodStroke} strokeWidth="1" opacity="0.3" />
    </g>
  );
}

function StorefrontFrame({ dark, treeImagePath }: {
  dark: boolean;
  treeImagePath: string;
}) {
  const brickBase = dark ? "#4a4050" : "#a0785a";
  const brickLight = dark ? "#5a5060" : "#b8906a";
  const brickDark = dark ? "#3a3040" : "#8a6848";
  const mortarColor = dark ? "#353040" : "#c4a882";
  const awningColor = "#6B4226";
  const awningStripe = "#8B5E3C";
  const sillColor = dark ? "#555" : "#888";
  const sidewalkBase = dark ? "#3a3a40" : "#b0a898";
  const sidewalkLight = dark ? "#454550" : "#c8bca8";
  const sidewalkLine = dark ? "#2a2a30" : "#988878";
  const doorFrameColor = dark ? "#4a4050" : "#6B4226";
  const doorPanelColor = dark ? "#3a3545" : "#8B6848";
  const doorHandleColor = dark ? "#888" : "#C0A060";
  const signBg = dark ? "#2a2535" : "#f5efe6";
  const signBorder = dark ? "#555" : "#6B4226";
  const signText = dark ? "#e0d0c0" : "#5a4a3a";

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <div className="absolute -left-12 top-0 bottom-10 w-12 overflow-hidden"
        style={{ background: mortarColor }}>
        {[...Array(16)].map((_, row) => (
          <div key={`lr-${row}`} className="flex" style={{ marginTop: row === 0 ? 0 : 1 }}>
            {[...Array(3)].map((_, col) => (
              <div key={`lb-${row}-${col}`} style={{
                width: row % 2 === 0 ? (col === 0 ? 14 : 20) : (col === 0 ? 8 : 20),
                height: 14,
                marginLeft: 1,
                marginRight: 1,
                background: (row + col) % 3 === 0 ? brickLight : (row + col) % 3 === 1 ? brickBase : brickDark,
                borderRadius: 1,
              }} />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute -right-16 top-0 bottom-10 w-16 overflow-hidden"
        style={{ background: mortarColor }}>
        {[...Array(16)].map((_, row) => (
          <div key={`rr-${row}`} className="flex" style={{ marginTop: row === 0 ? 0 : 1 }}>
            {[...Array(4)].map((_, col) => (
              <div key={`rb-${row}-${col}`} style={{
                width: row % 2 === 0 ? (col === 0 ? 14 : 18) : (col === 0 ? 8 : 18),
                height: 14,
                marginLeft: 1,
                marginRight: 1,
                background: (row + col) % 3 === 0 ? brickBase : (row + col) % 3 === 1 ? brickLight : brickDark,
                borderRadius: 1,
              }} />
            ))}
          </div>
        ))}

        <div className="absolute top-4 right-0 w-10 h-full" style={{ background: doorFrameColor, borderLeft: `2px solid ${doorHandleColor}44` }}>
          <div className="absolute top-2 left-1 right-1 bottom-[40%]" style={{ background: doorPanelColor, borderRadius: "2px 2px 0 0" }}>
            <div className="absolute inset-1 border opacity-30" style={{ borderColor: doorHandleColor, borderRadius: 2 }} />
            <div className="absolute top-[45%] left-1 w-2.5 h-2.5 rounded-full" style={{ background: doorHandleColor, border: `1px solid ${doorHandleColor}` }} />
          </div>
          <div className="absolute left-1 right-1 bottom-[10%] h-[28%]" style={{ background: doorPanelColor, borderRadius: 2 }}>
            <div className="absolute inset-1 border opacity-30" style={{ borderColor: doorHandleColor, borderRadius: 2 }} />
          </div>
        </div>
      </div>

      <div className="absolute -left-12 -right-16 -top-14 h-14 z-[2]">
        <div className="w-full h-8 flex">
          {[...Array(12)].map((_, i) => (
            <div key={`aw-${i}`} className="flex-1 h-full" style={{
              background: i % 2 === 0 ? awningColor : awningStripe,
              borderBottom: `1px solid ${awningColor}88`,
            }} />
          ))}
        </div>
        <svg className="w-full h-6" viewBox="0 0 200 12" preserveAspectRatio="none">
          <path d="M0,0 Q5,11 10,0 Q15,11 20,0 Q25,11 30,0 Q35,11 40,0 Q45,11 50,0 Q55,11 60,0 Q65,11 70,0 Q75,11 80,0 Q85,11 90,0 Q95,11 100,0 Q105,11 110,0 Q115,11 120,0 Q125,11 130,0 Q135,11 140,0 Q145,11 150,0 Q155,11 160,0 Q165,11 170,0 Q175,11 180,0 Q185,11 190,0 Q195,11 200,0 L200,12 L0,12 Z"
            fill={awningColor} opacity="0.9" />
        </svg>
      </div>

      <div className="absolute -top-[72px] left-[calc(50%-20px)] -translate-x-1/2 z-[3] px-5 py-1 rounded-sm"
        style={{ background: signBg, border: `2px solid ${signBorder}`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <span className="text-sm font-black tracking-[0.2em] uppercase" style={{
          fontFamily: "'Architects Daughter', cursive",
          color: signText,
        }}>
          BOOKSHOP
        </span>
      </div>

      <div className="absolute -left-1 -right-1 -top-[1px] h-2 z-[3]" style={{ background: sillColor, borderRadius: "2px 2px 0 0" }} />
      <div className="absolute -left-1 -right-1 bottom-0 h-2 z-[3]" style={{ background: sillColor, borderRadius: "0 0 2px 2px" }} />

      <div className="absolute -left-12 -right-16 -bottom-10 h-10 z-[2] overflow-hidden">
        <div className="w-full h-2" style={{ background: sidewalkLine }} />
        <div className="w-full h-full flex">
          {[...Array(16)].map((_, i) => (
            <div key={`sw-${i}`} className="flex-1 h-full" style={{
              background: i % 2 === 0 ? sidewalkBase : sidewalkLight,
              borderRight: `1px solid ${sidewalkLine}`,
            }} />
          ))}
        </div>
      </div>

      <div className="absolute -left-[48px] -top-[60px] z-[4]">
        <img
          src={treeImagePath}
          alt="Seasonal tree"
          className="w-20 h-[120px] object-contain"
          style={{ filter: dark ? "brightness(0.85)" : "none" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export function WindowDisplay({
  festivity, placedElements, allElements, onRemoveElement, onUpdateElement,
  bgColor, lightsOn, onToggleLight, lightColor,
}: WindowDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const dark = isDark(bgColor);
  const titleColor = dark ? "#ffffffdd" : "#333";
  const treeImagePath = getSeasonTreePath(festivity.id);

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
    <div className="relative" style={{ padding: "20px 20px 14px 16px", marginLeft: "-8px" }}>
      <StorefrontFrame dark={dark} treeImagePath={treeImagePath} />

      <div
        ref={canvasRef}
        className="relative w-full overflow-visible"
        style={{
          aspectRatio: "600/370",
          border: `2px solid ${dark ? "#555" : "#777"}`,
          boxShadow: dark ? "inset 0 0 30px rgba(0,0,0,0.3)" : "inset 0 0 20px rgba(0,0,0,0.04)",
          borderRadius: 2,
        }}
        onClick={() => setSelectedIndex(null)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        data-testid="window-display-canvas"
      >
        <svg viewBox="0 0 600 370" className="w-full h-full pointer-events-none absolute inset-0">
          <defs>
            <pattern id="doodle-bg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="0.5" fill={dark ? "#ffffff" : "#333"} opacity="0.04" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="600" height="370" fill={bgColor} />
          <rect x="0" y="0" width="600" height="370" fill="url(#doodle-bg)" />
          <text x="300" y="32" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="18" fill={titleColor} fontWeight="bold" opacity="0.7" data-testid="text-festivity-name">
            {festivity.name} &middot; {festivity.month}
          </text>
          <SchematicFurniture dark={dark} />
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
                      aria-label="Enlarge"
                      data-testid={`button-enlarge-${index}`}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleScale(index, -0.3)}
                      className="p-1 rounded-full text-blue-600"
                      aria-label="Shrink"
                      data-testid={`button-shrink-${index}`}
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => { onRemoveElement(index); setSelectedIndex(null); }}
                      className="p-1 rounded-full text-red-600"
                      aria-label="Remove"
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

        {LIGHT_POSITIONS.map((pos, i) => (
          <SpotLightFixture
            key={`light-${i}`}
            position={pos}
            isOn={lightsOn[i] || false}
            onClick={() => onToggleLight(i)}
            color={lightColor}
            index={i}
          />
        ))}

        {placedElements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className={`text-sm px-4 py-2 rounded-full ${dark ? "text-white/50 bg-white/10" : "text-slate-400 bg-white/80"}`}>
              Click decorations to place them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
