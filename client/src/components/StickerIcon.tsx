import { useState } from "react";

interface StickerIconProps {
  imagePath: string;
  name: string;
  size?: number;
}

function renderKawaiiGraphic(name: string, size: number) {
  const n = name.toLowerCase();
  const iconSize = size * 0.7;
  const center = iconSize / 2;

  // Coin shop items: dibujados a mano en SVG, uno por tipo.
  // Trabajamos con el nombre original para distinguirlos bien.
  switch (name) {
    // Valentine's / Mother's Day hearts, mugs, balloons, confetti...
    case "Heart Balloons":
    case "Heart Balloons Mum":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <defs>
            <linearGradient id="heartBalloon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9fd3" />
              <stop offset="100%" stopColor="#ff4d6d" />
            </linearGradient>
          </defs>
          <g transform="translate(8,4)">
            <path
              d="M16 10c-4-6-12-5-14 1-2 6 2 11 7 15l7 6 7-6c5-4 9-9 7-15-2-6-10-7-14-1z"
              fill="url(#heartBalloon)"
              stroke="#e63950"
              strokeWidth="2"
            />
            <path d="M23 32 C 20 40, 26 46, 22 54" stroke="#e77f67" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="54" r="2" fill="#e77f67" />
          </g>
        </svg>
      );
    case "Rose Petals":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <defs>
            <radialGradient id="petalGrad" cx="0.5" cy="0.3" r="0.7">
              <stop offset="0%" stopColor="#ffe0f0" />
              <stop offset="100%" stopColor="#ff4d6d" />
            </radialGradient>
          </defs>
          <g transform="translate(6,8)">
            <path d="M10 8c4-4 10-4 14 0 4 4 4 10 0 14-4 4-5 8-7 8s-3-4-7-8c-4-4-4-10 0-14z" fill="url(#petalGrad)" />
            <path d="M24 6c3-3 7-3 10 0 3 3 3 7 0 10-3 3-4 6-5 6s-2-3-5-6c-3-3-3-7 0-10z" fill="#ff809b" opacity="0.9" />
            <path d="M14 30c4 4 8 4 12 0" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );
    case "Love Confetti":
    case "Flower Confetti":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="12" y="10" width="16" height="32" rx="4" fill="#ffb3c1" />
          <rect x="28" y="14" width="18" height="10" rx="3" fill="#ffe066" />
          <circle cx="20" cy="46" r="3" fill="#ff6b6b" />
          <circle cx="30" cy="52" r="2.5" fill="#74c0fc" />
          <circle cx="40" cy="44" r="2.5" fill="#ffd43b" />
          <path d="M38 34l4 8" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 30l-4 7" stroke="#845ef7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Couple Silhouette":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <circle cx="22" cy="20" r="7" fill="#ffd6a5" />
          <circle cx="40" cy="20" r="7" fill="#ffe8cc" />
          <path d="M14 38c2-7 16-7 18 0v6H14z" fill="#ff8fa3" />
          <path d="M32 38c2-7 16-7 18 0v6H32z" fill="#ffb5a7" />
          <path d="M16 18c1-4 6-8 11-8" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 18c-1-4-6-8-11-8" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Romantic Candle":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="22" y="20" width="18" height="26" rx="4" fill="#ffe5b4" />
          <rect x="24" y="22" width="14" height="22" rx="3" fill="#fff5d6" />
          <path d="M31 18c0-3 2-5 4-7-3 0-6 2-7 5-.5 2.5 1 4 3 4z" fill="#ff9f1c" />
          <circle cx="32" cy="48" r="4" fill="#ff4d6d" opacity="0.7" />
        </svg>
      );

    // Easter
    case "Candy Eggs Jar":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="18" y="18" width="28" height="28" rx="10" fill="#e0fbff" stroke="#90e0ef" strokeWidth="2" />
          <circle cx="26" cy="30" r="4" fill="#ffadad" />
          <circle cx="38" cy="32" r="4" fill="#fdffb6" />
          <circle cx="30" cy="40" r="3.5" fill="#caffbf" />
          <rect x="22" y="14" width="20" height="6" rx="3" fill="#90e0ef" />
        </svg>
      );
    case "Easter Ribbon":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M16 24c8-8 24-8 32 0-4 6-10 10-16 10S20 30 16 24z" fill="#ffb3c1" />
          <circle cx="32" cy="26" r="6" fill="#ff4d6d" />
          <path d="M24 30l-4 14 6-4 4 6 2-12z" fill="#ffb3c1" />
          <path d="M40 30l4 14-6-4-4 6-2-12z" fill="#ffb3c1" />
        </svg>
      );
    case "Carrot Garland":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M10 18c14 8 30 8 44 0" stroke="#94d2bd" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(14,20)">
            <path d="M4 0L0 14c3 2 5 2 8 0L4 0z" fill="#f8961e" />
            <path d="M4 -2c2-2 4-3 6-3" stroke="#52b788" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g transform="translate(28,20)">
            <path d="M4 0L0 14c3 2 5 2 8 0L4 0z" fill="#f8961e" />
            <path d="M4 -2c2-2 4-3 6-3" stroke="#52b788" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g transform="translate(42,20)">
            <path d="M4 0L0 14c3 2 5 2 8 0L4 0z" fill="#f8961e" />
            <path d="M4 -2c2-2 4-3 6-3" stroke="#52b788" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "Bunny Footprints":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <ellipse cx="20" cy="40" rx="6" ry="8" fill="#ffc9de" />
          <circle cx="17" cy="32" r="2.5" fill="#ff8fab" />
          <circle cx="23" cy="32" r="2.5" fill="#ff8fab" />
          <ellipse cx="40" cy="24" rx="6" ry="8" fill="#ffc9de" />
          <circle cx="37" cy="16" r="2.5" fill="#ff8fab" />
          <circle cx="43" cy="16" r="2.5" fill="#ff8fab" />
        </svg>
      );
    case "Pastel Gift Bag":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="18" y="22" width="28" height="24" rx="5" fill="#bde0fe" />
          <path d="M22 22c2-5 6-8 10-8s8 3 10 8" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M24 30h16" stroke="#ffafcc" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // Spring Sale
    case "Butterfly Stickers":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <circle cx="22" cy="26" r="8" fill="#ffc8dd" />
          <circle cx="42" cy="26" r="8" fill="#bde0fe" />
          <circle cx="24" cy="40" r="7" fill="#ffafcc" />
          <circle cx="40" cy="40" r="7" fill="#a3c4f3" />
          <rect x="30" y="26" width="4" height="14" rx="2" fill="#ff8fa3" />
        </svg>
      );
    case "Pastel Shopping Bag":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="18" y="22" width="28" height="24" rx="5" fill="#a8e6cf" />
          <path d="M22 24c2-4 6-6 10-6s8 2 10 6" stroke="#118ab2" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="32" r="2.5" fill="#ff6b6b" />
          <circle cx="36" cy="32" r="2.5" fill="#ffd166" />
        </svg>
      );
    case "Garden Lantern":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="24" y="14" width="16" height="6" rx="3" fill="#f4a261" />
          <rect x="20" y="20" width="24" height="22" rx="6" fill="#ffe8a3" stroke="#f4a261" strokeWidth="2" />
          <path d="M24 30h16" stroke="#f4a261" strokeWidth="2" />
          <path d="M32 42v6" stroke="#b5651d" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Rain Boots":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M20 18h10v22H18v-6c0-4 1-8 2-16z" fill="#4dabf7" />
          <path d="M30 32h12v12H28v-4c0-4 1-5 2-8z" fill="#4dabf7" />
          <rect x="16" y="40" width="30" height="4" rx="2" fill="#1c7ed6" />
        </svg>
      );

    // Mother's Day
    case "Heart Mug":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="18" y="24" width="22" height="18" rx="4" fill="#ffe5ec" />
          <path d="M40 26c4 0 6 2 6 6s-2 6-6 6" stroke="#ff6b81" strokeWidth="2" fill="none" />
          <path
            d="M26 30c-2-3-6-3-8 0-2 3 0 6 3 8l5 4 5-4c3-2 5-5 3-8-2-3-6-3-8 0z"
            fill="#ff4d6d"
          />
        </svg>
      );
    case "Flower Vase":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M26 22h12l-3 16c-1 4-5 6-6 6s-5-2-6-6z" fill="#ffe066" />
          <circle cx="24" cy="16" r="4" fill="#ff8fa3" />
          <circle cx="32" cy="14" r="4" fill="#ffb3c1" />
          <circle cx="40" cy="16" r="4" fill="#ffc8dd" />
          <path d="M24 18v-6M32 16v-6M40 18v-6" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Gift Basket":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="16" y="26" width="32" height="18" rx="6" fill="#f4a261" />
          <path d="M20 26c2-6 8-10 12-10s10 4 12 10" stroke="#c97a40" strokeWidth="2" fill="none" />
          <circle cx="24" cy="30" r="3" fill="#ffafcc" />
          <circle cx="32" cy="30" r="3" fill="#ffd166" />
          <circle cx="40" cy="30" r="3" fill="#a8dadc" />
        </svg>
      );
    case "Mum Lettering":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="14" y="18" width="36" height="26" rx="6" fill="#ffe5ec" />
          <text x="32" y="35" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fill="#f72585">
            Mum
          </text>
        </svg>
      );

    // Summer Sale
    case "Seashell Garland":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M8 16c16 10 32 10 48 0" stroke="#90e0ef" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(14,22)">
            <path d="M6 0C1 3 0 8 2 12c2 4 4 4 6 4s4 0 6-4C16 8 15 3 10 0z" fill="#ffe29a" />
          </g>
          <g transform="translate(30,24)">
            <path d="M6 0C1 3 0 8 2 12c2 4 4 4 6 4s4 0 6-4C16 8 15 3 10 0z" fill="#ffd6a5" />
          </g>
          <g transform="translate(44,22)">
            <path d="M6 0C1 3 0 8 2 12c2 4 4 4 6 4s4 0 6-4C16 8 15 3 10 0z" fill="#ffadad" />
          </g>
        </svg>
      );
    case "Ice Lolly":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="22" y="14" width="16" height="24" rx="8" fill="#ffb3c1" />
          <rect x="26" y="38" width="8" height="10" rx="2" fill="#f4a261" />
          <path d="M22 22h16" stroke="#ffe5ec" strokeWidth="2" />
        </svg>
      );
    case "Beach Umbrella":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M32 10L16 26h32z" fill="#ffbe0b" />
          <path d="M32 10L24 26h16z" fill="#ff6b6b" />
          <path d="M32 26v22" stroke="#8d99ae" strokeWidth="2" />
          <path d="M18 46c6-4 20-4 26 0" stroke="#f4a261" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "Flip-flop Trail":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M20 20c4-4 10-4 12 0 2 4-1 10-4 14-4 4-6 2-8-2-1-3-2-6 0-12z" fill="#ff6b6b" />
          <path d="M24 20c2-2 5-2 6 0" stroke="#ffe066" strokeWidth="2" strokeLinecap="round" />
          <path d="M34 30c4-4 10-4 12 0 2 4-1 10-4 14-4 4-6 2-8-2-1-3-2-6 0-12z" fill="#ff8fab" />
          <path d="M38 30c2-2 5-2 6 0" stroke="#ffe066" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Sun Hat":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <ellipse cx="32" cy="38" rx="18" ry="8" fill="#ffe29a" />
          <ellipse cx="32" cy="34" rx="10" ry="6" fill="#f4a261" />
          <rect x="24" y="24" width="16" height="10" rx="4" fill="#ffe29a" />
          <circle cx="38" cy="26" r="3" fill="#ff4d6d" />
        </svg>
      );

    // Back to School
    case "Highlighter Pack":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="16" y="22" width="10" height="20" rx="2" fill="#ffd166" />
          <rect x="27" y="20" width="10" height="22" rx="2" fill="#ff6b6b" />
          <rect x="38" y="22" width="10" height="20" rx="2" fill="#4dabf7" />
        </svg>
      );
    case "Notebook Stack":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="16" y="20" width="30" height="18" rx="3" fill="#bde0fe" />
          <rect x="18" y="24" width="26" height="2" fill="#1d3557" />
          <rect x="18" y="38" width="30" height="4" rx="2" fill="#ffafcc" />
          <rect x="18" y="32" width="26" height="2" fill="#1d3557" />
        </svg>
      );
    case "Pencil Jar":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="20" y="26" width="20" height="18" rx="4" fill="#ffe066" />
          <path d="M24 26l2-10 4 10M32 26l2-10 4 10" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "School Locker":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="20" y="16" width="20" height="30" rx="3" fill="#1a3a5c" />
          <rect x="24" y="20" width="12" height="2" fill="#f1faee" />
          <rect x="24" y="26" width="12" height="2" fill="#f1faee" />
          <circle cx="38" cy="30" r="1.5" fill="#f1faee" />
        </svg>
      );
    case "Alarm Clock":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="12" fill="#ffe5ec" stroke="#ff6b6b" strokeWidth="2" />
          <path d="M32 26v6l4 3" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="20" r="4" fill="#ff6b6b" />
          <circle cx="40" cy="20" r="4" fill="#ff6b6b" />
        </svg>
      );

    // Halloween
    case "Jack-o-lantern Row":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M16 30c0-8 6-14 16-14s16 6 16 14-6 14-16 14-16-6-16-14z" fill="#f58549" />
          <path d="M26 32l4 3 4-3" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round" />
          <circle cx="26" cy="28" r="2" fill="#2c2c2c" />
          <circle cx="38" cy="28" r="2" fill="#2c2c2c" />
        </svg>
      );
    case "Spooky Window":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="18" y="18" width="28" height="28" rx="4" fill="#4a0080" />
          <path d="M18 32h28" stroke="#ffc8dd" strokeWidth="2" />
          <path d="M32 18v28" stroke="#ffc8dd" strokeWidth="2" />
          <circle cx="26" cy="24" r="2" fill="#fffff0" />
          <circle cx="38" cy="40" r="3" fill="#fffff0" />
        </svg>
      );
    case "Candy Bucket":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="20" y="24" width="24" height="18" rx="6" fill="#e76f51" />
          <path d="M22 24c2-5 6-8 10-8s8 3 10 8" stroke="#2c2c2c" strokeWidth="2" fill="none" />
          <circle cx="26" cy="28" r="3" fill="#ffbe0b" />
          <circle cx="36" cy="30" r="3" fill="#ffafcc" />
        </svg>
      );
    case "Flying Bats":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M16 34c4-4 8-6 16-6s12 2 16 6c-4-2-8-2-16-2s-12 0-16 2z" fill="#2c2c2c" />
          <path d="M24 28l4-4 4 4" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="32" r="1" fill="#ffb703" />
          <circle cx="36" cy="32" r="1" fill="#ffb703" />
        </svg>
      );
    case "Cobweb Corner":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M14 14h24v24" stroke="#6c757d" strokeWidth="2" />
          <path d="M14 14l24 24" stroke="#adb5bd" strokeWidth="1.5" />
          <path d="M26 14l12 12M14 26l12 12" stroke="#adb5bd" strokeWidth="1.5" />
        </svg>
      );

    // Black Friday
    case "Neon SALE Sign":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="14" y="20" width="36" height="20" rx="4" fill="#111827" />
          <rect x="16" y="22" width="32" height="16" rx="3" fill="#111827" stroke="#ff4d6d" strokeWidth="2" />
          <text x="32" y="34" textAnchor="middle" fontSize="12" fontFamily="sans-serif" fill="#ff4d6d">
            SALE
          </text>
        </svg>
      );
    case "Shopping Cart":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path d="M18 20h4l4 18h18l4-12H30" stroke="#6c757d" strokeWidth="2" fill="none" />
          <circle cx="28" cy="42" r="3" fill="#6c757d" />
          <circle cx="40" cy="42" r="3" fill="#6c757d" />
        </svg>
      );
    case "Receipt Roll":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="22" y="16" width="18" height="26" rx="4" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="2" />
          <path d="M24 22h10M24 26h8M24 30h12M24 34h6" stroke="#adb5bd" strokeWidth="2" />
        </svg>
      );
    case "Big Arrow Sign":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="16" y="22" width="24" height="16" rx="4" fill="#4dabf7" />
          <path d="M30 30h8l-4-4m4 4l-4 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Spotlight Stand":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <circle cx="32" cy="22" r="6" fill="#ffe066" />
          <path d="M32 28v12" stroke="#495057" strokeWidth="2" />
          <path d="M24 46h16" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // Christmas
    case "Snow Globe":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <circle cx="32" cy="26" r="12" fill="#e0fbff" stroke="#90e0ef" strokeWidth="2" />
          <rect x="22" y="34" width="20" height="8" rx="3" fill="#495057" />
          <circle cx="28" cy="24" r="1.5" fill="#ffffff" />
          <circle cx="34" cy="22" r="1.5" fill="#ffffff" />
          <circle cx="36" cy="28" r="1.5" fill="#ffffff" />
        </svg>
      );
    case "Gift Stack":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="22" y="30" width="20" height="12" rx="2" fill="#e63946" />
          <rect x="24" y="26" width="16" height="6" rx="2" fill="#ffb3c1" />
          <path d="M32 22c-2-3-6-3-8 0 2 2 4 3 8 3 4 0 6-1 8-3-2-3-6-3-8 0z" fill="#ffd166" />
        </svg>
      );
    case "Christmas Star":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <path
            d="M32 14l4.2 9.2 10.3 1.1-7.7 7 2 10.3L32 36.4 23.2 41.6l2-10.3-7.7-7 10.3-1.1z"
            fill="#ffd700"
          />
        </svg>
      );
    case "Toy Train":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <rect x="16" y="26" width="22" height="10" rx="2" fill="#2d6a4f" />
          <rect x="32" y="22" width="12" height="8" rx="2" fill="#40916c" />
          <circle cx="22" cy="40" r="3" fill="#ffbe0b" />
          <circle cx="32" cy="40" r="3" fill="#ffbe0b" />
          <circle cx="40" cy="40" r="3" fill="#ffbe0b" />
        </svg>
      );
    case "Gingerbread Man":
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
          <circle cx="32" cy="20" r="6" fill="#d2691e" />
          <circle cx="30" cy="18" r="1" fill="#ffffff" />
          <circle cx="34" cy="18" r="1" fill="#ffffff" />
          <path d="M32 26c-6 0-10 4-10 8h6v10h8V34h6c0-4-4-8-10-8z" fill="#d2691e" />
          <circle cx="32" cy="30" r="1.5" fill="#ffffff" />
          <circle cx="32" cy="34" r="1.5" fill="#ffffff" />
        </svg>
      );
  }

  // Fallback genérico: usaremos un emoji sencillo si no hay SVG específico.
  const baseSize = size * 0.55;
  return (
    <span role="img" aria-hidden="true" style={{ fontSize: baseSize }}>
      {getEmojiForName(name)}
    </span>
  );
}

function getEmojiForName(name: string): string {
  const n = name.toLowerCase();
  // Exact matches for shop items so each one is clearly identifiable.
  switch (name) {
    // Valentine's
    case "Heart Balloons":
    case "Heart Balloons Mum":
      return "🎈";
    case "Rose Petals":
      return "🌹";
    case "Love Confetti":
    case "Flower Confetti":
      return "🎊";
    case "Couple Silhouette":
      return "💑";
    case "Romantic Candle":
      return "🕯️";

    // Easter
    case "Candy Eggs Jar":
      return "🍬";
    case "Easter Ribbon":
      return "🎀";
    case "Carrot Garland":
      return "🥕";
    case "Bunny Footprints":
      return "🐾";
    case "Pastel Gift Bag":
      return "🛍️";

    // Spring Sale
    case "Butterfly Stickers":
      return "🦋";
    case "Pastel Shopping Bag":
      return "🛍️";
    case "Garden Lantern":
      return "🏮";
    case "Rain Boots":
      return "👢";

    // Mother's Day
    case "Heart Mug":
      return "☕";
    case "Flower Vase":
      return "🌷";
    case "Gift Basket":
      return "🧺";
    case "Mum Lettering":
      return "💖";

    // Summer Sale
    case "Seashell Garland":
      return "🐚";
    case "Ice Lolly":
      return "🍭";
    case "Beach Umbrella":
      return "⛱️";
    case "Flip-flop Trail":
      return "🩴";
    case "Sun Hat":
      return "👒";

    // Back to School
    case "Highlighter Pack":
      return "🖍️";
    case "Notebook Stack":
      return "📚";
    case "Pencil Jar":
      return "✏️";
    case "School Locker":
      return "🗄️";
    case "Alarm Clock":
      return "⏰";

    // Halloween
    case "Jack-o-lantern Row":
      return "🎃";
    case "Spooky Window":
      return "👻";
    case "Candy Bucket":
      return "🍬";
    case "Flying Bats":
      return "🦇";
    case "Cobweb Corner":
      return "🕸️";

    // Black Friday
    case "Neon SALE Sign":
      return "💸";
    case "Shopping Cart":
      return "🛒";
    case "Receipt Roll":
      return "🧾";
    case "Big Arrow Sign":
      return "➡️";
    case "Spotlight Stand":
      return "💡";

    // Christmas
    case "Snow Globe":
      return "❄️";
    case "Gift Stack":
      return "🎁";
    case "Christmas Star":
      return "⭐";
    case "Toy Train":
      return "🚂";
    case "Gingerbread Man":
      return "🍪";
  }

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
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {renderKawaiiGraphic(name, size * 0.7)}
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
