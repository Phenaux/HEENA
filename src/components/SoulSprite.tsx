import { useMemo } from "react";
import { motion } from "framer-motion";

interface SoulSpriteProps {
  phase: number;
  totalXp: number;
  xpToNextPhase: number;
}

const PHASE_CONFIG = {
  1: {
    emoji: "✨",
    label: "Spark",
    color: "#A78BFA",
    size: "text-6xl",
    scale: 0.5,
    opacity: 0.4,
  },
  2: {
    emoji: "🔷",
    label: "Core",
    color: "#6366F1",
    size: "text-7xl",
    scale: 0.7,
    opacity: 0.6,
  },
  3: {
    emoji: "🌀",
    label: "Spiral",
    color: "#14B8A6",
    size: "text-8xl",
    scale: 0.85,
    opacity: 0.8,
  },
  4: {
    emoji: "💎",
    label: "Gem",
    color: "#EC4899",
    size: "text-8xl",
    scale: 0.95,
    opacity: 0.95,
  },
  5: {
    emoji: "∧",
    label: "Ascendant",
    color: "#F59E0B",
    size: "text-9xl",
    scale: 1,
    opacity: 1,
  },
} as const;

export const SoulSprite = ({ phase, totalXp, xpToNextPhase }: SoulSpriteProps) => {
  const config = PHASE_CONFIG[Math.min(phase, 5) as keyof typeof PHASE_CONFIG];
  const xpPercent = (totalXp / xpToNextPhase) * 100;

  const soulVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: config.scale,
      opacity: config.opacity,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    levelUp: {
      scale: [config.scale, config.scale * 1.2, config.scale],
      opacity: [config.opacity, 1, config.opacity],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
      },
    },
  };

  const glowVariants = {
    pulse: {
      boxShadow: [
        `0 0 20px ${config.color}40`,
        `0 0 60px ${config.color}80`,
        `0 0 20px ${config.color}40`,
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Soul Sprite */}
      <motion.div
        className="relative w-32 h-32 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={soulVariants}
      >
        {/* Glow background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: config.color, opacity: 0.1 }}
          variants={glowVariants}
          animate={phase === 5 ? "pulse" : undefined}
        />

        {/* Soul emoji/symbol */}
        <span
          className={`${config.size} font-bold drop-shadow-lg`}
          style={{ color: config.color }}
        >
          {config.emoji}
        </span>

        {/* Orbiting particles for higher phases */}
        {phase >= 3 && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            {[0, 120, 240].map((angle) => (
              <div
                key={angle}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: config.color,
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translateX(50px) translateY(-50%)`,
                  opacity: 0.6,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Phase Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Phase {phase}
          </span>
          {phase === 5 && <span className="text-lg">👑</span>}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{config.label}</h2>
      </div>

      {/* XP Progress to next phase (Skip if Ascension) */}
      {phase < 5 && (
        <div className="w-full max-w-xs space-y-2">
          {/* Progress bar */}
          <div className="xp-bar-container">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${xpPercent}%` }}
            />
          </div>

          {/* XP text */}
          <div className="text-center text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-primary">
              {totalXp.toLocaleString()} / {xpToNextPhase.toLocaleString()} XP
            </span>
            <div className="text-[10px] mt-1">
              {Math.round(xpPercent)}% to Phase {phase + 1}
            </div>
          </div>
        </div>
      )}

      {/* Ascension message */}
      {phase === 5 && (
        <motion.div
          className="text-center space-y-1"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-sm font-semibold text-amber-400">
            🌟 Peak Mastery Achieved 🌟
          </p>
          <p className="text-xs text-muted-foreground">
            Total XP: {totalXp.toLocaleString()}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SoulSprite;
