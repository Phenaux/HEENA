import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import React, { useState } from "react";
import type { Protocol, IdentityPath } from "@/store/useAppStore";
import { useAppStore } from "@/store/useAppStore";

interface HabitCardProps {
  protocol: Protocol;
  onToggle: (id: string) => void;
}

const FEEDBACK_MESSAGES: { [key in IdentityPath]: string[] } = {
  scholar: [
    "Knowledge compounded. 📚",
    "Another layer of mastery. 🧠",
    "The network grows. ✨",
    "Synapses firing. 🔥",
  ],
  warrior: [
    "Another rep toward dominance. 💪",
    "Getting stronger. 🔥",
    "Building the beast within. ⚡",
    "Unbreakable. 🛡️",
  ],
  focus: [
    "Attention sharpened. 🎯",
    "Deep work compounds. 💎",
    "That's how it's done. ✨",
    "Flow state achieved. 🌊",
  ],
  discipline: [
    "Character forged. 🧱",
    "Becoming unstoppable. 🚀",
    "Small choices, big results. 💫",
    "You. Are. Iron. 🔩",
  ],
};

const HabitCard = ({ protocol, onToggle }: HabitCardProps) => {
  const { identity } = useAppStore();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleToggle = () => {
    if (!protocol.completed && identity) {
      // Show feedback on completion
      const messages = FEEDBACK_MESSAGES[identity] || [];
      const message = messages[Math.floor(Math.random() * messages.length)];
      setFeedbackMessage(message);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2500);
    }
    onToggle(protocol.id);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors duration-300 ${
          protocol.completed
            ? "bg-primary/10 border-primary/30"
            : "bg-card border-border hover:bg-surface-hover"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3 text-left">
          <div
            className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors duration-300 ${
              protocol.completed
                ? "bg-primary border-primary"
                : "border-muted-foreground/30"
            }`}
          >
            {protocol.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
          </div>
          <div>
            <p className={`text-sm font-medium ${protocol.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {protocol.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {protocol.streak > 0 && (
                <p className="text-xs text-muted-foreground">
                  {protocol.streak} day streak
                </p>
              )}
              {protocol.scheduledTime && protocol.remind && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Clock className="w-3 h-3" />
                  <span>{protocol.scheduledTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xs text-primary font-medium"
            key={protocol.completed ? "done" : "pending"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            +{protocol.xp} XP
          </motion.span>
        </div>
      </motion.button>

      {/* Micro Emotional Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full"
          >
            {feedbackMessage}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default HabitCard;
