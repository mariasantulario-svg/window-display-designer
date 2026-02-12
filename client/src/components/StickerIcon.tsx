import {
  Heart, BookOpen, ScrollText, Target, Flower2, Mail, ShoppingBasket,
  Rabbit, Egg, Flower, Sprout, Notebook, Tag, Sun, Ribbon,
  Gem, Droplets, Frame, Map, Glasses, Image, IceCreamCone, Footprints,
  CircleDot, PenTool, Backpack, Globe, Bus, Calculator, Presentation,
  Citrus, Ghost, Crown, Bug, Candy, Smartphone, Percent, Package,
  ShoppingBag, BadgePercent, Clock, Star, Gift, TreePine, PartyPopper,
  Snowflake, Sparkles, type LucideIcon, MailPlus, Palette, CalendarHeart,
} from "lucide-react";

const iconComponents: Record<string, LucideIcon> = {
  "heart": Heart,
  "book-open": BookOpen,
  "scroll-text": ScrollText,
  "target": Target,
  "flower-2": Flower2,
  "mail-heart": CalendarHeart,
  "mail": Mail,
  "shopping-basket": ShoppingBasket,
  "rabbit": Rabbit,
  "egg": Egg,
  "flower": Flower,
  "sprout": Sprout,
  "notebook": Notebook,
  "tag": Tag,
  "butterfly": Bug,
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
  "citrus": Citrus,
  "ghost": Ghost,
  "crown": Crown,
  "bug": Bug,
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
  "snowflake": Snowflake,
  "sparkles": Sparkles,
  "sock": MailPlus,
  "palette": Palette,
};

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
  className?: string;
}

export function StickerIcon({ iconName, color, size = 44, className = "" }: StickerIconProps) {
  const IconComponent = iconComponents[iconName] || Sparkles;
  const iconSize = Math.round(size * 0.5);
  const bgColor = hexToRgba(color, 0.15);
  const borderColor = hexToRgba(color, 0.4);

  return (
    <div
      className={`flex items-center justify-center rounded-xl ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        border: `2px dashed ${borderColor}`,
      }}
      data-testid={`sticker-icon-${iconName}`}
    >
      <IconComponent
        size={iconSize}
        color={color}
        strokeWidth={1.5}
      />
    </div>
  );
}

const festivityIconMap: Record<string, string> = {
  valentines: "heart",
  easter: "egg",
  "spring-sale": "sprout",
  "mothers-day": "flower-2",
  "summer-sale": "sun",
  "back-to-school": "backpack",
  halloween: "ghost",
  "black-friday": "tag",
  christmas: "tree-pine",
};

export function getFestivityIcon(festId: string): string {
  return festivityIconMap[festId] || "sparkles";
}
