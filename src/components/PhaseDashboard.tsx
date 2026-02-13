import { motion } from "framer-motion";
import { SoulSprite } from "@/components/SoulSprite";

interface PhaseDashboardProps {
  phase: number;
  totalXp: number;
  xpToNextPhase: number;
}

const PHASE_NAMES = ["", "Awareness", "Discipline", "Momentum", "Mastery", "Ascension"];

const PHASE_COLORS = {
  1: "#A78BFA",  // Purple
  2: "#6366F1",  // Indigo
  3: "#14B8A6",  // Teal
  4: "#EC4899",  // Pink
  5: "#F59E0B",  // Amber
};

export const PhaseDashboard = ({ phase, totalXp, xpToNextPhase }: PhaseDashboardProps) => {
  const phaseColor = PHASE_COLORS[phase as keyof typeof PHASE_COLORS] || PHASE_COLORS[1];

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-6">

      {/* Phase Header + Character Container - Surface Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg p-3 relative overflow-hidden border border-border"
        style={{
          background: `linear-gradient(135deg, var(--card), rgba(${parseInt(phaseColor.slice(1,3), 16)}, ${parseInt(phaseColor.slice(3,5), 16)}, ${parseInt(phaseColor.slice(5,7), 16)}, 0.05))`,
          borderLeftWidth: "3px",
          borderLeftColor: phaseColor,
        }}
      >
        <div className="space-y-2">
          {/* Phase Info */}
          <div>
            <p 
              className="text-[9px] font-semibold uppercase tracking-widest"
              style={{ color: phaseColor }}
            >
              Phase {phase}
            </p>
            <h1 className="text-base font-bold text-foreground">
              {PHASE_NAMES[phase] || `Phase ${phase}`}
            </h1>
          </div>

          {/* Character Sprite */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex justify-center py-1"
          >
            <div className="w-16 h-16">
              <SoulSprite phase={phase} totalXp={totalXp} xpToNextPhase={xpToNextPhase} />
            </div>
          </motion.div>

          {/* XP Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div 
              className="relative h-1.5 bg-muted rounded-full overflow-hidden"
              style={{
                boxShadow: `0 0 12px ${phaseColor}30 inset`,
              }}
            >
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${(totalXp / xpToNextPhase) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}cc)`,
                  boxShadow: `0 0 12px ${phaseColor}60`,
                }}
              />
            </div>
            <p className="text-[8px] text-muted-foreground mt-0.5">
              {totalXp} / {xpToNextPhase} XP
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Today's Date */}
      <div className="text-center px-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
          Today
        </p>
        <p className="text-xs font-semibold text-foreground">{formatFullDate(new Date())}</p>
      </div>

      {/* Calendar is shown on the Report page only */}
    </div>
  );
};
