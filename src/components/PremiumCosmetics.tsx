import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Lock, Check } from "lucide-react";

export type ThemeType = "default" | "solar" | "ghost" | "legacy" | "dream";

interface CosmeticPack {
  id: ThemeType;
  name: string;
  description: string;
  icon: string;
  colors: string[];
  unlocked: boolean;
  price?: number;
  preview: string;
}

const COSMETIC_PACKS: CosmeticPack[] = [
  {
    id: "default",
    name: "Natural Gold",
    description: "Clean white, black, and gold. Neutral and timeless.",
    icon: "✨",
    colors: ["#FFFFFF", "#000000", "#D4AF37"],
    unlocked: true,
    preview: "White, black, and gold",
  },
  {
    id: "solar",
    name: "Solar Mode",
    description: "Bright white with gold accents. For morning warriors.",
    icon: "☀️",
    colors: ["#FAFBFC", "#F59E0B", "#FCD34D"],
    unlocked: false,
    price: 2.99,
    preview: "Bright white with warm gold",
  },
  {
    id: "ghost",
    name: "Ghost Mode",
    description: "Ultra-minimalist. Pure black and white. Maximum focus.",
    icon: "👻",
    colors: ["#000000", "#FFFFFF", "#666666"],
    unlocked: false,
    price: 1.99,
    preview: "Pure black and white",
  },
  {
    id: "legacy",
    name: "Legacy (8-bit)",
    description: "Retro 8-bit vibes. For the nostalgic builder.",
    icon: "🎮",
    colors: ["#1A0033", "#9D4EDD", "#FFD60A"],
    unlocked: false,
    price: 4.99,
    preview: "Vivid purple and gold",
  },
  {
    id: "dream",
    name: "Dream Mode",
    description: "Soft, dimmer blues. Perfect for late-night reflection.",
    icon: "💤",
    colors: ["#0A0E27", "#4F46E5", "#06B6D4"],
    unlocked: false,
    price: 1.99,
    preview: "Soft, deep blues",
  },
];

interface PremiumCosmeticsProps {
  currentTheme: ThemeType;
  unlockedThemes: ThemeType[];
  onSelectTheme: (theme: ThemeType) => void;
  onPurchase?: (themeId: ThemeType) => void;
}

export const PremiumCosmetics = ({
  currentTheme,
  unlockedThemes,
  onSelectTheme,
  onPurchase,
}: PremiumCosmeticsProps) => {
  const [previewTheme, setPreviewTheme] = useState<ThemeType>(currentTheme);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-foreground">Identity Packs</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize your HEEN∧ experience with exclusive themes.
        </p>
      </div>

      {/* Grid of cosmetics */}
      <div className="grid grid-cols-1 gap-3">
        {COSMETIC_PACKS.map((pack) => {
          const isUnlocked = unlockedThemes.includes(pack.id);
          const isActive = previewTheme === pack.id;

          return (
            <motion.div
              key={pack.id}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
              onClick={() => isUnlocked && (setPreviewTheme(pack.id), onSelectTheme(pack.id))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{pack.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{pack.name}</h3>
                    <p className="text-xs text-muted-foreground">{pack.description}</p>
                  </div>
                </div>

                {/* Status indicator */}
                {isUnlocked ? (
                  isActive && <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                )}
              </div>

              {/* Color preview */}
              <div className="flex items-center gap-2 mb-3">
                {pack.colors.map((color, i) => (
                  <motion.div
                    key={i}
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: color }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-auto">
                  {pack.preview}
                </span>
              </div>

              {/* Action */}
              {!isUnlocked && pack.price ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPurchase?.(pack.id);
                  }}
                  className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                >
                  Unlock • ${pack.price}
                </button>
              ) : isUnlocked ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTheme(pack.id);
                  }}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-surface-hover"
                  }`}
                >
                  {isActive ? "Active" : "Select"}
                </button>
              ) : null}

              {/* Badge */}
              {pack.id === "default" && (
                <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                  Free
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <p className="text-xs text-muted-foreground">
          💡 All themes are purely cosmetic. Your progress and data remain the same across any theme.
        </p>
      </div>
    </div>
  );
};

export default PremiumCosmetics;
