import { motion } from "framer-motion";
import { TrendingUp, Flame, Zap, Target } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const PowerRankingSummary = () => {
  const { level, phase, weeklyXpGain, protocols } = useAppStore();
  
  const totalWeeklyXp = weeklyXpGain.reduce((a, b) => a + b, 0);
  const activeDays = weeklyXpGain.filter(x => x > 0).length;
  const completionRate = protocols.length > 0 
    ? Math.round((protocols.filter(p => p.completed).length / protocols.length) * 100)
    : 0;
  const maxStreak = Math.max(...protocols.map(p => p.streak), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6 space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-foreground">Your Power This Week</h3>
        <p className="text-xs text-muted-foreground">How you're performing against your potential</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 p-4 rounded-lg bg-card border border-border"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground font-medium">Weekly XP</p>
          </div>
          <p className="text-2xl font-bold text-primary">{totalWeeklyXp}</p>
          <p className="text-[10px] text-muted-foreground">XP earned this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="space-y-2 p-4 rounded-lg bg-card border border-border"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <p className="text-xs text-muted-foreground font-medium">Active Days</p>
          </div>
          <p className="text-2xl font-bold text-orange-500">{activeDays}/7</p>
          <p className="text-[10px] text-muted-foreground">Days you showed up</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2 p-4 rounded-lg bg-card border border-border"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <p className="text-xs text-muted-foreground font-medium">Streak</p>
          </div>
          <p className="text-2xl font-bold text-green-500">{maxStreak}</p>
          <p className="text-[10px] text-muted-foreground">Current best streak</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="space-y-2 p-4 rounded-lg bg-card border border-border"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-muted-foreground font-medium">Completion</p>
          </div>
          <p className="text-2xl font-bold text-blue-500">{completionRate}%</p>
          <p className="text-[10px] text-muted-foreground">Tasks completed</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
      >
        <p className="text-xs text-muted-foreground mb-2">Your Power Ranking</p>
        <div>
          <p className="text-3xl font-bold text-primary">
            {Math.max(23, Math.min(99, 100 - Math.floor(Math.random() * 30)))}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            percentile of your personal potential
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="space-y-2 text-center"
      >
        {activeDays === 7 && (
          <p className="text-xs text-green-500 font-medium">🔥 Perfect week. Dominating.</p>
        )}
        {activeDays >= 5 && activeDays < 7 && (
          <p className="text-xs text-blue-500 font-medium">💪 Strong consistency. Keep it up.</p>
        )}
        {activeDays >= 3 && activeDays < 5 && (
          <p className="text-xs text-yellow-500 font-medium">⚡ Building momentum. Don't stop now.</p>
        )}
        {activeDays < 3 && (
          <p className="text-xs text-orange-500 font-medium">🌱 You're capable of more. Next week?</p>
        )}
      </motion.div>
    </motion.div>
  );
};
