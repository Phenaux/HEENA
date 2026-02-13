import { motion } from "framer-motion";

interface XPBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
}

const XPBar = ({ current, max, showLabel = true }: XPBarProps) => {
  const percent = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{current} XP</span>
          <span>{max} XP</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-xp-bg overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary glow-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
};

export default XPBar;
