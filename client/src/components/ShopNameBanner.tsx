import { useEffect } from "react";
import { dismissHint } from "@/lib/progress";

interface ShopNameBannerProps {
  onDismiss: () => void;
}

export function ShopNameBanner({ onDismiss }: ShopNameBannerProps) {
  useEffect(() => {
    const el = document.getElementById("shop-name-sign");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleDismiss = () => {
    dismissHint("shop_name");
    onDismiss();
  };

  return (
    <div
      className="fixed top-14 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-2 border-amber-400 bg-amber-50 text-amber-900 max-w-md"
      style={{ fontFamily: "'Architects Daughter', cursive" }}
      data-testid="shop-name-banner"
    >
      <span className="text-sm font-bold flex-1">
        You can change the shop name here: <span className="text-amber-700">.....'S BOOKSHOP</span>
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm"
        data-testid="button-dismiss-shop-banner"
      >
        Got it
      </button>
    </div>
  );
}
