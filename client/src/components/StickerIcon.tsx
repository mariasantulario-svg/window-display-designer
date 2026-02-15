interface StickerIconProps {
  imagePath: string;
  name: string;
  size?: number;
}

export function StickerIcon({ imagePath, name, size = 44 }: StickerIconProps) {
  return (
    <img
      src={imagePath}
      alt={name}
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
