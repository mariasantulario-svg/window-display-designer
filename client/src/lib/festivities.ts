import rawData from "@/data.json";

export interface DecorativeElement {
  id: string;
  name: string;
  category: "decoration" | "sign" | "product";
  locked: boolean;
  iconName: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Festivity {
  id: string;
  name: string;
  month: string;
  color: string;
  baseElements: DecorativeElement[];
  lockedElements: DecorativeElement[];
  quiz: QuizQuestion[];
  unlockThreshold: number;
}

const elementIconMap: Record<string, string> = {
  "Red Book": "book-open",
  "Love Poem": "scroll-text",
  "Heart Sticker": "heart",
  "Giant Heart": "heart",
  "Cupid Statue": "target",
  "Rose Bouquet": "flower-2",
  "Love Card": "mail-heart",
  "English Dictionary": "book-open",
  "Easter Card": "mail",
  "Small Basket": "shopping-basket",
  "Chocolate Bunny": "rabbit",
  "Decorated Egg": "egg",
  "Spring Flowers": "flower",
  "Grass Display": "sprout",
  "Garden Guide": "book-open",
  "Green Notebook": "notebook",
  "Sale Sign": "tag",
  "Butterfly Garland": "butterfly",
  "Flower Pot": "flower-2",
  "Sun Icon": "sun",
  "Pastel Ribbon": "ribbon",
  "Poetry Book": "book-open",
  "Greeting Card": "mail",
  "Pink Ribbon": "ribbon",
  "Jewelry Box": "gem",
  "Perfume Bottle": "droplets",
  "Golden Frame": "frame",
  "Tulips": "flower",
  "Travel Guide": "map",
  "Sunglasses": "glasses",
  "Beach Postcard": "image",
  "Ice Cream Prop": "ice-cream-cone",
  "Flip-flops": "footprints",
  "Beach Ball": "circle-dot",
  "Sunscreen Display": "sun",
  "Oxford Dictionary": "book-open",
  "Pencil Case": "pen-tool",
  "Backpack": "backpack",
  "Globe": "globe",
  "School Bus": "bus",
  "Scientific Calculator": "calculator",
  "Blackboard": "presentation",
  "Horror Novel": "book-open",
  "Black Envelope": "mail",
  "Pumpkin Sticker": "citrus",
  "Ghost Figure": "ghost",
  "Witch Hat": "crown",
  "Spider Web": "bug",
  "Candy Jar": "candy",
  "Gadget Catalog": "smartphone",
  "50% Off Sign": "percent",
  "Price Tag": "tag",
  "Limited Edition Box": "package",
  "Shopping Bag": "shopping-bag",
  "Discount Banner": "badge-percent",
  "Store Clock": "clock",
  "Christmas Tale": "book-open",
  "Star Sticker": "star",
  "Red Gift": "gift",
  "Xmas Tree": "tree-pine",
  "Santa Hat": "party-popper",
  "Stocking": "sock",
  "Snowman": "snowflake",
};

const elementColorMap: Record<string, string> = {
  "Red Book": "#e74c3c",
  "Love Poem": "#c0392b",
  "Heart Sticker": "#ff4d6d",
  "Giant Heart": "#e63946",
  "Cupid Statue": "#ffb3c1",
  "Rose Bouquet": "#d62828",
  "Love Card": "#ff758f",
  "English Dictionary": "#2980b9",
  "Easter Card": "#bde0fe",
  "Small Basket": "#c49a6c",
  "Chocolate Bunny": "#8B5E3C",
  "Decorated Egg": "#a8d8ea",
  "Spring Flowers": "#f9c74f",
  "Grass Display": "#52b788",
  "Garden Guide": "#40916c",
  "Green Notebook": "#2d6a4f",
  "Sale Sign": "#e63946",
  "Butterfly Garland": "#c77dff",
  "Flower Pot": "#e9c46a",
  "Sun Icon": "#f4a261",
  "Pastel Ribbon": "#ffc8dd",
  "Poetry Book": "#7209b7",
  "Greeting Card": "#ffb5a7",
  "Pink Ribbon": "#ff69b4",
  "Jewelry Box": "#e0aaff",
  "Perfume Bottle": "#d8b4fe",
  "Golden Frame": "#e9c46a",
  "Tulips": "#f72585",
  "Travel Guide": "#0077b6",
  "Sunglasses": "#264653",
  "Beach Postcard": "#06d6a0",
  "Ice Cream Prop": "#f4a261",
  "Flip-flops": "#ff6b6b",
  "Beach Ball": "#e76f51",
  "Sunscreen Display": "#f9c74f",
  "Oxford Dictionary": "#1a3a5c",
  "Pencil Case": "#e9c46a",
  "Backpack": "#e76f51",
  "Globe": "#0096c7",
  "School Bus": "#f4a261",
  "Scientific Calculator": "#6c757d",
  "Blackboard": "#2b2d42",
  "Horror Novel": "#6c3483",
  "Black Envelope": "#2c2c2c",
  "Pumpkin Sticker": "#f58549",
  "Ghost Figure": "#adb5bd",
  "Witch Hat": "#4a0080",
  "Spider Web": "#6c757d",
  "Candy Jar": "#e76f51",
  "Gadget Catalog": "#495057",
  "50% Off Sign": "#e63946",
  "Price Tag": "#ff0000",
  "Limited Edition Box": "#ffd700",
  "Shopping Bag": "#333533",
  "Discount Banner": "#d62828",
  "Store Clock": "#495057",
  "Christmas Tale": "#228B22",
  "Star Sticker": "#ffd700",
  "Red Gift": "#e63946",
  "Xmas Tree": "#228B22",
  "Santa Hat": "#d62828",
  "Stocking": "#c1121f",
  "Snowman": "#90e0ef",
};

function slugify(name: string, festId: string): string {
  return `${festId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`;
}

function mapElements(names: string[], festId: string, locked: boolean): DecorativeElement[] {
  return names.map((name) => ({
    id: slugify(name, festId),
    name,
    category: name.toLowerCase().includes("sign") || name.toLowerCase().includes("tag") || name.toLowerCase().includes("banner") || name.toLowerCase().includes("off")
      ? "sign"
      : name.toLowerCase().includes("book") || name.toLowerCase().includes("dictionary") || name.toLowerCase().includes("guide") || name.toLowerCase().includes("catalog") || name.toLowerCase().includes("novel") || name.toLowerCase().includes("tale")
        ? "product"
        : "decoration",
    locked,
    iconName: elementIconMap[name] || "sparkles",
    color: elementColorMap[name] || "#888",
  }));
}

function mapQuizzes(
  quizzes: Array<{ question: string; options: string[]; correct: string }>,
  festId: string
): QuizQuestion[] {
  return quizzes.map((q, i) => {
    const idx = q.options.indexOf(q.correct);
    return {
      id: `${festId}-q${i + 1}`,
      question: q.question,
      options: q.options,
      correctIndex: idx >= 0 ? idx : 0,
    };
  });
}

export const festivities: Festivity[] = rawData.festivities.map((f) => {
  const quizzes = mapQuizzes(f.quizzes, f.id);
  return {
    id: f.id,
    name: f.name,
    month: f.month,
    color: f.themeColor,
    baseElements: mapElements(f.baseElements, f.id, false),
    lockedElements: mapElements(f.unlockableElements, f.id, true),
    quiz: quizzes,
    unlockThreshold: Math.max(1, Math.ceil(quizzes.length * 0.6)),
  };
});
