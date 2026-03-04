import rawData from "@/data.json";

export interface DecorativeElement {
  id: string;
  name: string;
  category: "decoration" | "sign" | "product";
  locked: boolean;
  imagePath: string;
  color: string;
  unlockTier: number;
  coinValue: number;
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
  colorPalette: string[];
  baseElements: DecorativeElement[];
  lockedElements: DecorativeElement[];
   /** Elements only available via the coin shop, never unlocked by quiz score. */
  shopOnlyElements: DecorativeElement[];
  quiz: QuizQuestion[];
  unlockThreshold: number;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").replace(/^-+/, "");
}

function makeImagePath(festId: string, name: string): string {
  return `/kawaii/${festId}-${slugify(name)}.png`;
}

const elementColorMap: Record<string, string> = {
  "Red Book": "#e74c3c",
  "Love Poem": "#c0392b",
  "Heart Sticker": "#ff4d6d",
  "Giant Heart": "#e63946",
  "Cupid Statue": "#ffb3c1",
  "Rose Bouquet": "#d62828",
  "Love Card": "#ff758f",
  "Teddy Bear": "#c0392b",
  "Chocolate Box": "#7209b7",
  "Love Banner": "#ff4d6d",
  "English Dictionary": "#2980b9",
  "Easter Card": "#bde0fe",
  "Small Basket": "#c49a6c",
  "Chocolate Bunny": "#8B5E3C",
  "Decorated Egg": "#a8d8ea",
  "Spring Flowers": "#f9c74f",
  "Grass Display": "#52b788",
  "Easter Wreath": "#40916c",
  "Chick Toy": "#f9c74f",
  "Egg Hunt Sign": "#bde0fe",
  "Garden Guide": "#40916c",
  "Green Notebook": "#2d6a4f",
  "Sale Sign": "#e63946",
  "Butterfly Garland": "#c77dff",
  "Flower Pot": "#e9c46a",
  "Sun Icon": "#f4a261",
  "Pastel Ribbon": "#ffc8dd",
  "Bird House": "#74c69d",
  "Watering Can": "#0096c7",
  "Spring Banner": "#52b788",
  "Poetry Book": "#7209b7",
  "Greeting Card": "#ffb5a7",
  "Pink Ribbon": "#ff69b4",
  "Jewelry Box": "#e0aaff",
  "Perfume Bottle": "#d8b4fe",
  "Golden Frame": "#e9c46a",
  "Tulips": "#f72585",
  "Photo Album": "#ffc8dd",
  "Tea Set": "#ffb5a7",
  "Flower Crown": "#ff69b4",
  "Travel Guide": "#0077b6",
  "Sunglasses": "#264653",
  "Beach Postcard": "#06d6a0",
  "Ice Cream Prop": "#f4a261",
  "Flip-flops": "#ff6b6b",
  "Beach Ball": "#e76f51",
  "Sunscreen Display": "#f9c74f",
  "Surfboard": "#0077b6",
  "Palm Tree": "#06d6a0",
  "Beach Towel": "#e76f51",
  "Oxford Dictionary": "#1a3a5c",
  "Pencil Case": "#e9c46a",
  "Backpack": "#e76f51",
  "Globe": "#0096c7",
  "School Bus": "#f4a261",
  "Scientific Calculator": "#6c757d",
  "Blackboard": "#2b2d42",
  "Microscope": "#0077b6",
  "Art Supplies": "#e76f51",
  "Lunch Box": "#f4a261",
  "Horror Novel": "#6c3483",
  "Black Envelope": "#2c2c2c",
  "Pumpkin Sticker": "#f58549",
  "Ghost Figure": "#adb5bd",
  "Witch Hat": "#4a0080",
  "Spider Web": "#6c757d",
  "Candy Jar": "#e76f51",
  "Bat Decor": "#2c2c2c",
  "Skull Prop": "#6c3483",
  "Cauldron": "#4a0080",
  "Gadget Catalog": "#495057",
  "50% Off Sign": "#e63946",
  "Price Tag": "#ff0000",
  "Limited Edition Box": "#ffd700",
  "Shopping Bag": "#333533",
  "Discount Banner": "#d62828",
  "Store Clock": "#495057",
  "VIP Badge": "#ffd700",
  "Gift Card": "#e63946",
  "Flash Sale Sign": "#ff0000",
  "Christmas Tale": "#228B22",
  "Star Sticker": "#ffd700",
  "Red Gift": "#e63946",
  "Xmas Tree": "#228B22",
  "Santa Hat": "#d62828",
  "Stocking": "#c1121f",
  "Snowman": "#90e0ef",
  "Candy Cane": "#ee6055",
  "Wreath": "#228B22",
  "Reindeer": "#c1121f",
  "Heart Balloons": "#ff4d6d",
  "Rose Petals": "#e63946",
  "Love Confetti": "#ffb3c1",
  "Couple Silhouette": "#2c2c2c",
  "Romantic Candle": "#ffd700",
  "Candy Eggs Jar": "#f9c74f",
  "Easter Ribbon": "#ffb3c1",
  "Carrot Garland": "#f8961e",
  "Bunny Footprints": "#8d5524",
  "Pastel Gift Bag": "#bde0fe",
  "Flower Confetti": "#ffc8dd",
  "Spring Price Tag": "#e63946",
  "Pastel Shopping Bag": "#74c69d",
  "Garden Lantern": "#f4a261",
  "Rain Boots": "#4dabf7",
  "Heart Mug": "#ff6b6b",
  "Flower Vase": "#e9c46a",
  "Gift Basket": "#c49a6c",
  "Mum Lettering": "#ffb3c1",
  "Heart Balloons Mum": "#f72585",
  "Seashell Garland": "#f9c74f",
  "Ice Lolly": "#ffb3c1",
  "Beach Umbrella": "#f4a261",
  "Flip-flop Trail": "#ff6b6b",
  "Sun Hat": "#e9c46a",
  "Highlighter Pack": "#ffd166",
  "Notebook Stack": "#8ecae6",
  "Pencil Jar": "#f4a261",
  "School Locker": "#1a3a5c",
  "Alarm Clock": "#e63946",
  "Jack-o-lantern Row": "#f58549",
  "Spooky Window": "#4a0080",
  "Candy Bucket": "#e76f51",
  "Flying Bats": "#2c2c2c",
  "Cobweb Corner": "#6c757d",
  "Neon SALE Sign": "#ff0000",
  "Shopping Cart": "#6c757d",
  "Receipt Roll": "#adb5bd",
  "Big Arrow Sign": "#ffd700",
  "Spotlight Stand": "#495057",
  "Snow Globe": "#90e0ef",
  "Gift Stack": "#e63946",
  "Christmas Star": "#ffd700",
  "Toy Train": "#2d6a4f",
  "Gingerbread Man": "#d2691e",
};

function makeId(name: string, festId: string): string {
  return `${festId}-${slugify(name)}`;
}

function mapElements(names: string[], festId: string, locked: boolean): DecorativeElement[] {
  return names.map((name, index) => ({
    id: makeId(name, festId),
    name,
    category: name.toLowerCase().includes("sign") || name.toLowerCase().includes("tag") || name.toLowerCase().includes("banner") || name.toLowerCase().includes("off")
      ? "sign"
      : name.toLowerCase().includes("book") || name.toLowerCase().includes("dictionary") || name.toLowerCase().includes("guide") || name.toLowerCase().includes("catalog") || name.toLowerCase().includes("novel") || name.toLowerCase().includes("tale")
        ? "product"
        : "decoration",
    locked,
    imagePath: makeImagePath(festId, name),
    color: elementColorMap[name] || "#888",
    unlockTier: locked ? index + 1 : 0,
    coinValue: locked ? 5 : 3,
  }));
}

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function mapQuizzes(
  quizzes: Array<{ question: string; options: string[]; correct: string }>,
  festId: string
): QuizQuestion[] {
  return quizzes.map((q, i) => {
    const seed = festId.length * 1000 + i * 137 + q.correct.charCodeAt(0);
    const shuffled = shuffleArray(q.options, seed);
    const correctIdx = shuffled.indexOf(q.correct);
    return {
      id: `${festId}-q${i + 1}`,
      question: q.question,
      options: shuffled,
      correctIndex: correctIdx >= 0 ? correctIdx : 0,
    };
  });
}

export const festivities: Festivity[] = rawData.festivities.map((f) => {
  const quizzes = mapQuizzes(f.quizzes, f.id);
  const shopOnlyNames = (f as any).shopOnlyElements || [];
  return {
    id: f.id,
    name: f.name,
    month: f.month,
    color: f.themeColor,
    colorPalette: f.colorPalette,
    baseElements: mapElements(f.baseElements, f.id, false),
    lockedElements: mapElements(f.unlockableElements, f.id, true),
    shopOnlyElements: mapElements(shopOnlyNames, f.id, true),
    quiz: quizzes,
    unlockThreshold: Math.max(1, Math.ceil(quizzes.length * 0.6)),
  };
});

export interface UnlockStatus {
  unlockedElements: string[];
  unlockedLightsCount: number;
  unlockedBgColors: number;
  furnitureUnlocked: boolean;
  nextElementAt: number | null;
  nextLightAt: number | null;
  nextBgAt: number | null;
  nextFurnitureAt: number | null;
}

/** Total questions in the grammar quiz (6 levels × 2 blocks × 6 questions). Used for unlock progression so completing a few blocks doesn't unlock everything. */
export const GRAMMAR_QUIZ_TOTAL = 6 * 2 * 6;

export function getUnlockStatus(
  festivity: Festivity,
  score: number,
): UnlockStatus {
  const total = GRAMMAR_QUIZ_TOTAL;
  if (total === 0) return { unlockedElements: [], unlockedLightsCount: 0, unlockedBgColors: 0, furnitureUnlocked: false, nextElementAt: 1, nextLightAt: 1, nextBgAt: 1, nextFurnitureAt: 1 };

  const elemCount = Math.min(festivity.lockedElements.length, Math.floor(score * festivity.lockedElements.length / total));
  const unlockedElements = festivity.lockedElements.slice(0, elemCount).map(e => e.id);

  const lightsThresholds = [2, 3, 4, 5, 6, 7, 8, 8, 9, 10];
  const unlockedLightsCount = Math.min(10, lightsThresholds.filter(t => score >= Math.ceil(t * total / 10)).length);

  const bgThresholds = [1, 4, 6, 8, 9, 10];
  const bgGroupsUnlocked = bgThresholds.filter(t => score >= Math.ceil(t * total / 10)).length;
  const unlockedBgColors = Math.min(21, bgGroupsUnlocked * 3 + 3);

  // Unlock furniture after completing both blocks of level 2.
  // Each block has up to 6 points, so we approximate this as 12 total quiz points.
  const furnitureThreshold = 12;
  const furnitureUnlocked = score >= furnitureThreshold;

  const nextElemScore = elemCount < festivity.lockedElements.length
    ? Math.ceil((elemCount + 1) * total / festivity.lockedElements.length)
    : null;

  const nextLight = unlockedLightsCount < 10
    ? Math.ceil(lightsThresholds[unlockedLightsCount] * total / 10)
    : null;

  const nextBg = bgGroupsUnlocked < bgThresholds.length
    ? Math.ceil(bgThresholds[bgGroupsUnlocked] * total / 10)
    : null;

  const nextFurnitureAt = !furnitureUnlocked ? furnitureThreshold : null;

  return {
    unlockedElements,
    unlockedLightsCount,
    unlockedBgColors,
    furnitureUnlocked,
    nextElementAt: nextElemScore,
    nextLightAt: nextLight,
    nextBgAt: nextBg,
    nextFurnitureAt,
  };
}
