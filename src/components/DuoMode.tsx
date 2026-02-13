import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, Zap } from "lucide-react";

interface DuoPartner {
  id: string;
  name: string;
  path: "focus" | "health" | "knowledge" | "creativity";
  phase: number;
  streak: number;
  linkedAt: string;
  energyBoost: number;
}

interface DuoModeProps {
  isEnabled: boolean;
  partner?: DuoPartner;
  userStreak: number;
  onLinkPartner: (partnerId: string) => void;
  onUnlink: () => void;
}

const PATH_COLORS = {
  focus: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
  health: "bg-red-500/20 text-red-400 border-red-500/50",
  knowledge: "bg-teal-500/20 text-teal-400 border-teal-500/50",
  creativity: "bg-pink-500/20 text-pink-400 border-pink-500/50",
};

const PATH_LABEL = {
  focus: "The Architect",
  health: "The Guardian",
  knowledge: "The Sage",
  creativity: "The Muse",
};

export const DuoMode = ({
  isEnabled,
  partner,
  userStreak,
  onLinkPartner,
  onUnlink,
}: DuoModeProps) => {
  const [copied, setCopied] = useState(false);
  const [duoCode] = useState(() => `HEEN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(duoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!partner ? (
        // Setup state
        <motion.div
          className="card-raised border-l-4 border-l-primary space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-foreground">Sync with a Friend</h3>
              <p className="text-xs text-muted-foreground">
                Link your account with a friend on the same path to unlock positive peer pressure.
              </p>
            </div>
          </div>

          {/* Share code */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Your Sync Code</p>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-card rounded-lg border border-border text-sm font-mono text-foreground">
                {duoCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Share this code with your friend. They can enter it to sync.
            </p>
          </div>

          {/* Input for partner code */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Enter Partner's Code</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="HEEN-XXXXXXXX"
                className="input-heen flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    onLinkPartner(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button className="btn-primary px-4">Link</button>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground italic">
            💡 Sync with someone on the same path for stronger energy boosts.
          </p>
        </motion.div>
      ) : (
        // Partner linked state
        <motion.div
          className={`card-raised border-l-4 space-y-4 ${PATH_COLORS[partner.path]}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Partner header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold">Synced with {partner.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {PATH_LABEL[partner.path]} • Phase {partner.phase}
              </p>
            </div>
          </div>

          {/* Partnership stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Your streak */}
            <motion.div
              className="text-center p-3 bg-background/50 rounded-lg"
              animate={{
                boxShadow: userStreak > 0 ? "0 0 20px rgba(16, 185, 129, 0.3)" : "none",
              }}
            >
              <p className="text-xs text-muted-foreground">Your Streak</p>
              <p className="text-xl font-bold text-green-400">{userStreak}d 🔥</p>
            </motion.div>

            {/* Energy boost indicator */}
            <motion.div
              className="text-center p-3 bg-background/50 rounded-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-xs text-muted-foreground">Energy Boost</p>
              <p className="text-xl font-bold text-amber-400">+{partner.energyBoost}%</p>
            </motion.div>

            {/* Partner streak */}
            <motion.div
              className="text-center p-3 bg-background/50 rounded-lg"
              animate={{
                boxShadow: partner.streak > 0 ? "0 0 20px rgba(16, 185, 129, 0.3)" : "none",
              }}
            >
              <p className="text-xs text-muted-foreground">Partner Streak</p>
              <p className="text-xl font-bold text-green-400">{partner.streak}d 🔥</p>
            </motion.div>
          </div>

          {/* How it works */}
          <div className="space-y-2 p-3 bg-background/50 rounded-lg">
            <p className="text-xs font-semibold text-foreground">How This Works</p>
            <ul className="text-[10px] text-muted-foreground space-y-1">
              <li>✓ Both complete today: You both get +10% XP boost</li>
              <li>✓ You complete, partner misses: Streak "flickers" but survives</li>
              <li>✓ 7-day aligned streak: Unlock exclusive "Duo" cosmetics</li>
            </ul>
          </div>

          {/* Unlink button */}
          <button
            onClick={onUnlink}
            className="w-full px-3 py-2 text-xs font-medium text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Unlink Partnership
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DuoMode;
