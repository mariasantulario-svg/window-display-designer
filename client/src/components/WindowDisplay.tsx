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

function BookshopItems({ dark }: { dark: boolean }) {
  const bookSpine1 = dark ? "#6a4a5a" : "#8B4513";
  const bookSpine2 = dark ? "#4a5a6a" : "#2E5090";
  const bookSpine3 = dark ? "#5a6a4a" : "#2E7D32";
  const bookSpine4 = dark ? "#6a5a4a" : "#B8860B";
  const bookSpine5 = dark ? "#5a4a6a" : "#7B1FA2";
  const bookSpine6 = dark ? "#6a4a4a" : "#C62828";
  const paperColor = dark ? "#9a9080" : "#F5F0E0";
  const coverDark = dark ? "#3a3535" : "#4a3020";
  const notebookSpiral = dark ? "#888" : "#aaa";
  const pencilYellow = dark ? "#9a8a30" : "#FDD835";
  const pencilTip = dark ? "#7a6a5a" : "#E8D5B0";
  const eraserPink = dark ? "#8a5a6a" : "#F48FB1";
  const globeBlue = dark ? "#4a6a7a" : "#64B5F6";
  const globeGreen = dark ? "#4a6a4a" : "#66BB6A";

  return (
    <g className="pointer-events-none">
      <rect x="38" y="250" width="8" height="24" rx="0.5" fill={bookSpine1} stroke={coverDark} strokeWidth="0.3" />
      <rect x="47" y="248" width="10" height="26" rx="0.5" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />
      <rect x="58" y="251" width="7" height="23" rx="0.5" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="66" y="249" width="12" height="25" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <text x="72" y="268" textAnchor="middle" fontSize="3.5" fill={paperColor} fontWeight="bold" transform="rotate(-90,72,264)">DICT</text>
      <rect x="79" y="252" width="6" height="22" rx="0.5" fill={bookSpine5} stroke={coverDark} strokeWidth="0.3" />
      <rect x="86" y="249" width="9" height="25" rx="0.5" fill={bookSpine6} stroke={coverDark} strokeWidth="0.3" />
      <rect x="96" y="253" width="7" height="21" rx="0.5" fill={bookSpine1} stroke={coverDark} strokeWidth="0.3" opacity="0.8" />
      <rect x="104" y="250" width="11" height="24" rx="0.5" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" opacity="0.85" />
      <text x="109" y="268" textAnchor="middle" fontSize="3" fill={paperColor} fontWeight="bold" transform="rotate(-90,109,264)">ENGLISH</text>
      <rect x="116" y="252" width="6" height="22" rx="0.5" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="123" y="249" width="9" height="25" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <rect x="133" y="251" width="7" height="23" rx="0.5" fill={bookSpine5} stroke={coverDark} strokeWidth="0.3" />

      <rect x="38" y="286" width="40" height="6" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <line x1="40" y1="287" x2="76" y2="287" stroke={paperColor} strokeWidth="0.3" opacity="0.5" />
      <rect x="80" y="285" width="32" height="7" rx="0.5" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />
      <text x="96" y="290.5" textAnchor="middle" fontSize="3.5" fill={paperColor} fontWeight="bold">ATLAS</text>
      <rect x="114" y="286" width="28" height="6" rx="0.5" fill={bookSpine6} stroke={coverDark} strokeWidth="0.3" />

      <rect x="38" y="321" width="30" height="5" rx="0.3" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="70" y="320" width="25" height="6" rx="0.3" fill={bookSpine1} stroke={coverDark} strokeWidth="0.3" />
      <rect x="97" y="321" width="20" height="5" rx="0.3" fill={bookSpine5} stroke={coverDark} strokeWidth="0.3" />
      <rect x="119" y="320" width="22" height="6" rx="0.3" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />

      <rect x="250" y="306" width="10" height="14" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <rect x="261" y="308" width="8" height="12" rx="0.5" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />
      <rect x="270" y="307" width="12" height="13" rx="0.5" fill={bookSpine6} stroke={coverDark} strokeWidth="0.3" />
      <text x="276" y="316" textAnchor="middle" fontSize="3" fill={paperColor} fontWeight="bold">NOVEL</text>
      <rect x="283" y="309" width="9" height="11" rx="0.5" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="293" y="307" width="11" height="13" rx="0.5" fill={bookSpine5} stroke={coverDark} strokeWidth="0.3" />
      <rect x="305" y="308" width="7" height="12" rx="0.5" fill={bookSpine1} stroke={coverDark} strokeWidth="0.3" />
      <rect x="313" y="306" width="13" height="14" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <text x="319" y="316" textAnchor="middle" fontSize="3" fill={paperColor} fontWeight="bold">VOCAB</text>

      <rect x="260" y="345" width="28" height="6" rx="0.3" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="290" y="344" width="22" height="7" rx="0.3" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />

      <rect x="405" y="196" width="8" height="18" rx="0.3" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />
      <rect x="414" y="197" width="6" height="17" rx="0.3" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <rect x="421" y="195" width="10" height="19" rx="0.3" fill={bookSpine6} stroke={coverDark} strokeWidth="0.3" />
      <rect x="432" y="197" width="7" height="17" rx="0.3" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="440" y="196" width="9" height="18" rx="0.3" fill={bookSpine5} stroke={coverDark} strokeWidth="0.3" />
      <rect x="450" y="198" width="6" height="16" rx="0.3" fill={bookSpine1} stroke={coverDark} strokeWidth="0.3" />
      <rect x="457" y="196" width="8" height="18" rx="0.3" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" opacity="0.8" />

      <rect x="408" y="256" width="24" height="5" rx="0.3" fill={bookSpine1} stroke={coverDark} strokeWidth="0.3" />
      <rect x="434" y="255" width="18" height="6" rx="0.3" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <rect x="454" y="256" width="12" height="5" rx="0.3" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />

      <rect x="410" y="316" width="22" height="5" rx="0.3" fill={bookSpine5} stroke={coverDark} strokeWidth="0.3" />
      <rect x="434" y="315" width="18" height="6" rx="0.3" fill={bookSpine6} stroke={coverDark} strokeWidth="0.3" />
      <rect x="454" y="316" width="10" height="5" rx="0.3" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />

      <rect x="200" y="168" width="16" height="10" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
      <line x1="202" y1="170" x2="214" y2="170" stroke={paperColor} strokeWidth="0.3" />
      <line x1="202" y1="172" x2="212" y2="172" stroke={paperColor} strokeWidth="0.3" />
      <line x1="202" y1="174" x2="210" y2="174" stroke={paperColor} strokeWidth="0.3" />

      <rect x="220" y="166" width="14" height="12" rx="0.5" fill={bookSpine3} stroke={coverDark} strokeWidth="0.3" />
      <rect x="236" y="168" width="12" height="10" rx="0.5" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />
      <rect x="250" y="167" width="15" height="11" rx="0.5" fill={bookSpine6} stroke={coverDark} strokeWidth="0.3" />

      <g transform="translate(515, 285)">
        <rect x="0" y="0" width="18" height="24" rx="0.5" fill={bookSpine4} stroke={coverDark} strokeWidth="0.3" />
        <rect x="1.5" y="1.5" width="15" height="21" rx="0.3" fill={paperColor} stroke={coverDark} strokeWidth="0.2" />
        {[0,1,2,3,4,5,6].map(i => (
          <line key={`nl-${i}`} x1="4" y1={4 + i * 2.5} x2="15" y2={4 + i * 2.5} stroke={dark ? "#666" : "#ccc"} strokeWidth="0.3" />
        ))}
        <circle cx="-1" cy="4" r="1" fill={notebookSpiral} />
        <circle cx="-1" cy="8" r="1" fill={notebookSpiral} />
        <circle cx="-1" cy="12" r="1" fill={notebookSpiral} />
        <circle cx="-1" cy="16" r="1" fill={notebookSpiral} />
        <circle cx="-1" cy="20" r="1" fill={notebookSpiral} />
      </g>

      <g transform="translate(536, 288)">
        <rect x="0" y="0" width="16" height="20" rx="0.5" fill={bookSpine2} stroke={coverDark} strokeWidth="0.3" />
        <rect x="1" y="1" width="14" height="18" rx="0.3" fill={paperColor} stroke={coverDark} strokeWidth="0.2" />
        {[0,1,2,3,4,5].map(i => (
          <line key={`nl2-${i}`} x1="3" y1={3 + i * 2.5} x2="14" y2={3 + i * 2.5} stroke={dark ? "#666" : "#ccc"} strokeWidth="0.3" />
        ))}
      </g>

      <g transform="translate(520, 314)">
        <rect x="0" y="0" width="30" height="3" rx="0.3" fill={pencilYellow} stroke={coverDark} strokeWidth="0.2" />
        <polygon points="-3,1.5 0,0 0,3" fill={pencilTip} stroke={coverDark} strokeWidth="0.2" />
        <rect x="28" y="0" width="5" height="3" rx="0.3" fill={eraserPink} stroke={coverDark} strokeWidth="0.2" />
      </g>

      <g transform="translate(530, 320)">
        <rect x="0" y="0" width="26" height="3" rx="0.3" fill={bookSpine6} stroke={coverDark} strokeWidth="0.2" />
        <polygon points="-3,1.5 0,0 0,3" fill={pencilTip} stroke={coverDark} strokeWidth="0.2" />
        <rect x="24" y="0" width="4" height="3" rx="0.3" fill={eraserPink} stroke={coverDark} strokeWidth="0.2" />
      </g>

      <g transform="translate(290, 335)">
        <circle cx="10" cy="10" r="10" fill={globeBlue} stroke={coverDark} strokeWidth="0.5" opacity="0.7" />
        <ellipse cx="10" cy="10" rx="10" ry="4" fill="none" stroke={globeGreen} strokeWidth="0.8" opacity="0.6" />
        <ellipse cx="10" cy="10" rx="4" ry="10" fill="none" stroke={globeGreen} strokeWidth="0.8" opacity="0.6" />
        <path d="M2,6 Q10,4 18,6" fill="none" stroke={globeGreen} strokeWidth="1.5" opacity="0.5" />
        <path d="M2,14 Q10,16 18,14" fill="none" stroke={globeGreen} strokeWidth="1.5" opacity="0.5" />
        <line x1="10" y1="0" x2="10" y2="20" stroke={dark ? "#666" : "#999"} strokeWidth="0.3" />
        <rect x="8" y="20" width="4" height="3" rx="0.5" fill={dark ? "#666" : "#999"} stroke={coverDark} strokeWidth="0.3" />
        <rect x="5" y="23" width="10" height="2" rx="0.5" fill={dark ? "#555" : "#888"} stroke={coverDark} strokeWidth="0.3" />
      </g>
    </g>
  );
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
      <rect x="240" y="340" width="100" height="5" rx="1" fill={shelfFill} stroke={woodStroke} strokeWidth="0.8" />
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
  const wallBase = dark ? "#4a4050" : "#c8b898";
  const wallLight = dark ? "#5a5060" : "#d4c4a8";
  const wallDark = dark ? "#3a3040" : "#b8a888";
  const wallPlaster = dark ? "#454050" : "#d8cbb0";
  const mortarColor = dark ? "#353040" : "#baa880";
  const awningColor = "#6B4226";
  const awningStripe = "#8B5E3C";
  const sillColor = dark ? "#555" : "#8a8078";
  const sidewalkBase = dark ? "#3a3a40" : "#c4b8a4";
  const sidewalkMid = dark ? "#404048" : "#b8a898";
  const sidewalkDark = dark ? "#333338" : "#a89888";
  const sidewalkMortar = dark ? "#2a2a30" : "#9a8a78";
  const doorFrameColor = dark ? "#4a4050" : "#6B4226";
  const doorPanelColor = dark ? "#3a3545" : "#8B6848";
  const doorHandleColor = dark ? "#888" : "#C0A060";
  const signBg = dark ? "#2a2535" : "#f5efe6";
  const signBorder = dark ? "#555" : "#6B4226";
  const signText = dark ? "#e0d0c0" : "#5a4a3a";
  const planterTerra = dark ? "#6a5040" : "#B87333";
  const planterDark = dark ? "#5a4030" : "#9a6030";
  const planterRim = dark ? "#7a5a48" : "#c88040";

  const WALL_HEIGHT = "100%";

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <div className="absolute -left-14 top-0 w-14 overflow-hidden"
        style={{ background: wallPlaster, height: WALL_HEIGHT }}>
        {[...Array(20)].map((_, row) => (
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
        style={{ background: wallPlaster, height: WALL_HEIGHT }}>
        {[...Array(20)].map((_, row) => (
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
        style={{ right: "-17px", bottom: "0px", transform: "translateY(0)" }}>
        <svg width="40" height="30" viewBox="0 0 40 30">
          <rect x="5" y="24" width="30" height="6" rx="1" fill={planterDark} stroke={planterTerra} strokeWidth="0.5" />
          <path d="M3,4 L37,4 L34,24 L6,24 Z" fill={planterTerra} stroke={planterDark} strokeWidth="0.8" />
          <rect x="3" y="2" width="34" height="4" rx="1" fill={planterRim} stroke={planterDark} strokeWidth="0.5" />
          <rect x="10" y="0" width="20" height="3" rx="0.5" fill={dark ? "#3a5a3a" : "#5a8a5a"} opacity="0.4" />
        </svg>
        <img
          src={treeImagePath}
          alt="Seasonal tree"
          className="absolute object-contain"
          style={{
            width: "52px",
            height: "80px",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
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
    <div className="relative" style={{ padding: "20px 24px 16px 18px", marginLeft: "-4px" }}>
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
          <BookshopItems dark={dark} />
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
