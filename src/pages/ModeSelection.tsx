import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, type AppMode } from "@/store/useAppStore";
import { Shield, Sparkles } from "lucide-react";

const modes: { id: AppMode; label: string; icon: typeof Shield; sub: string; detail: string }[] = [
  {
    id: "anonymous",
    label: "Anonymous",
    icon: Shield,
    sub: "Full privacy",
    detail: "No data leaves your device. Everything stays local.",
  },
  {
    id: "ai",
    label: "AI Integrated",
    icon: Sparkles,
    sub: "Smart insights",
    detail: "Some data is read by AI to personalize your experience.",
  },
];

const ModeSelection = () => {
  const [selected, setSelected] = useState<AppMode | null>(null);
  const setMode = useAppStore((s) => s.setMode);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selected) return;
    setMode(selected);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-sm w-full space-y-10"
      >
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            How do you want to use this?
          </h1>
          <p className="text-sm text-muted-foreground">
            Your data, your rules.
          </p>
        </div>

        <div className="space-y-3">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            const isSelected = selected === mode.id;
            return (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                onClick={() => setSelected(mode.id)}
                className={`w-full flex items-start gap-4 p-5 rounded-lg border transition-all duration-300 text-left ${
                  isSelected
                    ? "border-primary/50 bg-primary/5 glow-accent"
                    : "border-border bg-card hover:bg-surface-hover"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 transition-colors duration-300 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <p className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-secondary-foreground"}`}>
                    {mode.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{mode.detail}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleContinue}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-muted-foreground text-center">
          You can change this later.
        </p>
      </motion.div>
    </div>
  );
};

export default ModeSelection;
