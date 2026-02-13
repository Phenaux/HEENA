import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import XPBar from "@/components/XPBar";

const PHASE_NAMES = ["", "Awareness", "Discipline", "Momentum", "Mastery", "Ascension"];

const PhaseLevel = () => {
  const { phase, totalXp, xpToNextPhase } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xs w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <motion.p
            className="text-xs text-muted-foreground uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Current Phase
          </motion.p>
          <motion.h1
            className="text-6xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {phase}
          </motion.h1>
          <motion.p
            className="text-sm text-primary font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {PHASE_NAMES[phase] || `Phase ${phase}`}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <XPBar current={totalXp} max={xpToNextPhase} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          {phase < 5 ? (
            <p className="text-[10px] text-muted-foreground">
              {xpToNextPhase - totalXp} XP until Phase {phase + 1}
            </p>
          ) : (
            <p className="text-[10px] text-primary animate-subtle-pulse">
              Maximum phase reached
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PhaseLevel;
