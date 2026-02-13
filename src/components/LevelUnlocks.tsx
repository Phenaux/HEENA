import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface LevelUnlock {
  level: number;
  feature: string;
  description: string;
  icon: string;
}

const LEVEL_UNLOCKS: LevelUnlock[] = [
  { level: 5, feature: "Mode-Specific Theme", description: "Unlock a unique theme for your mode", icon: "🎨" },
  { level: 10, feature: "Advanced Analytics", description: "Detailed progress charts and insights", icon: "📊" },
  { level: 15, feature: "Custom Notifications", description: "Personalized task reminders", icon: "🔔" },
  { level: 20, feature: "Streak Milestones", description: "Celebrate your consistency", icon: "🔥" },
  { level: 25, feature: "Progress Sync", description: "Cloud backup of your progress", icon: "☁️" },
  { level: 30, feature: "Habit Templates", description: "Pre-made task templates", icon: "📋" },
  { level: 35, feature: "Motivational Messages", description: "AI-powered daily motivation", icon: "💪" },
  { level: 40, feature: "Unlimited Tasks", description: "No restrictions on task creation", icon: "♾️" },
  { level: 45, feature: "Community Features", description: "Connect and compete with others", icon: "👥" },
  { level: 50, feature: "Master Mode Unlocked", description: "The ultimate achievement", icon: "👑" },
];

interface Props {
  level: number;
}

export const LevelUnlocks = ({ level }: Props) => {
  const nextUnlocks = LEVEL_UNLOCKS.filter((u) => u.level > level).slice(0, 3);
  const currentUnlocks = LEVEL_UNLOCKS.filter((u) => u.level <= level);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Next Unlocks
        </h3>
        <div className="space-y-2">
          {nextUnlocks.length > 0 ? (
            nextUnlocks.map((unlock, i) => (
              <motion.div
                key={unlock.level}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 border border-accent/10"
              >
                <span className="text-lg">{unlock.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{unlock.feature}</p>
                  <p className="text-[10px] text-muted-foreground">Level {unlock.level}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              You've unlocked everything! You're a master! 👑
            </p>
          )}
        </div>
      </div>

      {currentUnlocks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Unlocked ({currentUnlocks.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {currentUnlocks.map((unlock) => (
              <div
                key={unlock.level}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="text-sm">{unlock.icon}</span>
                <span className="text-[10px] font-medium text-primary">{unlock.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
