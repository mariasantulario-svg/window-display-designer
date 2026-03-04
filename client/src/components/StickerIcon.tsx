import { useState } from "react";

interface StickerIconProps {
  imagePath: string;
  name: string;
  size?: number;
}

function getEmojiForName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("heart") || n.includes("love")) return "❤️";
  if (n.includes("rose") || n.includes("tulip") || n.includes("flower") || n.includes("petal")) return "🌸";
  if (n.includes("balloon")) return "🎈";
  if (n.includes("egg")) return "🥚";
  if (n.includes("bunny")) return "🐰";
  if (n.includes("ribbon")) return "🎀";
  if (n.includes("candle")) return "🕯️";
  if (n.includes("gift") || n.includes("present") || n.includes("box") || n.includes("stack")) return "🎁";
  if (n.includes("snow") || n.includes("snowflake") || n.includes("globe")) return "❄️";
  if (n.includes("star")) return "⭐";
  if (n.includes("lantern")) return "🏮";
  if (n.includes("umbrella")) return "⛱️";
  if (n.includes("train")) return "🚂";
  if (n.includes("cart")) return "🛒";
  if (n.includes("arrow")) return "➡️";
  if (n.includes("clock") || n.includes("alarm")) return "⏰";
  if (n.includes("sale") || n.includes("discount") || n.includes("price") || n.includes("neon")) return "💸";
  if (n.includes("pumpkin")) return "🎃";
  if (n.includes("ghost")) return "👻";
  if (n.includes("bat")) return "🦇";
  if (n.includes("candy") || n.includes("sweet")) return "🍬";
  if (n.includes("bag") || n.includes("basket")) return "🛍️";
  if (n.includes("boots")) return "👢";
  if (n.includes("hat")) return "👒";
  if (n.includes("book") || n.includes("novel") || n.includes("guide")) return "📚";
  return "✨";
}

function getBgColorForName(name: string): string {
  const palette = [
    "#FFE4E6", // pink
    "#FEF3C7", // amber
    "#E0F2FE", // light blue
    "#DCFCE7", // light green
    "#F3E8FF", // purple
    "#FFEFD5", // peach
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i) * 17) % 9973;
  }
  return palette[hash % palette.length];
}

export function StickerIcon({ imagePath, name, size = 44 }: StickerIconProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  const useFallback = loadFailed || !imagePath;

  if (useFallback) {
    const emoji = getEmojiForName(name);
    const bg = getBgColorForName(name);
    return (
      <div
        aria-label={name}
        style={{
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
          fontSize: size * 0.55,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <span role="img" aria-hidden="true">
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imagePath}
      alt={name}
      onError={() => setLoadFailed(true)}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        imageRendering: "auto",
        pointerEvents: "none",
      }}
    />
  );
}
