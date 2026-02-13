import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface DreamEntry {
  id: string;
  date: string;
  dream: string;
  mood: "motivated" | "peaceful" | "determined" | "inspired";
  phase: number;
}

interface DreamVaultProps {
  dreams: DreamEntry[];
  onAddDream: (dream: string, mood: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_COLORS = {
  motivated: "text-pink-400",
  peaceful: "text-teal-400",
  determined: "text-indigo-400",
  inspired: "text-amber-400",
};

const MOOD_EMOJI = {
  motivated: "🔥",
  peaceful: "🌙",
  determined: "💪",
  inspired: "✨",
};

export const DreamVault = ({
  dreams,
  onAddDream,
  isOpen,
  onClose,
}: DreamVaultProps) => {
  const [newDream, setNewDream] = useState("");
  const [selectedMood, setSelectedMood] = useState<keyof typeof MOOD_COLORS>(
    "inspired"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMontage, setShowMontage] = useState(false);

  // Check if 30 days worth of dreams exist
  useEffect(() => {
    if (dreams.length >= 30) {
      setShowMontage(true);
    }
  }, [dreams.length]);

  const handleAddDream = () => {
    if (newDream.trim()) {
      onAddDream(newDream, selectedMood);
      setNewDream("");
    }
  };

  const handleNextDream = () => {
    setCurrentIndex((prev) => (prev + 1) % dreams.length);
  };

  const handlePrevDream = () => {
    setCurrentIndex((prev) => (prev - 1 + dreams.length) % dreams.length);
  };

  if (!isOpen) return null;

  const currentDream = dreams[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                <h2 className="text-xl font-bold text-foreground">
                  Vault of Dreams
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Montage View (30+ days) */}
            {showMontage && (
              <motion.div
                className="space-y-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  <p className="font-semibold text-amber-400">
                    30 Days of Dreams!
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  You've recorded {dreams.length} dreams. Check out your
                  journey below.
                </p>

                {/* Dream gallery */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {dreams.slice(-12).map((dream, i) => (
                    <motion.div
                      key={dream.id}
                      className={`p-2 rounded text-center text-xs font-medium cursor-pointer transition-all ${MOOD_COLORS[dream.mood]} bg-card/50`}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {MOOD_EMOJI[dream.mood]}
                      <div className="text-[10px] mt-1 truncate">
                        Day {dreams.length - 11 + i}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Dream Browser */}
            {dreams.length > 0 ? (
              <div className="space-y-4">
                {/* Current Dream Card */}
                <motion.div
                  key={currentDream.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 space-y-3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(currentDream.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Phase {currentDream.phase}
                      </p>
                    </div>
                    <span className={`text-2xl ${MOOD_COLORS[currentDream.mood]}`}>
                      {MOOD_EMOJI[currentDream.mood]}
                    </span>
                  </div>

                  <blockquote className="text-sm italic text-foreground leading-relaxed">
                    "{currentDream.dream}"
                  </blockquote>
                </motion.div>

                {/* Navigation */}
                {dreams.length > 1 && (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={handlePrevDream}
                      className="p-2 rounded-lg hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-xs text-muted-foreground">
                      {currentIndex + 1} / {dreams.length}
                    </span>

                    <button
                      onClick={handleNextDream}
                      className="p-2 rounded-lg hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Timeline */}
                <div className="h-1 bg-card rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((currentIndex + 1) / dreams.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No dreams recorded yet. Add your first dream below.
              </p>
            )}

            {/* Add Dream Form */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-sm font-semibold text-foreground">
                What is one dream you worked for today?
              </p>

              <textarea
                value={newDream}
                onChange={(e) => setNewDream(e.target.value)}
                placeholder="Share your dream..."
                className="input-heen resize-none h-24"
              />

              {/* Mood selector */}
              <div className="flex gap-2">
                {(Object.keys(MOOD_COLORS) as Array<keyof typeof MOOD_COLORS>).map(
                  (mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedMood === mood
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-surface-hover"
                      }`}
                    >
                      {MOOD_EMOJI[mood]} {mood}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleAddDream}
                disabled={!newDream.trim()}
                className="btn-primary w-full disabled:opacity-50"
              >
                Save Dream
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DreamVault;
