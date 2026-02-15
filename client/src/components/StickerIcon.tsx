import {
  Heart, BookOpen, ScrollText, Target, Flower2, Mail,
  ShoppingBasket, Rabbit, Egg, Flower, Sprout, Notebook,
  Tag, Sun, Ribbon, Gem, Droplets, Frame, Map, Glasses,
  Image, IceCreamCone, Footprints, CircleDot, PenTool,
  Backpack, Globe, Bus, Calculator, Presentation, Ghost,
  Crown, Bug, Candy, Smartphone, Percent, Package,
  ShoppingBag, BadgePercent, Clock, Star, Gift, TreePine,
  PartyPopper, Snowflake, Sparkles, MailPlus, Palette,
  type LucideIcon,
} from "lucide-react";

const iconRegistry: Record<string, LucideIcon> = {
  "heart": Heart,
  "book-open": BookOpen,
  "scroll-text": ScrollText,
  "target": Target,
  "flower-2": Flower2,
  "mail": Mail,
  "mail-heart": MailPlus,
  "shopping-basket": ShoppingBasket,
  "rabbit": Rabbit,
  "egg": Egg,
  "flower": Flower,
  "sprout": Sprout,
  "notebook": Notebook,
  "tag": Tag,
  "sun": Sun,
  "ribbon": Ribbon,
  "gem": Gem,
  "droplets": Droplets,
  "frame": Frame,
  "map": Map,
  "glasses": Glasses,
  "image": Image,
  "ice-cream-cone": IceCreamCone,
  "footprints": Footprints,
  "circle-dot": CircleDot,
  "pen-tool": PenTool,
  "backpack": Backpack,
  "globe": Globe,
  "bus": Bus,
  "calculator": Calculator,
  "presentation": Presentation,
  "ghost": Ghost,
  "crown": Crown,
  "bug": Bug,
  "butterfly": Bug,
  "candy": Candy,
  "smartphone": Smartphone,
  "percent": Percent,
  "package": Package,
  "shopping-bag": ShoppingBag,
  "badge-percent": BadgePercent,
  "clock": Clock,
  "star": Star,
  "gift": Gift,
  "tree-pine": TreePine,
  "party-popper": PartyPopper,
  "sock": PartyPopper,
  "snowflake": Snowflake,
  "sparkles": Sparkles,
  "citrus": Sun,
  "palette": Palette,
};

const festivityIconMap: Record<string, string> = {
  "valentines": "heart",
  "easter": "egg",
  "spring-sale": "flower",
  "mothers-day": "ribbon",
  "summer-sale": "sun",
  "back-to-school": "backpack",
  "halloween": "ghost",
  "black-friday": "tag",
  "christmas": "gift",
};

export function getFestivityIcon(festivityId: string): string {
  return festivityIconMap[festivityId] || "sparkles";
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

interface StickerIconProps {
  iconName: string;
  color: string;
  size?: number;
}

export function StickerIcon({ iconName, color, size = 36 }: StickerIconProps) {
  const IconComponent = iconRegistry[iconName] || Sparkles;
  const iconSize = size * 0.55;
  const { h, s, l } = hexToHSL(color);
  const bgLight = `hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l + 30, 88)}%)`;
  const shadowColor = `hsla(${h}, ${s}%, ${Math.min(l + 10, 60)}%, 0.35)`;

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${bgLight}, hsl(${h}, ${Math.min(s, 80)}%, ${Math.max(l + 15, 75)}%))`,
        boxShadow: `0 2px 8px ${shadowColor}`,
      }}
    >
      <IconComponent
        size={iconSize}
        color={color}
        strokeWidth={2.2}
        fill={`hsla(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l + 25, 80)}%, 0.5)`}
      />
    </div>
  );
}
