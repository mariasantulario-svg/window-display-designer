import { useEffect } from "react";
import { setSelectSeasonBannerDismissed } from "@/lib/progress";

interface SelectSeasonBannerProps {
  onDismiss: () => void;
}

export function SelectSeasonBanner({ onDismiss }: SelectSeasonBannerProps) {
  useEffect(() => {
    const el = document.getElementById("season-selector");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleDismiss = () => {
    setSelectSeasonBannerDismissed();
    onDismiss();
  };

  return (
    <div
      className="fixed top-14 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-2 border-blue-400 bg-blue-50 text-blue-900 max-w-md"
      style={{ fontFamily: "'Architects Daughter', cursive" }}
      data-testid="select-season-banner"
    >
      <span className="text-sm font-bold flex-1">
        Selecciona la season
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm"
        data-testid="button-dismiss-season-banner"
      >
        Entendido
      </button>
    </div>
  );
}
