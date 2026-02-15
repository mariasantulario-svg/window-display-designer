import { useState, useRef, useCallback } from "react";
import type { PlacedElement, FurniturePosition } from "@/lib/progress";
import type { DecorativeElement, Festivity } from "@/lib/festivities";
import { FURNITURE_ITEMS, getSeasonTreePath } from "@/lib/progress";
import { StickerIcon } from "./StickerIcon";
import { Trash2, Plus, Minus } from "lucide-react";

interface WindowDisplayProps {
  festivity: Festivity;
  placedElements: PlacedElement[];
  allElements: DecorativeElement[];
  onRemoveElement: (index: number) => void;
  onUpdateElement: (index: number, updates: Partial<PlacedElement>) => void;
  bgColor: string;
  furniturePositions: FurniturePosition[];
  onUpdateFurniture: (index: number, updates: Partial<FurniturePosition>) => void;
  lightsOn: boolean[];
  onToggleLight: (index: number) => void;
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
  rotation: number;
  side: "top" | "bottom" | "left" | "right";
}

const LIGHT_POSITIONS: LightPosition[] = [
  { x: 20, y: 0, rotation: 180, side: "top" },
  { x: 50, y: 0, rotation: 180, side: "top" },
  { x: 80, y: 0, rotation: 180, side: "top" },
  { x: 20, y: 100, rotation: 0, side: "bottom" },
  { x: 50, y: 100, rotation: 0, side: "bottom" },
  { x: 80, y: 100, rotation: 0, side: "bottom" },
  { x: 0, y: 33, rotation: 90, side: "left" },
  { x: 0, y: 67, rotation: 90, side: "left" },
  { x: 100, y: 33, rotation: -90, side: "right" },
  { x: 100, y: 67, rotation: -90, side: "right" },
];

function SpotLight({ position, isOn, onClick, color, index }: {
  position: LightPosition;
  isOn: boolean;
  onClick: () => void;
  color: string;
  index: number;
}) {
  const glowColor = color + "60";
  const glowColorStrong = color + "30";

  let translateStyle: React.CSSProperties = {};
  if (position.side === "top") {
    translateStyle = { left: `${position.x}%`, top: "-14px", transform: "translateX(-50%)" };
  } else if (position.side === "bottom") {
    translateStyle = { left: `${position.x}%`, bottom: "-14px", transform: "translateX(-50%)" };
  } else if (position.side === "left") {
    translateStyle = { left: "-14px", top: `${position.y}%`, transform: "translateY(-50%)" };
  } else {
    translateStyle = { right: "-14px", top: `${position.y}%`, transform: "translateY(-50%)" };
  }

  return (
    <>
      <button
        className="absolute z-[70] w-7 h-7 flex items-center justify-center cursor-pointer"
        style={translateStyle}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Toggle ${position.side} light ${index + 1}`}
        data-testid={`button-light-${index}`}
      >
        <div
          className="w-5 h-5 rounded-full border-2 transition-all duration-300"
          style={{
            backgroundColor: isOn ? "#FFF9C4" : "#555",
            borderColor: isOn ? "#FFD54F" : "#333",
            boxShadow: isOn ? `0 0 8px 3px ${glowColor}, 0 0 2px 1px #FFF9C4` : "none",
          }}
        />
      </button>
      {isOn && (
        <div
          className="absolute pointer-events-none z-[5]"
          style={{
            ...getHaloStyle(position),
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, ${glowColorStrong} 30%, transparent 70%)`,
          }}
        />
      )}
    </>
  );
}

function getHaloStyle(position: LightPosition): React.CSSProperties {
  const size = 120;
  if (position.side === "top") {
    return {
      left: `${position.x}%`,
      top: "0%",
      width: `${size}px`,
      height: `${size * 0.8}px`,
      transform: "translateX(-50%)",
    };
  } else if (position.side === "bottom") {
    return {
      left: `${position.x}%`,
      bottom: "0%",
      width: `${size}px`,
      height: `${size * 0.8}px`,
      transform: "translateX(-50%)",
    };
  } else if (position.side === "left") {
    return {
      left: "0%",
      top: `${position.y}%`,
      width: `${size * 0.8}px`,
      height: `${size}px`,
      transform: "translateY(-50%)",
    };
  } else {
    return {
      right: "0%",
      top: `${position.y}%`,
      width: `${size * 0.8}px`,
      height: `${size}px`,
      transform: "translateY(-50%)",
    };
  }
}

function StorefrontFrame({ festivity, dark, treeImagePath }: {
  festivity: Festivity;
  dark: boolean;
  treeImagePath: string;
}) {
  const wallColor = dark ? "#3a3a4e" : "#c4a882";
  const wallColorDark = dark ? "#2a2a3e" : "#a08868";
  const brickLineColor = dark ? "#4a4a5e" : "#b09878";
  const awningColor = festivity.color;
  const sidewalkColor = dark ? "#4a4a5a" : "#d4c8b8";
  const sidewalkLine = dark ? "#5a5a6a" : "#c0b4a4";
  const signBg = dark ? "#2a2a3e" : "#f5efe6";
  const signBorder = dark ? "#555" : "#8B7355";
  const signText = dark ? "#e0d0c0" : "#5a4a3a";

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <div className="absolute -left-10 top-0 bottom-8 w-10" style={{ background: wallColor }}>
        {[...Array(12)].map((_, i) => (
          <div key={`bl-${i}`} className="w-full h-[1px] opacity-30" style={{ marginTop: i === 0 ? 8 : 20, background: brickLineColor }} />
        ))}
      </div>
      <div className="absolute -right-10 top-0 bottom-8 w-10" style={{ background: wallColor }}>
        {[...Array(12)].map((_, i) => (
          <div key={`br-${i}`} className="w-full h-[1px] opacity-30" style={{ marginTop: i === 0 ? 8 : 20, background: brickLineColor }} />
        ))}
      </div>

      <div className="absolute -left-10 -right-10 -top-12 h-12 flex items-end z-[2]">
        <div className="w-full relative">
          <div className="absolute inset-0 rounded-t-lg" style={{
            background: `linear-gradient(135deg, ${awningColor}dd, ${awningColor}aa)`,
            borderTop: `2px solid ${awningColor}`,
          }} />
          <svg className="w-full h-12" viewBox="0 0 100 12" preserveAspectRatio="none">
            <path d="M0,0 Q5,10 10,0 Q15,10 20,0 Q25,10 30,0 Q35,10 40,0 Q45,10 50,0 Q55,10 60,0 Q65,10 70,0 Q75,10 80,0 Q85,10 90,0 Q95,10 100,0 L100,12 L0,12 Z"
              fill={awningColor} opacity="0.85" />
          </svg>
        </div>
      </div>

      <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-[3] px-6 py-1.5 rounded-md"
        style={{ background: signBg, border: `2px solid ${signBorder}` }}>
        <span className="text-sm font-black tracking-[0.15em] uppercase" style={{
          fontFamily: "'Architects Daughter', cursive",
          color: signText,
        }}>
          BOOKSHOP
        </span>
      </div>

      <div className="absolute -left-10 -right-10 -bottom-8 h-8 z-[2]" style={{ background: sidewalkColor }}>
        <div className="w-full h-[1px] absolute top-1" style={{ background: sidewalkLine }} />
        <div className="w-full h-[1px] absolute top-4" style={{ background: sidewalkLine }} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-3 z-[2]" style={{
        background: wallColorDark,
        borderTop: `1px solid ${brickLineColor}`,
      }} />

      <div className="absolute -right-[52px] bottom-0 z-[2]" style={{ transform: "translateY(8px)" }}>
        <img
          src={treeImagePath}
          alt="Seasonal tree"
          className="w-16 h-24 object-contain"
          style={{ filter: dark ? "brightness(0.8)" : "none" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export function WindowDisplay({
  festivity, placedElements, allElements, onRemoveElement, onUpdateElement,
  bgColor, furniturePositions, onUpdateFurniture, lightsOn, onToggleLight,
}: WindowDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draggingFurnitureIndex, setDraggingFurnitureIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const dark = isDark(bgColor);
  const titleColor = dark ? "#ffffffdd" : "#333";
  const treeImagePath = getSeasonTreePath(festivity.id);

  const handleScale = (index: number, delta: number) => {
    const currentScale = placedElements[index].scale || 1;
    const newScale = Math.max(0.5, Math.min(2.5, currentScale + delta));
    onUpdateElement(index, { scale: newScale });
  };

  const handleFurnitureScale = (index: number, delta: number) => {
    const currentScale = furniturePositions[index].scale || 1;
    const newScale = Math.max(0.5, Math.min(2.5, currentScale + delta));
    onUpdateFurniture(index, { scale: newScale });
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
    setSelectedFurnitureIndex(null);
    setDraggingIndex(index);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleFurniturePointerDown = (e: React.PointerEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedFurnitureIndex(index);
    setSelectedIndex(null);
    setDraggingFurnitureIndex(index);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex !== null) {
      e.preventDefault();
      const pos = getPercentPosition(e.clientX, e.clientY);
      onUpdateElement(draggingIndex, pos);
    } else if (draggingFurnitureIndex !== null) {
      e.preventDefault();
      const pos = getPercentPosition(e.clientX, e.clientY);
      onUpdateFurniture(draggingFurnitureIndex, pos);
    }
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
    setDraggingFurnitureIndex(null);
  };

  const handleCanvasClick = () => {
    setSelectedIndex(null);
    setSelectedFurnitureIndex(null);
  };

  return (
    <div className="relative" style={{ padding: "24px 16px 12px 16px" }}>
      <StorefrontFrame festivity={festivity} dark={dark} treeImagePath={treeImagePath} />

      <div
        ref={canvasRef}
        className="relative w-full overflow-visible rounded-lg"
        style={{
          aspectRatio: "600/400",
          border: `3px solid ${dark ? "#555" : "#8B7355"}`,
          boxShadow: dark ? "inset 0 0 30px rgba(0,0,0,0.3)" : "inset 0 0 30px rgba(0,0,0,0.05)",
        }}
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        data-testid="window-display-canvas"
      >
        <svg viewBox="0 0 600 400" className="w-full h-full pointer-events-none absolute inset-0">
          <defs>
            <pattern id="doodle-bg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="0.5" fill={dark ? "#ffffff" : "#333"} opacity="0.06" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="600" height="400" rx="6" fill={bgColor} />
          <rect x="0" y="0" width="600" height="400" rx="6" fill="url(#doodle-bg)" />
          <text x="300" y="45" textAnchor="middle" fontFamily="'Architects Daughter', cursive" fontSize="22" fill={titleColor} fontWeight="bold" data-testid="text-festivity-name">
            {festivity.name}
          </text>
        </svg>

        {furniturePositions.map((fp, index) => {
          const item = FURNITURE_ITEMS.find(f => f.id === fp.furnitureId);
          if (!item) return null;
          const isSelected = selectedFurnitureIndex === index;

          return (
            <div
              key={`furniture-${index}`}
              className={`absolute touch-none select-none ${
                draggingFurnitureIndex === index ? "cursor-grabbing z-20" : "cursor-grab z-[8]"
              } ${isSelected ? "z-20" : ""}`}
              style={{
                left: `${fp.x}%`,
                top: `${fp.y}%`,
                transform: `translate(-50%, -50%) scale(${fp.scale || 1})`,
              }}
              onPointerDown={(e) => handleFurniturePointerDown(e, index)}
              onClick={(e) => e.stopPropagation()}
              data-testid={`furniture-${item.id}`}
            >
              <div className={`${isSelected ? "ring-2 ring-amber-400 ring-offset-2 rounded-lg" : ""} p-0.5`}>
                <img
                  src={item.imagePath}
                  alt={item.name}
                  draggable={false}
                  className="pointer-events-none"
                  style={{ width: 72, height: 72, objectFit: "contain" }}
                />
              </div>

              {isSelected && (
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-[60]"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-1 bg-white shadow-xl border rounded-full p-1">
                    <button
                      onClick={() => handleFurnitureScale(index, 0.2)}
                      className="p-1 rounded-full text-amber-600"
                      aria-label={`Enlarge ${item.name}`}
                      data-testid={`button-furniture-enlarge-${index}`}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleFurnitureScale(index, -0.2)}
                      className="p-1 rounded-full text-amber-600"
                      aria-label={`Shrink ${item.name}`}
                      data-testid={`button-furniture-shrink-${index}`}
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

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

        {LIGHT_POSITIONS.map((pos, i) => (
          <SpotLight
            key={`light-${i}`}
            position={pos}
            isOn={lightsOn[i] || false}
            onClick={() => onToggleLight(i)}
            color={festivity.color}
            index={i}
          />
        ))}

        {placedElements.length === 0 && furniturePositions.length > 0 && (
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
