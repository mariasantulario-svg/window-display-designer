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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface StickerIconProps {
  iconName: string;
  color: string;
  size?: number;
}

export function StickerIcon({ iconName, color, size = 36 }: StickerIconProps) {
  const IconComponent = iconRegistry[iconName] || Sparkles;
  const padding = Math.max(6, size * 0.2);

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-2xl"
      style={{
        padding: `${padding}px`,
        backgroundColor: hexToRgba(color, 0.12),
        border: `2px dashed ${hexToRgba(color, 0.4)}`,
      }}
    >
      <IconComponent size={size * 0.65} color={color} strokeWidth={2} />
      <div
        className="absolute top-1 left-1 rounded-full"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      />
    </div>
  );
}
