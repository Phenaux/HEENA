import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, type IdentityPath } from "@/store/useAppStore";
import { Brain, Zap, BookOpen, Shield } from "lucide-react";

const paths: { id: IdentityPath; label: string; icon: typeof Brain; sub: string }[] = [
  { id: "scholar", label: "Scholar Mode", icon: BookOpen, sub: "Study & Knowledge" },
  { id: "warrior", label: "Warrior Mode", icon: Zap, sub: "Train & Build" },
  { id: "focus", label: "Focus Mode", icon: Brain, sub: "Deep Work & Productivity" },
  { id: "discipline", label: "Discipline Mode", icon: Shield, sub: "Daily Habits & Control" },
];

const Onboarding = () => {
  const [selected, setSelected] = useState<IdentityPath | null>(null);
  const setIdentity = useAppStore((s) => s.setIdentity);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selected) return;
    setIdentity(selected);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            What do you want to become?
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your transformation path. This defines your journey.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {paths.map((path, i) => {
            const Icon = path.icon;
            const isSelected = selected === path.id;
            return (
              <motion.button
                key={path.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                onClick={() => setSelected(path.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-300 h-40 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg scale-105"
                    : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <Icon
                  className={`w-8 h-8 transition-colors duration-300 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div className="text-center">
                  <p className={`text-sm font-bold ${isSelected ? "text-foreground" : "text-secondary-foreground"}`}>
                    {path.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{path.sub}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            🧠 Scholar: Master subjects & exams<br/>
            🏋️ Warrior: Build strength & fitness<br/>
            🎯 Focus: Deep work & productivity<br/>
            🧱 Discipline: Daily habits & control
          </p>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleContinue}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Begin Your Journey
            </motion.button>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-muted-foreground text-center">
          This isn't just task management.<br/>
          This is transformation.
        </p>
      </motion.div>
    </div>
  );
};

export default Onboarding;
