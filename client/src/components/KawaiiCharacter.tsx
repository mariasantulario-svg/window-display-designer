/**
 * Personajes en estilo Kawaii/Chibi: cabeza grande, cuerpo pequeño,
 * ojos muy grandes y brillantes con destellos, formas redondeadas, sin fondo.
 * Colores personalizables (piel, pelo, vestimenta). Estándar: clientes encantadores.
 */

export type CharacterType =
  | "niña"
  | "niño"
  | "mujer"
  | "hombre"
  | "anciana"
  | "anciano"
  | "gato"
  | "perro"
  | "conejo"
  | "oso";

export interface KawaiiCharacterColors {
  skin?: string;
  hair?: string;
  clothing?: string;
  clothingSecondary?: string;
}

const VIEWBOX = "0 0 200 240";
const DEFAULT_COLORS: KawaiiCharacterColors = {
  skin: "#ffdbac",
  hair: "#5c4033",
  clothing: "#ff9ecd",
  clothingSecondary: "#ffb3d9",
};

export interface KawaiiCharacterProps {
  type: CharacterType;
  colors?: KawaiiCharacterColors;
  width?: number;
  height?: number;
  className?: string;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

function useColors(colors?: KawaiiCharacterColors): Required<KawaiiCharacterColors> {
  return {
    skin: colors?.skin ?? DEFAULT_COLORS.skin!,
    hair: colors?.hair ?? DEFAULT_COLORS.hair!,
    clothing: colors?.clothing ?? DEFAULT_COLORS.clothing!,
    clothingSecondary: colors?.clothingSecondary ?? DEFAULT_COLORS.clothingSecondary!,
  };
}

/* ---- Ojos kawaii estándar: grandes, brillantes, con destello en estrella ---- */
function KawaiiEyes({ cx, cy, offsetX = 18 }: { cx: number; cy: number; offsetX?: number }) {
  const r = 13;
  const irisR = 8;
  const pupilR = 4;
  const highlightR = 4.5;
  return (
    <g>
      <circle cx={cx - offsetX} cy={cy} r={r} fill="white" stroke="#2d2d2d" strokeWidth="1.2" />
      <circle cx={cx - offsetX} cy={cy} r={irisR} fill="#6b4423" />
      <circle cx={cx - offsetX} cy={cy} r={pupilR} fill="#2d2d2d" />
      <circle cx={cx - offsetX - 3} cy={cy - 4} r={highlightR} fill="white" />
      <circle cx={cx - offsetX + 4} cy={cy - 2} r={2} fill="white" opacity="0.9" />
      <circle cx={cx + offsetX} cy={cy} r={r} fill="white" stroke="#2d2d2d" strokeWidth="1.2" />
      <circle cx={cx + offsetX} cy={cy} r={irisR} fill="#6b4423" />
      <circle cx={cx + offsetX} cy={cy} r={pupilR} fill="#2d2d2d" />
      <circle cx={cx + offsetX - 3} cy={cy - 4} r={highlightR} fill="white" />
      <circle cx={cx + offsetX + 4} cy={cy - 2} r={2} fill="white" opacity="0.9" />
    </g>
  );
}

function KawaiiCheeks({ cx, cy, offsetX = 38 }: { cx: number; cy: number; offsetX?: number }) {
  return (
    <>
      <ellipse cx={cx - offsetX} cy={cy} rx={14} ry={9} fill="#ffb3c1" opacity="0.8" />
      <ellipse cx={cx + offsetX} cy={cy} rx={14} ry={9} fill="#ffb3c1" opacity="0.8" />
    </>
  );
}

function CharacterNina({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M62 118 Q58 200 65 240 L135 240 L142 200 Q142 118 138 118 Q118 108 100 105 Q82 108 62 118 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1.5" />
      <path d="M62 118 L52 138 L62 145 L78 122 Z" fill={c.clothing} />
      <path d="M138 118 L148 138 L138 145 L122 122 Z" fill={c.clothing} />
      <path d="M88 108 L92 118 L108 118 L112 108 Z" fill={c.skin} />
      <circle cx="100" cy="72" r="48" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <path d="M52 38 Q42 65 48 105 L58 115 L68 95 Q72 55 52 38 Z" fill={c.hair} />
      <path d="M148 38 Q158 65 152 105 L142 115 L132 95 Q128 55 148 38 Z" fill={c.hair} />
      <ellipse cx="100" cy="42" rx="48" ry="28" fill={c.hair} />
      <path d="M62 82 L56 108 L70 100 Z" fill={c.hair} />
      <path d="M138 82 L144 108 L130 100 Z" fill={c.hair} />
      <KawaiiEyes cx={100} cy={78} />
      <KawaiiCheeks cx={100} cy={98} />
      <path d="M88 108 Q100 114 112 108" stroke="#c45c6e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterNino({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M64 116 L60 240 L140 240 L136 116 Q118 108 100 104 Q82 108 64 116 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1.5" />
      <path d="M64 116 L54 134 L64 142 L78 120 Z" fill={c.clothing} />
      <path d="M136 116 L146 134 L136 142 L122 120 Z" fill={c.clothing} />
      <path d="M88 106 L92 116 L108 116 L112 106 Z" fill={c.skin} />
      <circle cx="100" cy="74" r="46" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <ellipse cx="100" cy="48" rx="46" ry="26" fill={c.hair} />
      <path d="M54 72 L50 100 L64 92 Z" fill={c.hair} />
      <path d="M146 72 L150 100 L136 92 Z" fill={c.hair} />
      <KawaiiEyes cx={100} cy={80} />
      <KawaiiCheeks cx={100} cy={100} />
      <path d="M90 110 Q100 115 110 110" stroke="#c45c6e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterMujer({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M60 112 L56 190 Q58 240 68 240 L132 240 L144 190 Q144 112 140 112 Q118 104 100 100 Q82 104 60 112 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1.5" />
      <path d="M60 112 L50 130 L60 138 L76 116 Z" fill={c.clothing} />
      <path d="M140 112 L150 130 L140 138 L124 116 Z" fill={c.clothing} />
      <path d="M86 100 L90 110 L110 110 L114 100 Z" fill={c.skin} />
      <circle cx="100" cy="70" r="48" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <path d="M52 35 Q42 62 48 102 L58 118 L72 95 Q76 50 52 35 Z" fill={c.hair} />
      <path d="M148 35 Q158 62 152 102 L142 118 L128 95 Q124 50 148 35 Z" fill={c.hair} />
      <ellipse cx="100" cy="40" rx="48" ry="28" fill={c.hair} />
      <KawaiiEyes cx={100} cy={76} />
      <KawaiiCheeks cx={100} cy={96} />
      <path d="M88 106 Q100 112 112 106" stroke="#c45c6e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterHombre({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M62 110 L58 240 L142 240 L138 110 Q118 102 100 98 Q82 102 62 110 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1.5" />
      <path d="M62 110 L52 128 L62 136 L78 114 Z" fill={c.clothing} />
      <path d="M138 110 L148 128 L138 136 L122 114 Z" fill={c.clothing} />
      <path d="M88 98 L92 108 L108 108 L112 98 Z" fill={c.skin} />
      <circle cx="100" cy="72" r="46" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <ellipse cx="100" cy="46" rx="45" ry="24" fill={c.hair} />
      <path d="M55 68 L52 98 L64 90 Z" fill={c.hair} />
      <path d="M145 68 L148 98 L136 90 Z" fill={c.hair} />
      <KawaiiEyes cx={100} cy={78} offsetX={16} />
      <KawaiiCheeks cx={100} cy={98} offsetX={36} />
      <path d="M90 108 Q100 113 110 108" stroke="#b05050" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterAnciana({ c }: { c: ReturnType<typeof useColors> }) {
  const hair = c.hair;
  return (
    <g>
      <path d="M68 205 L65 240 L82 240 L85 208 Q78 202 68 205 Z" fill="#8b6914" stroke="#6b5344" strokeWidth="1" />
      <path d="M118 205 L115 240 L132 240 L135 208 Q128 202 118 205 Z" fill="#8b6914" stroke="#6b5344" strokeWidth="1" />
      <path d="M70 198 L68 208 L82 208 L84 198 Z" fill="#f5f5dc" />
      <path d="M120 198 L118 208 L132 208 L134 198 Z" fill="#f5f5dc" />
      <path d="M58 118 L55 200 L72 200 L78 125 Q70 118 58 118 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1" />
      <path d="M142 118 L145 200 L128 200 L122 125 Q130 118 142 118 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1" />
      <path d="M72 125 L72 200 L128 200 L128 125 Q100 115 72 125 Z" fill={c.clothingSecondary} stroke={c.clothing} strokeWidth="1" />
      <path d="M78 140 L78 195 M88 135 L88 198 M98 132 L98 198 M108 135 L108 198 M118 140 L118 195" stroke={c.clothing} strokeWidth="1.5" opacity="0.7" />
      <path d="M56 108 L54 118 L72 118 L78 108 Q68 102 56 108 Z" fill="white" stroke="#e0e0e0" strokeWidth="1" />
      <path d="M144 108 L146 118 L128 118 L122 108 Q132 102 144 108 Z" fill="white" stroke="#e0e0e0" strokeWidth="1" />
      <path d="M62 108 L58 200 L142 200 L138 108 Q118 98 100 94 Q82 98 62 108 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1.5" />
      <path d="M62 108 L50 128 L58 138 L76 112 Z" fill={c.clothing} />
      <path d="M138 108 L150 128 L142 138 L124 112 Z" fill={c.clothing} />
      <circle cx="85" cy="145" r="4" fill="white" opacity="0.9" />
      <circle cx="100" cy="152" r="3" fill="white" opacity="0.8" />
      <circle cx="115" cy="145" r="4" fill="white" opacity="0.9" />
      <path d="M22 165 L22 218 L48 218 L48 165 Z" fill="#8b6914" stroke="#6b5344" strokeWidth="1.2" />
      <path d="M24 165 L24 216 L46 216 L46 165 Z" fill="#a08050" />
      <circle cx="35" cy="172" r="3" fill="#c9a227" />
      <path d="M28 158 L32 165 L42 165 L38 158 Z" fill="#6b5344" />
      <circle cx="35" cy="161" r="2" fill="#c9a227" />
      <path d="M32 168 L30 175 L32 178 L34 175 Z" fill="#228b22" />
      <circle cx="31" cy="174" r="1.5" fill="#e63946" />
      <circle cx="34" cy="176" r="1.5" fill="#e63946" />
      <path d="M158 175 L152 210 L168 210 L162 175 Z" fill="#d4b896" stroke="#a08050" strokeWidth="1" />
      <circle cx="160" cy="168" r="2" fill="#8b7355" />
      <circle cx="160" cy="182" r="2" fill="#c0c0c0" />
      <path d="M84 96 L90 108 L110 108 L116 96 Z" fill={c.skin} />
      <circle cx="100" cy="68" r="46" fill={c.skin} stroke="#e0b890" strokeWidth="2" />
      <path d="M78 98 Q82 96 86 98" stroke="#e8c4a0" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M114 98 Q118 96 122 98" stroke="#e8c4a0" strokeWidth="0.8" fill="none" opacity="0.6" />
      <ellipse cx="100" cy="38" rx="46" ry="26" fill={hair} />
      <path d="M54 58 L50 92 L62 88 Z" fill={hair} />
      <path d="M146 58 L150 92 L138 88 Z" fill={hair} />
      <path d="M138 42 Q142 35 148 38 Q144 48 136 48 Q132 42 138 42 Z" fill="#e63946" />
      <path d="M134 44 L130 38 L136 36 L140 42 Z" fill="#228b22" />
      <path d="M140 44 L144 38 L150 40 L148 46 Z" fill="#228b22" />
      <circle cx="142" cy="42" r="2" fill="#ffd700" />
      <path d="M72 72 Q78 66 86 72 Q82 78 74 78 Q70 74 72 72 Z" fill="none" stroke="#5a5a5a" strokeWidth="1.5" />
      <path d="M114 72 Q120 66 128 72 Q124 78 116 78 Q110 74 114 72 Z" fill="none" stroke="#5a5a5a" strokeWidth="1.5" />
      <path d="M86 74 L114 74" stroke="#5a5a5a" strokeWidth="1.5" />
      <KawaiiEyes cx={100} cy={74} offsetX={14} />
      <circle cx="80" cy="72" r="3" fill="#2d2d2d" />
      <circle cx="120" cy="72" r="3" fill="#2d2d2d" />
      <KawaiiCheeks cx={100} cy={94} offsetX={36} />
      <path d="M88 102 Q100 108 112 102" stroke="#a04040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterAnciano({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M165 168 L167 238" stroke="#6b5344" strokeWidth="5" strokeLinecap="round" />
      <circle cx="165" cy="164" r="6" fill="#6b5344" />
      <path d="M64 108 L60 240 L140 240 L136 108 Q118 100 100 96 Q82 100 64 108 Z" fill={c.clothing} stroke={c.clothingSecondary} strokeWidth="1.5" />
      <path d="M64 108 L52 128 L62 138 L78 112 Z" fill={c.clothing} />
      <path d="M136 108 L148 128 L138 138 L122 112 Z" fill={c.clothing} />
      <path d="M86 98 L90 108 L110 108 L114 98 Z" fill={c.skin} />
      <circle cx="100" cy="70" r="45" fill={c.skin} stroke="#e0b890" strokeWidth="2" />
      <ellipse cx="100" cy="44" rx="44" ry="24" fill={c.hair} />
      <path d="M56 66 L52 96 L64 88 Z" fill={c.hair} />
      <path d="M144 66 L148 96 L136 88 Z" fill={c.hair} />
      <path d="M76 94 Q82 92 88 95" stroke="#e8c4a0" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M112 95 Q118 92 124 94" stroke="#e8c4a0" strokeWidth="0.8" fill="none" opacity="0.5" />
      <KawaiiEyes cx={100} cy={76} offsetX={14} />
      <KawaiiCheeks cx={100} cy={96} offsetX={34} />
      <path d="M90 104 Q100 109 110 104" stroke="#a04040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterGato({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M68 120 Q64 200 70 240 L130 240 L136 200 Q136 120 132 120 Q115 112 100 108 Q85 112 68 120 Z" fill={c.clothing} />
      <path d="M52 58 L68 115 L58 120 L48 85 Z" fill={c.skin} stroke="#e8c4a0" strokeWidth="1" />
      <path d="M148 58 L132 115 L142 120 L152 85 Z" fill={c.skin} stroke="#e8c4a0" strokeWidth="1" />
      <circle cx="100" cy="108" r="44" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <path d="M64 62 L72 108 L56 82 Z" fill={c.hair} />
      <path d="M136 62 L128 108 L144 82 Z" fill={c.hair} />
      <ellipse cx="78" cy="102" rx="14" ry="16" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="122" cy="102" rx="14" ry="16" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="78" cy="104" rx="8" ry="10" fill="#2d2d2d" />
      <ellipse cx="122" cy="104" rx="8" ry="10" fill="#2d2d2d" />
      <circle cx="76" cy="98" r="4" fill="white" />
      <circle cx="120" cy="98" r="4" fill="white" />
      <circle cx="80" cy="100" r="1.5" fill="white" />
      <circle cx="124" cy="100" r="1.5" fill="white" />
      <path d="M98 116 L96 120 L100 122 L104 120 Z" fill="#ff9ebb" />
      <path d="M68 114 L44 112 M68 120 L42 120 M68 126 L44 128" stroke="#5c4033" strokeWidth="0.8" fill="none" />
      <path d="M132 114 L156 112 M132 120 L158 120 M132 126 L156 128" stroke="#5c4033" strokeWidth="0.8" fill="none" />
      <KawaiiCheeks cx={100} cy={118} offsetX={32} />
      <path d="M92 124 Q100 128 108 124" stroke="#5c4033" strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="88" rx="14" ry="10" fill={c.clothingSecondary} />
      <circle cx="100" cy="88" r="5" fill={c.clothingSecondary} />
      <path d="M90 86 Q82 78 88 72 Q96 80 90 86 Z" fill={c.clothingSecondary} />
      <path d="M110 86 Q118 78 112 72 Q104 80 110 86 Z" fill={c.clothingSecondary} />
    </g>
  );
}

function CharacterPerro({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M68 118 Q64 195 68 240 L132 240 L136 195 Q136 118 132 118 Q116 110 100 106 Q84 110 68 118 Z" fill={c.clothing} />
      <path d="M48 88 Q42 130 52 168 L64 158 L68 115 Q62 95 48 88 Z" fill={c.skin} stroke="#e8c4a0" strokeWidth="1" />
      <path d="M152 88 Q158 130 148 168 L136 158 L132 115 Q138 95 152 88 Z" fill={c.skin} stroke="#e8c4a0" strokeWidth="1" />
      <path d="M52 95 Q50 125 58 155" fill={c.hair} opacity="0.9" />
      <path d="M148 95 Q150 125 142 155" fill={c.hair} opacity="0.9" />
      <circle cx="100" cy="110" r="42" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <ellipse cx="78" cy="106" rx="12" ry="14" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="122" cy="106" rx="12" ry="14" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="78" cy="108" rx="6" ry="7" fill="#2d2d2d" />
      <ellipse cx="122" cy="108" rx="6" ry="7" fill="#2d2d2d" />
      <circle cx="76" cy="102" r="3.5" fill="white" />
      <circle cx="120" cy="102" r="3.5" fill="white" />
      <ellipse cx="100" cy="122" rx="10" ry="7" fill={c.skin} stroke="#e0b890" strokeWidth="1" />
      <path d="M94 124 L90 130 Q100 133 110 130 L106 124 Z" fill="#5c4033" />
      <KawaiiCheeks cx={100} cy={118} offsetX={30} />
      <path d="M92 128 Q100 132 108 128" stroke="#5c4033" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterConejo({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M70 122 Q66 198 70 240 L130 240 L134 198 Q134 122 130 122 Q114 114 100 110 Q86 114 70 122 Z" fill={c.clothing} />
      <path d="M82 28 L78 112 L88 108 L92 50 Q90 32 82 28 Z" fill={c.skin} stroke="#e8c4a0" strokeWidth="1" />
      <path d="M118 28 L122 112 L112 108 L108 50 Q110 32 118 28 Z" fill={c.skin} stroke="#e8c4a0" strokeWidth="1" />
      <path d="M84 45 L80 100 L88 96 Z" fill={c.hair} opacity="0.9" />
      <path d="M116 45 L120 100 L112 96 Z" fill={c.hair} opacity="0.9" />
      <circle cx="100" cy="114" r="40" fill={c.skin} stroke="#e8c4a0" strokeWidth="2" />
      <ellipse cx="78" cy="108" rx="12" ry="14" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="122" cy="108" rx="12" ry="14" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="78" cy="110" rx="6" ry="7" fill="#2d2d2d" />
      <ellipse cx="122" cy="110" rx="6" ry="7" fill="#2d2d2d" />
      <circle cx="76" cy="104" r="3.5" fill="white" />
      <circle cx="120" cy="104" r="3.5" fill="white" />
      <ellipse cx="100" cy="124" rx="6" ry="5" fill="#e8a090" />
      <KawaiiCheeks cx={100} cy={120} offsetX={30} />
      <path d="M94 128 Q100 132 106 128" stroke="#5c4033" strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CharacterOso({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <g>
      <path d="M66 120 Q62 198 66 240 L134 240 L138 198 Q138 120 134 120 Q117 112 100 108 Q83 112 66 120 Z" fill={c.clothing} />
      <circle cx="68" cy="82" r="20" fill={c.skin} stroke="#e0b890" strokeWidth="1.2" />
      <circle cx="132" cy="82" r="20" fill={c.skin} stroke="#e0b890" strokeWidth="1.2" />
      <circle cx="100" cy="110" r="44" fill={c.skin} stroke="#e0b890" strokeWidth="2" />
      <ellipse cx="100" cy="128" rx="16" ry="12" fill={c.hair} />
      <path d="M92 124 L88 132 Q100 136 112 132 L108 124 Z" fill="#4a3728" />
      <ellipse cx="76" cy="106" rx="11" ry="12" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="124" cy="106" rx="11" ry="12" fill="white" stroke="#2d2d2d" strokeWidth="1" />
      <ellipse cx="76" cy="108" rx="5" ry="6" fill="#2d2d2d" />
      <ellipse cx="124" cy="108" rx="5" ry="6" fill="#2d2d2d" />
      <circle cx="74" cy="102" r="3" fill="white" />
      <circle cx="122" cy="102" r="3" fill="white" />
      <KawaiiCheeks cx={100} cy={118} offsetX={32} />
      <path d="M92 132 Q100 138 108 132" stroke="#4a3728" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function KawaiiCharacter({
  type,
  colors,
  width = 200,
  height = 240,
  className,
  svgRef,
}: KawaiiCharacterProps) {
  const c = useColors(colors);

  const renderCharacter = () => {
    switch (type) {
      case "niña":
        return <CharacterNina c={c} />;
      case "niño":
        return <CharacterNino c={c} />;
      case "mujer":
        return <CharacterMujer c={c} />;
      case "hombre":
        return <CharacterHombre c={c} />;
      case "anciana":
        return <CharacterAnciana c={c} />;
      case "anciano":
        return <CharacterAnciano c={c} />;
      case "gato":
        return <CharacterGato c={c} />;
      case "perro":
        return <CharacterPerro c={c} />;
      case "conejo":
        return <CharacterConejo c={c} />;
      case "oso":
        return <CharacterOso c={c} />;
      default:
        return <CharacterNina c={c} />;
    }
  };

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX}
      width={width}
      height={height}
      className={className}
      style={{ display: "block", background: "transparent" }}
    >
      {renderCharacter()}
    </svg>
  );
}

export { DEFAULT_COLORS };
