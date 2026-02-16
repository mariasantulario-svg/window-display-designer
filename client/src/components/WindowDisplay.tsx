import { useState, useRef, useCallback } from "react";
import type { PlacedElement, FixedItemPosition } from "@/lib/progress";
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
  fixedItems: FixedItemPosition[];
  onUpdateFixedItem: (id: string, updates: Partial<FixedItemPosition>) => void;
  shopName: string;
  onShopNameChange: (name: string) => void;
  unlockedLightsCount: number;
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

function SpotLightFixture({ position, isOn, onClick, color, index, locked }: {
  position: LightPosition;
  isOn: boolean;
  onClick: () => void;
  color: string;
  index: number;
  locked?: boolean;
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
        className={`absolute z-[15] w-9 h-9 flex items-center justify-center ${locked ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}
        style={posStyle}
        onClick={(e) => { e.stopPropagation(); if (!locked) onClick(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={locked ? `Light ${index + 1} (locked)` : `Toggle ${position.side} light ${index + 1}`}
        data-testid={`button-light-${index}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `rotate(${fixtureRotation})` }}>
          <rect x="10" y="0" width="4" height="6" rx="1" fill="#666" stroke="#444" strokeWidth="0.5" />
          <path d="M5,6 L19,6 L16,18 L8,18 Z" fill={isOn && !locked ? "#333" : "#555"} stroke="#444" strokeWidth="0.5" />
          <ellipse cx="12" cy="18" rx="5" ry="2" fill={isOn && !locked ? color : "#777"} opacity={isOn && !locked ? 1 : 0.4} />
          {isOn && !locked && (
            <ellipse cx="12" cy="18" rx="4" ry="1.5" fill="#fff" opacity="0.6" />
          )}
        </svg>
        {isOn && !locked && (
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
      {isOn && !locked && (
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

function KawaiiBookRow() {
  return (
    <svg width="70" height="55" viewBox="0 0 70 55">
      <rect x="2" y="8" width="10" height="42" rx="2" fill="#E57373" stroke="#C62828" strokeWidth="1" />
      <rect x="13" y="5" width="12" height="45" rx="2" fill="#64B5F6" stroke="#1565C0" strokeWidth="1" />
      <text x="19" y="35" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="bold" transform="rotate(-90,19,30)">ENGLISH</text>
      <rect x="26" y="10" width="9" height="40" rx="2" fill="#81C784" stroke="#2E7D32" strokeWidth="1" />
      <rect x="36" y="6" width="13" height="44" rx="2" fill="#FFB74D" stroke="#E65100" strokeWidth="1" />
      <text x="42" y="35" textAnchor="middle" fontSize="5.5" fill="#fff" fontWeight="bold" transform="rotate(-90,42,30)">DICT</text>
      <rect x="50" y="9" width="8" height="41" rx="2" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="1" />
      <rect x="59" y="7" width="9" height="43" rx="2" fill="#4FC3F7" stroke="#0277BD" strokeWidth="1" />
      <circle cx="35" cy="3" r="3" fill="#FFE082" stroke="#F9A825" strokeWidth="0.5" />
      <circle cx="33.5" cy="2.5" r="0.6" fill="#5D4037" />
      <circle cx="36.5" cy="2.5" r="0.6" fill="#5D4037" />
      <path d="M34,4 Q35,5 36,4" fill="none" stroke="#5D4037" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function KawaiiDictionary() {
  return (
    <svg width="50" height="60" viewBox="0 0 50 60">
      <rect x="4" y="4" width="42" height="52" rx="4" fill="#5C6BC0" stroke="#283593" strokeWidth="1.5" />
      <rect x="7" y="7" width="36" height="46" rx="2" fill="#7986CB" stroke="#3949AB" strokeWidth="0.8" />
      <rect x="10" y="12" width="30" height="14" rx="2" fill="#E8EAF6" />
      <text x="25" y="22" textAnchor="middle" fontSize="7" fill="#283593" fontWeight="bold">ABC</text>
      <text x="25" y="40" textAnchor="middle" fontSize="5" fill="#E8EAF6" fontWeight="bold">Dictionary</text>
      <rect x="4" y="50" width="42" height="6" rx="2" fill="#3949AB" />
      <line x1="6" y1="53" x2="44" y2="53" stroke="#5C6BC0" strokeWidth="0.5" />
      <circle cx="25" cy="8" r="3.5" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.5" />
      <circle cx="23.5" cy="7.5" r="0.7" fill="#5D4037" />
      <circle cx="26.5" cy="7.5" r="0.7" fill="#5D4037" />
      <path d="M24,9.5 Q25,10.5 26,9.5" fill="none" stroke="#5D4037" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function KawaiiNotebook() {
  return (
    <svg width="45" height="55" viewBox="0 0 45 55">
      <rect x="8" y="2" width="34" height="50" rx="3" fill="#F48FB1" stroke="#C2185B" strokeWidth="1.2" />
      <rect x="11" y="5" width="28" height="44" rx="2" fill="#FCE4EC" />
      {[0,1,2,3,4,5,6,7].map(i => (
        <line key={`nl-${i}`} x1="14" y1={10 + i * 5} x2="36" y2={10 + i * 5} stroke="#F8BBD0" strokeWidth="0.8" />
      ))}
      <circle cx="6" cy="10" r="2.5" fill="#bbb" stroke="#999" strokeWidth="0.5" />
      <circle cx="6" cy="18" r="2.5" fill="#bbb" stroke="#999" strokeWidth="0.5" />
      <circle cx="6" cy="26" r="2.5" fill="#bbb" stroke="#999" strokeWidth="0.5" />
      <circle cx="6" cy="34" r="2.5" fill="#bbb" stroke="#999" strokeWidth="0.5" />
      <circle cx="6" cy="42" r="2.5" fill="#bbb" stroke="#999" strokeWidth="0.5" />
      <line x1="16" y1="12" x2="28" y2="12" stroke="#E91E63" strokeWidth="0.8" opacity="0.4" />
      <line x1="16" y1="17" x2="32" y2="17" stroke="#E91E63" strokeWidth="0.6" opacity="0.3" />
      <line x1="16" y1="22" x2="26" y2="22" stroke="#E91E63" strokeWidth="0.6" opacity="0.3" />
      <circle cx="30" cy="4" r="3" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.5" />
      <circle cx="28.8" cy="3.5" r="0.6" fill="#5D4037" />
      <circle cx="31.2" cy="3.5" r="0.6" fill="#5D4037" />
      <path d="M29.5,5.2 Q30,6 30.5,5.2" fill="none" stroke="#5D4037" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function KawaiiGlobe() {
  return (
    <svg width="50" height="60" viewBox="0 0 50 60">
      <rect x="18" y="48" width="14" height="4" rx="1" fill="#8D6E63" stroke="#5D4037" strokeWidth="0.8" />
      <rect x="15" y="51" width="20" height="5" rx="2" fill="#795548" stroke="#5D4037" strokeWidth="0.8" />
      <rect x="23" y="42" width="4" height="8" rx="1" fill="#A1887F" stroke="#5D4037" strokeWidth="0.5" />
      <circle cx="25" cy="23" r="20" fill="#64B5F6" stroke="#1565C0" strokeWidth="1.5" />
      <path d="M10,15 Q20,10 30,18 Q38,22 40,15" fill="#66BB6A" stroke="#2E7D32" strokeWidth="0.8" opacity="0.8" />
      <path d="M8,28 Q18,32 28,26 Q35,30 42,28" fill="#66BB6A" stroke="#2E7D32" strokeWidth="0.8" opacity="0.8" />
      <path d="M12,35 Q22,38 32,32" fill="#66BB6A" stroke="#2E7D32" strokeWidth="0.8" opacity="0.7" />
      <ellipse cx="25" cy="23" rx="20" ry="8" fill="none" stroke="#1565C0" strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="25" cy="23" rx="8" ry="20" fill="none" stroke="#1565C0" strokeWidth="0.6" opacity="0.4" />
      <circle cx="25" cy="6" r="3.5" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.5" />
      <circle cx="23.5" cy="5.5" r="0.7" fill="#5D4037" />
      <circle cx="26.5" cy="5.5" r="0.7" fill="#5D4037" />
      <path d="M24,7.5 Q25,8.5 26,7.5" fill="none" stroke="#5D4037" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function KawaiiPencilCup() {
  return (
    <svg width="40" height="55" viewBox="0 0 40 55">
      <path d="M6,18 L4,50 L36,50 L34,18 Z" fill="#FFCC80" stroke="#E65100" strokeWidth="1.2" rx="2" />
      <rect x="5" y="16" width="30" height="5" rx="2" fill="#FFB74D" stroke="#E65100" strokeWidth="0.8" />
      <path d="M8,20 L9,48 L31,48 L32,20" fill="#FFE0B2" opacity="0.4" />
      <rect x="10" y="4" width="3" height="16" rx="0.5" fill="#FDD835" stroke="#F9A825" strokeWidth="0.5" />
      <polygon points="10,4 13,4 11.5,0" fill="#E8D5B0" stroke="#8D6E63" strokeWidth="0.3" />
      <rect x="10" y="17" width="3" height="3" rx="0.5" fill="#F48FB1" />
      <rect x="17" y="6" width="3" height="14" rx="0.5" fill="#E57373" stroke="#C62828" strokeWidth="0.5" />
      <polygon points="17,6 20,6 18.5,2" fill="#E8D5B0" stroke="#8D6E63" strokeWidth="0.3" />
      <rect x="24" y="3" width="3" height="17" rx="0.5" fill="#64B5F6" stroke="#1565C0" strokeWidth="0.5" />
      <polygon points="24,3 27,3 25.5,-1" fill="#E8D5B0" stroke="#8D6E63" strokeWidth="0.3" />
      <rect x="30" y="8" width="2.5" height="12" rx="0.5" fill="#81C784" stroke="#2E7D32" strokeWidth="0.5" />
      <circle cx="20" cy="40" r="4" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.5" />
      <circle cx="18.5" cy="39.5" r="0.7" fill="#5D4037" />
      <circle cx="21.5" cy="39.5" r="0.7" fill="#5D4037" />
      <path d="M19,41.5 Q20,42.5 21,41.5" fill="none" stroke="#5D4037" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function KawaiiBookStack() {
  return (
    <svg width="55" height="45" viewBox="0 0 55 45">
      <rect x="3" y="30" width="48" height="10" rx="2" fill="#E57373" stroke="#C62828" strokeWidth="1" />
      <line x1="6" y1="35" x2="48" y2="35" stroke="#EF9A9A" strokeWidth="0.5" />
      <rect x="5" y="21" width="44" height="10" rx="2" fill="#64B5F6" stroke="#1565C0" strokeWidth="1" />
      <text x="27" y="29" textAnchor="middle" fontSize="5" fill="#E3F2FD" fontWeight="bold">NOVELS</text>
      <rect x="7" y="12" width="40" height="10" rx="2" fill="#81C784" stroke="#2E7D32" strokeWidth="1" />
      <text x="27" y="20" textAnchor="middle" fontSize="5" fill="#E8F5E9" fontWeight="bold">ATLAS</text>
      <rect x="10" y="4" width="34" height="9" rx="2" fill="#FFB74D" stroke="#E65100" strokeWidth="1" />
      <circle cx="27" cy="2" r="3" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.5" />
      <circle cx="25.5" cy="1.5" r="0.6" fill="#5D4037" />
      <circle cx="28.5" cy="1.5" r="0.6" fill="#5D4037" />
      <path d="M26.2,3.2 Q27,4 27.8,3.2" fill="none" stroke="#5D4037" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

const FIXED_ITEM_COMPONENTS: Record<string, () => JSX.Element> = {
  "books-row": KawaiiBookRow,
  "dictionary": KawaiiDictionary,
  "notebook": KawaiiNotebook,
  "globe": KawaiiGlobe,
  "pencil-cup": KawaiiPencilCup,
  "book-stack": KawaiiBookStack,
};

function SchematicFurniture({ dark }: { dark: boolean }) {
  const woodFill = dark ? "#5a4a3a" : "#c4a37a";
  const woodStroke = dark ? "#7a6a5a" : "#8B7355";
  const shelfFill = dark ? "#4a3a2a" : "#b89868";
  const metalFill = dark ? "#666" : "#999";
  const bracketFill = dark ? "#555" : "#888";

  return (
    <g className="pointer-events-none">
      {/* Floor line */}
      <line x1="0" y1="366" x2="600" y2="366" stroke={woodStroke} strokeWidth="1" opacity="0.3" />

      {/* LEFT FLOOR BOOKCASE - tall, legs touching floor */}
      <rect x="20" y="230" width="130" height="8" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="1" />
      <rect x="22" y="238" width="5" height="128" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="143" y="238" width="5" height="128" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="20" y="275" width="130" height="5" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="20" y="315" width="130" height="5" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="20" y="350" width="130" height="5" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="20" y="362" width="130" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="1" />

      {/* CENTER FLOOR PEDESTAL - low display table, legs on floor */}
      <rect x="230" y="330" width="120" height="6" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="1" />
      <rect x="240" y="336" width="6" height="30" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="334" y="336" width="6" height="30" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="230" y="362" width="120" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />

      {/* RIGHT FLOOR BOOKCASE - tall, legs touching floor */}
      <rect x="440" y="210" width="6" height="156" fill={metalFill} stroke={woodStroke} strokeWidth="0.5" />
      <rect x="410" y="210" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="410" y="260" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="410" y="310" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="410" y="350" width="70" height="5" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <rect x="410" y="362" width="70" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="1" />

      {/* WALL SHELF 1 - top left, with L-brackets */}
      <rect x="40" y="100" width="100" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <path d="M50,104 L50,116 L56,116" fill="none" stroke={bracketFill} strokeWidth="2" />
      <path d="M130,104 L130,116 L124,116" fill="none" stroke={bracketFill} strokeWidth="2" />

      {/* WALL SHELF 2 - top center */}
      <rect x="200" y="80" width="110" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <path d="M215,84 L215,96 L221,96" fill="none" stroke={bracketFill} strokeWidth="2" />
      <path d="M295,84 L295,96 L289,96" fill="none" stroke={bracketFill} strokeWidth="2" />

      {/* WALL SHELF 3 - top right */}
      <rect x="400" y="100" width="90" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <path d="M415,104 L415,116 L421,116" fill="none" stroke={bracketFill} strokeWidth="2" />
      <path d="M475,104 L475,116 L469,116" fill="none" stroke={bracketFill} strokeWidth="2" />

      {/* WALL SHELF 4 - mid left */}
      <rect x="60" y="170" width="90" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <path d="M75,174 L75,186 L81,186" fill="none" stroke={bracketFill} strokeWidth="2" />
      <path d="M135,174 L135,186 L129,186" fill="none" stroke={bracketFill} strokeWidth="2" />

      {/* WALL SHELF 5 - mid right */}
      <rect x="500" y="160" width="70" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <path d="M510,164 L510,176 L516,176" fill="none" stroke={bracketFill} strokeWidth="2" />
      <path d="M560,164 L560,176 L554,176" fill="none" stroke={bracketFill} strokeWidth="2" />

      {/* WALL SHELF 6 - mid center (higher) */}
      <rect x="280" y="150" width="80" height="4" rx="1" fill={woodFill} stroke={woodStroke} strokeWidth="0.8" />
      <path d="M290,154 L290,166 L296,166" fill="none" stroke={bracketFill} strokeWidth="2" />
      <path d="M350,154 L350,166 L344,166" fill="none" stroke={bracketFill} strokeWidth="2" />
    </g>
  );
}

function StorefrontFrame({ dark, treeImagePath, shopName, onShopNameChange }: {
  dark: boolean;
  treeImagePath: string;
  shopName: string;
  onShopNameChange: (name: string) => void;
}) {
  const wallBase = dark ? "#3a4558" : "#b8c8d8";
  const wallLight = dark ? "#445568" : "#c8d4e0";
  const wallDark = dark ? "#303848" : "#a8b8c8";
  const wallPlaster = dark ? "#384050" : "#d0d8e4";
  const mortarColor = dark ? "#2a3040" : "#c0c8d4";
  const awningColor = "#6B4226";
  const awningStripe = "#8B5E3C";
  const sillColor = dark ? "#555" : "#8a8078";
  const sidewalkBase = dark ? "#3a3a40" : "#c4b8a4";
  const sidewalkMid = dark ? "#404048" : "#b8a898";
  const sidewalkDark = dark ? "#333338" : "#a89888";
  const sidewalkMortar = dark ? "#2a2a30" : "#9a8a78";
  const doorFrameColor = dark ? "#3a4050" : "#5a6a7a";
  const doorPanelColor = dark ? "#2a3545" : "#7a8a98";
  const doorHandleColor = dark ? "#888" : "#C0A060";
  const signBg = dark ? "#2a2535" : "#f5efe6";
  const signBorder = dark ? "#555" : "#6B4226";
  const signText = dark ? "#e0d0c0" : "#5a4a3a";

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <div className="absolute -left-14 top-0 w-14 overflow-hidden"
        style={{ background: wallPlaster, height: "100%" }}>
        {[...Array(24)].map((_, row) => (
          <div key={`lr-${row}`} className="flex" style={{ marginTop: row === 0 ? 0 : 1 }}>
            {[...Array(3)].map((_, col) => (
              <div key={`lb-${row}-${col}`} style={{
                width: row % 2 === 0 ? (col === 0 ? 16 : 22) : (col === 0 ? 10 : 22),
                height: 14,
                marginLeft: 1,
                marginRight: 1,
                background: (row + col) % 3 === 0 ? wallLight : (row + col) % 3 === 1 ? wallBase : wallDark,
                borderRadius: 1,
              }} />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute -right-20 top-0 w-20 overflow-hidden"
        style={{ background: wallPlaster, height: "100%" }}>
        {[...Array(24)].map((_, row) => (
          <div key={`rr-${row}`} className="flex" style={{ marginTop: row === 0 ? 0 : 1 }}>
            {[...Array(4)].map((_, col) => (
              <div key={`rb-${row}-${col}`} style={{
                width: row % 2 === 0 ? (col === 0 ? 16 : 20) : (col === 0 ? 10 : 20),
                height: 14,
                marginLeft: 1,
                marginRight: 1,
                background: (row + col) % 3 === 0 ? wallBase : (row + col) % 3 === 1 ? wallLight : wallDark,
                borderRadius: 1,
              }} />
            ))}
          </div>
        ))}

        <div className="absolute bottom-0 right-0 w-14"
          style={{ height: "65%", background: doorFrameColor, borderLeft: `2px solid ${doorHandleColor}44` }}>
          <div className="absolute top-2 left-1 right-1 bottom-[35%]" style={{ background: doorPanelColor, borderRadius: "2px 2px 0 0" }}>
            <div className="absolute inset-1 border opacity-30" style={{ borderColor: doorHandleColor, borderRadius: 2 }} />
            <div className="absolute top-[45%] left-1 w-2.5 h-2.5 rounded-full" style={{ background: doorHandleColor, border: `1px solid ${doorHandleColor}` }} />
          </div>
          <div className="absolute left-1 right-1 bottom-[4%] h-[28%]" style={{ background: doorPanelColor, borderRadius: 2 }}>
            <div className="absolute inset-1 border opacity-30" style={{ borderColor: doorHandleColor, borderRadius: 2 }} />
          </div>
        </div>
      </div>

      <div className="absolute -left-14 -right-20 -top-14 h-14 z-[2]">
        <div className="w-full h-8 flex">
          {[...Array(14)].map((_, i) => (
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

      <div className="absolute -top-[72px] left-1/2 -translate-x-1/2 z-[3] px-4 py-1.5 rounded-sm pointer-events-auto flex items-baseline gap-0 whitespace-nowrap"
        style={{ background: signBg, border: `2px solid ${signBorder}`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <input
          type="text"
          value={shopName}
          onChange={(e) => onShopNameChange(e.target.value)}
          maxLength={15}
          size={Math.max(3, shopName.length || 5)}
          className="bg-transparent border-none outline-none text-sm font-black tracking-[0.08em] text-right min-w-[30px]"
          style={{
            fontFamily: "'Architects Daughter', cursive",
            color: signText,
          }}
          placeholder="_ _ _ _"
          data-testid="input-shop-name"
        />
        <span className="text-sm font-black tracking-[0.08em] uppercase" style={{
          fontFamily: "'Architects Daughter', cursive",
          color: signText,
        }}>
          &apos;s bookshop
        </span>
      </div>

      <div className="absolute -left-1 -right-1 -top-[1px] h-2 z-[3]" style={{ background: sillColor, borderRadius: "2px 2px 0 0" }} />
      <div className="absolute -left-1 -right-1 bottom-0 h-2 z-[3]" style={{ background: sillColor, borderRadius: "0 0 2px 2px" }} />

      <div className="absolute -left-14 -right-20 top-full h-12 z-[2] overflow-hidden">
        <div className="w-full h-1.5" style={{ background: mortarColor }} />
        <div className="w-full h-full flex flex-wrap" style={{ background: sidewalkMortar }}>
          {[...Array(4)].map((_, row) => (
            <div key={`srow-${row}`} className="flex w-full" style={{ height: "25%" }}>
              {[...Array(row % 2 === 0 ? 8 : 7)].map((_, col) => {
                const colors = [sidewalkBase, sidewalkMid, sidewalkDark];
                const cIdx = (row * 3 + col * 2) % 3;
                return (
                  <div key={`st-${row}-${col}`} className="flex-1" style={{
                    background: colors[cIdx],
                    margin: "1px",
                    borderRadius: "1px",
                  }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute z-[4]"
        style={{ left: "-50px", bottom: "0px" }}>
        <img
          src={treeImagePath}
          alt="Seasonal tree"
          className="object-contain"
          style={{
            height: "120px",
            filter: dark ? "brightness(0.85)" : "none",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export function WindowDisplay({
  festivity, placedElements, allElements, onRemoveElement, onUpdateElement,
  bgColor, lightsOn, onToggleLight, lightColor, fixedItems, onUpdateFixedItem,
  shopName, onShopNameChange, unlockedLightsCount,
}: WindowDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedFixedId, setSelectedFixedId] = useState<string | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draggingFixedId, setDraggingFixedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const dark = isDark(bgColor);
  const treeImagePath = getSeasonTreePath(festivity.id);

  const handleScale = (index: number, delta: number) => {
    const currentScale = placedElements[index].scale || 1;
    const newScale = Math.max(0.5, Math.min(2.5, currentScale + delta));
    onUpdateElement(index, { scale: newScale });
  };

  const handleFixedScale = (id: string, delta: number) => {
    const item = fixedItems.find(f => f.id === id);
    if (!item) return;
    const newScale = Math.max(0.5, Math.min(2.5, item.scale + delta));
    onUpdateFixedItem(id, { scale: newScale });
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
    setSelectedFixedId(null);
    setDraggingIndex(index);
    setDraggingFixedId(null);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleFixedPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedFixedId(id);
    setSelectedIndex(null);
    setDraggingFixedId(id);
    setDraggingIndex(null);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex !== null) {
      e.preventDefault();
      const pos = getPercentPosition(e.clientX, e.clientY);
      onUpdateElement(draggingIndex, pos);
    } else if (draggingFixedId !== null) {
      e.preventDefault();
      const pos = getPercentPosition(e.clientX, e.clientY);
      onUpdateFixedItem(draggingFixedId, pos);
    }
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
    setDraggingFixedId(null);
  };

  const handleCanvasClick = () => {
    setSelectedIndex(null);
    setSelectedFixedId(null);
  };

  return (
    <div className="relative" style={{ padding: "20px 24px 16px 18px", marginLeft: "-4px" }}>
      <StorefrontFrame dark={dark} treeImagePath={treeImagePath} shopName={shopName} onShopNameChange={onShopNameChange} />

      <div
        ref={canvasRef}
        className="relative w-full overflow-visible"
        style={{
          aspectRatio: "600/370",
          border: `2px solid ${dark ? "#555" : "#777"}`,
          boxShadow: dark ? "inset 0 0 30px rgba(0,0,0,0.3)" : "inset 0 0 20px rgba(0,0,0,0.04)",
          borderRadius: 2,
        }}
        onClick={handleCanvasClick}
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
          <SchematicFurniture dark={dark} />
        </svg>

        {fixedItems.map((item) => {
          const Component = FIXED_ITEM_COMPONENTS[item.id];
          if (!Component) return null;
          const isSelected = selectedFixedId === item.id;

          return (
            <div
              key={`fixed-${item.id}`}
              className={`absolute touch-none select-none ${
                draggingFixedId === item.id ? "cursor-grabbing z-40" : "cursor-grab z-[8]"
              } ${isSelected ? "z-40" : ""}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) scale(${item.scale || 1})`,
              }}
              onPointerDown={(e) => handleFixedPointerDown(e, item.id)}
              onClick={(e) => e.stopPropagation()}
              data-testid={`fixed-item-${item.id}`}
            >
              <div className={`${isSelected ? "ring-2 ring-amber-400 ring-offset-2 rounded-lg" : ""} p-0.5`}>
                <Component />
              </div>

              {isSelected && (
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-[60]"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-1 bg-white shadow-xl border rounded-full p-1">
                    <button
                      onClick={() => handleFixedScale(item.id, 0.3)}
                      className="p-1 rounded-full text-amber-600"
                      aria-label="Enlarge"
                      data-testid={`button-enlarge-fixed-${item.id}`}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleFixedScale(item.id, -0.3)}
                      className="p-1 rounded-full text-amber-600"
                      aria-label="Shrink"
                      data-testid={`button-shrink-fixed-${item.id}`}
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
            locked={i >= unlockedLightsCount}
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
