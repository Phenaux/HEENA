import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FailureAnalysisProps {
  open: boolean;
  onClose: () => void;
}

const FAILURE_REASONS = [
  { id: "time", label: "Time", emoji: "⏰", description: "Not enough time available" },
  { id: "motivation", label: "Motivation", emoji: "😪", description: "Lost motivation" },
  { id: "distraction", label: "Distraction", emoji: "📱", description: "Got distracted" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "😰", description: "Felt overwhelmed" },
];

export const FailureAnalysis = ({ open, onClose }: FailureAnalysisProps) => {
  const { recordFailureReason, missionIntent, setMissionIntent, profile } = useAppStore();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  
  useEffect(() => {
    if (!profile?.gender) {
      document.documentElement.style.setProperty('--primary', '45 100% 50%');
      document.documentElement.style.setProperty('--accent', '45 100% 60%');
    }
  }, [profile?.gender]);

  const handleSubmit = () => {
    if (selectedReason) {
      recordFailureReason(selectedReason);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSelectedReason(null);
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${
        isDesktop 
          ? "max-w-5xl w-[95vw] backdrop-blur-md bg-background/80 border border-white/20 dark:border-white/10 shadow-2xl" 
          : "max-w-sm"
      }`}>
        <DialogHeader className={isDesktop ? "space-y-4 pb-2" : ""}>
          <DialogTitle className={`flex items-center gap-3 ${
            isDesktop ? "text-2xl" : ""
          }`}>
            <div className={`p-2 rounded-full ${
              isDesktop 
                ? "bg-yellow-100/20 dark:bg-yellow-900/30" 
                : ""
            }`}>
              <AlertCircle className={`text-yellow-500 ${isDesktop ? "w-7 h-7" : "w-5 h-5"}`} />
            </div>
            Momentum Check
          </DialogTitle>
          <DialogDescription className={isDesktop ? "text-base" : ""}>
            We noticed you've been away. Let's understand why.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`space-y-6 py-6 ${isDesktop ? "px-8" : "px-2"}`}
            >
              <p className={`text-muted-foreground text-center ${
                isDesktop ? "text-lg" : "text-xs"
              }`}>
                Be honest. This helps us adjust your tasks.
              </p>

              <div className={`${
                isDesktop 
                  ? "grid grid-cols-2 gap-6" 
                  : "space-y-2"
              }`}>
                {FAILURE_REASONS.map((reason) => (
                  <motion.button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left space-y-3 ${
                      selectedReason === reason.id
                        ? "border-yellow-500 bg-gradient-to-br from-yellow-50/50 to-yellow-100/20 dark:from-yellow-950/40 dark:to-yellow-900/20 ring-2 ring-yellow-400 shadow-lg backdrop-blur-sm"
                        : "border-border/50 hover:border-yellow-400/80 dark:hover:border-yellow-500/60 bg-white/40 dark:bg-white/5 backdrop-blur-sm"
                    } hover:shadow-lg hover:backdrop-blur-md transition-all duration-300`}
                    whileHover={{ scale: isDesktop ? 1.08 : 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`flex-shrink-0 ${
                        isDesktop ? "text-5xl" : "text-3xl"
                      }`}>{reason.emoji}</span>
                      <div className="flex-1">
                        <span className={`font-semibold block ${
                          isDesktop ? "text-lg" : "text-sm"
                        }`}>
                          {reason.label}
                        </span>
                      </div>
                    </div>
                    <p className={`text-muted-foreground ml-20 ${
                      isDesktop ? "text-sm" : "text-xs"
                    }`}>
                      {reason.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className={`flex gap-4 pt-6 ${isDesktop ? "justify-end" : ""}`}>
                <button
                  onClick={onClose}
                  className={`rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 backdrop-blur-sm ${
                    isDesktop 
                      ? "px-8 py-3 text-base font-medium hover:border-border" 
                      : "flex-1 py-2 px-4 text-xs"
                  }`}
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedReason}
                  className={`rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                    isDesktop 
                      ? "px-8 py-3 text-base disabled:disabled:opacity-30" 
                      : "flex-1 py-2 px-4 text-xs"
                  }`}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center space-y-6 ${
                isDesktop ? "py-20" : "py-12"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`p-4 rounded-full w-fit mx-auto ${
                  isDesktop ? "bg-green-100/20 dark:bg-green-900/30" : ""
                }`}
              >
                <CheckCircle2 className={`text-green-500 mx-auto ${
                  isDesktop ? "w-20 h-20" : "w-12 h-12"
                }`} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`font-semibold text-foreground ${
                  isDesktop ? "text-2xl" : "text-sm"
                }`}
              >
                Got it. We'll adjust.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-muted-foreground ${
                  isDesktop ? "text-lg" : "text-xs"
                }`}
              >
                Coming back is what matters. Let's go.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
