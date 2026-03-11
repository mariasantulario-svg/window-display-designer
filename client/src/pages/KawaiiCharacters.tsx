import { useRef, useState, useCallback, useEffect } from "react";
import { Link, useSearch, useLocation } from "wouter";
import {
  KawaiiCharacter,
  type CharacterType,
  type KawaiiCharacterColors,
  DEFAULT_COLORS,
} from "@/components/KawaiiCharacter";
import { festivities, type Festivity } from "@/lib/festivities";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Palette } from "lucide-react";

const CHARACTER_OPTIONS: { value: CharacterType; label: string }[] = [
  { value: "niña", label: "Niña" },
  { value: "niño", label: "Niño" },
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "anciana", label: "Anciana" },
  { value: "anciano", label: "Anciano" },
  { value: "gato", label: "Gato" },
  { value: "perro", label: "Perro" },
  { value: "conejo", label: "Conejo" },
  { value: "oso", label: "Oso" },
];

const SKIN_PRESETS = [
  "#ffdbac",
  "#f1c27d",
  "#e0ac69",
  "#c68642",
  "#8d5524",
  "#ffdfc4",
  "#e8c4a0",
];

const HAIR_PRESETS = [
  "#5c4033",
  "#2d2d2d",
  "#8b4513",
  "#daa520",
  "#cd853f",
  "#808080",
  "#f5deb3",
  "#4a3728",
];

const FALLBACK_CLOTHING_PRESETS = [
  "#ff9ecd",
  "#ffb3d9",
  "#a8e6cf",
  "#bde0fe",
  "#ffd166",
  "#c9b1bd",
  "#e63946",
  "#457b9d",
  "#6a4c93",
  "#f4a261",
];

function getClothingPresetsForSeason(festivity: Festivity | null | undefined): string[] {
  if (!festivity?.colorPalette?.length) return FALLBACK_CLOTHING_PRESETS;
  const palette = [...festivity.colorPalette];
  while (palette.length < 10) {
    palette.push(FALLBACK_CLOTHING_PRESETS[palette.length % FALLBACK_CLOTHING_PRESETS.length]);
  }
  return palette.slice(0, 10);
}

function svgToPngDataUrl(svg: SVGSVGElement, scale: number = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const w = svg.width.baseVal.value || 200;
    const h = svg.height.baseVal.value || 240;
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("No canvas context"));
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG"));
    };
    img.src = url;
  });
}

export default function KawaiiCharactersPage() {
  const searchString = useSearch();
  const festivityId = (typeof searchString === "string" && searchString
    ? new URLSearchParams(searchString).get("festivity")
    : null) || null;
  const currentFestivity = festivityId
    ? festivities.find((f) => f.id === festivityId) ?? festivities[0]
    : festivities[0];
  const clothingPresets = getClothingPresetsForSeason(currentFestivity);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [characterType, setCharacterType] = useState<CharacterType>("niña");
  const [colors, setColors] = useState<KawaiiCharacterColors>(() => {
    const pal = currentFestivity?.colorPalette;
    if (pal?.length) {
      return {
        ...DEFAULT_COLORS,
        clothing: pal[0],
        clothingSecondary: pal[Math.min(1, pal.length - 1)],
      };
    }
    return { ...DEFAULT_COLORS };
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!currentFestivity?.colorPalette?.length) return;
    const pal = currentFestivity.colorPalette;
    setColors((prev) => ({
      ...prev,
      clothing: pal[0],
      clothingSecondary: pal[Math.min(1, pal.length - 1)],
    }));
  }, [currentFestivity?.id]);

  const setSkin = useCallback((skin: string) => setColors((c) => ({ ...c, skin })), []);
  const setHair = useCallback((hair: string) => setColors((c) => ({ ...c, hair })), []);
  const setClothing = useCallback((clothing: string) => setColors((c) => ({ ...c, clothing })), []);
  const setClothingSecondary = useCallback(
    (clothingSecondary: string) => setColors((c) => ({ ...c, clothingSecondary })),
    []
  );

  const [, setLocation] = useLocation();
  const handleSeasonChange = useCallback(
    (newFestivityId: string) => {
      setLocation(`/personajes?festivity=${newFestivityId}`);
    },
    [setLocation]
  );

  const handleExport = useCallback(async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await svgToPngDataUrl(svgRef.current);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `kawaii-${characterType}-${Date.now()}.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  }, [characterType]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="border-b bg-card px-4 py-3 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-sans)" }}>
          Customize your customer
        </h1>
        <span className="text-sm text-muted-foreground">
          {currentFestivity?.name ?? ""}
        </span>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Vista previa
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div
                className="rounded-xl p-4 flex items-center justify-center min-h-[280px]"
                style={{ background: "transparent" }}
              >
                <div className="bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] rounded-lg p-2">
                  <KawaiiCharacter
                    type={characterType}
                    colors={colors}
                    width={200}
                    height={240}
                    svgRef={svgRef}
                  />
                </div>
              </div>
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="mt-4 w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? "Generando…" : "Descargar PNG (sin fondo)"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Personalizar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Season</Label>
                <Select
                  value={currentFestivity?.id ?? ""}
                  onValueChange={handleSeasonChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {festivities.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Customer type</Label>
                <Select
                  value={characterType}
                  onValueChange={(v) => setCharacterType(v as CharacterType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHARACTER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color de piel</Label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSkin(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (colors.skin ?? DEFAULT_COLORS.skin) === color
                          ? "border-foreground ring-2 ring-foreground/30 scale-110"
                          : "border-muted hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={colors.skin ?? DEFAULT_COLORS.skin}
                  onChange={(e) => setSkin(e.target.value)}
                  className="w-full h-9 rounded border border-input cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label>Color de pelo</Label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setHair(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (colors.hair ?? DEFAULT_COLORS.hair) === color
                          ? "border-foreground ring-2 ring-foreground/30 scale-110"
                          : "border-muted hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={colors.hair ?? DEFAULT_COLORS.hair}
                  onChange={(e) => setHair(e.target.value)}
                  className="w-full h-9 rounded border border-input cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label>Vestimenta (principal)</Label>
                <div className="flex flex-wrap gap-2">
                  {clothingPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setClothing(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (colors.clothing ?? DEFAULT_COLORS.clothing) === color
                          ? "border-foreground ring-2 ring-foreground/30 scale-110"
                          : "border-muted hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={colors.clothing ?? DEFAULT_COLORS.clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="w-full h-9 rounded border border-input cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label>Vestimenta (detalles / secundario)</Label>
                <div className="flex flex-wrap gap-2">
                  {clothingPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setClothingSecondary(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (colors.clothingSecondary ?? DEFAULT_COLORS.clothingSecondary) === color
                          ? "border-foreground ring-2 ring-foreground/30 scale-110"
                          : "border-muted hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={colors.clothingSecondary ?? DEFAULT_COLORS.clothingSecondary}
                  onChange={(e) => setClothingSecondary(e.target.value)}
                  className="w-full h-9 rounded border border-input cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
