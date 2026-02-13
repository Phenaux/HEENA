import { motion } from "framer-motion";
import { Shield, Lock, Database, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface PrivacyWelcomeProps {
  onAccept: () => void;
}

export const PrivacyWelcome = ({ onAccept }: PrivacyWelcomeProps) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem("privacy_welcome_seen", "true");
    setTimeout(onAccept, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-background border border-white/20 dark:border-white/10 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 backdrop-blur-md p-4 sm:p-8 border-b border-white/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-col sm:flex-row"
          >
            <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
            <h1 className="text-xl sm:text-3xl font-bold text-foreground text-center">
              Welcome to HEENA
            </h1>
          </motion.div>
          <p className="text-center text-muted-foreground text-xs sm:text-base">
            An open-source intelligence system built for your privacy
          </p>
        </div>

        <div className="p-4 sm:p-8 space-y-4 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <Lock className="w-5 sm:w-6 h-5 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h2 className="font-semibold text-base sm:text-lg text-foreground mb-1 sm:mb-2">
                  100% Privacy Protected
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  No data goes outside your browser. Everything stays on your device.
                  Your tasks, goals, and personal data are yours alone.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3 sm:mb-4">
              What This Means
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  icon: Database,
                  title: "Local Storage Only",
                  desc: "All data stored in your browser's local storage",
                },
                {
                  icon: Lock,
                  title: "No Cloud Sync",
                  desc: "No server connection, no account required",
                },
                {
                  icon: Shield,
                  title: "Open Source",
                  desc: "Code is public on GitHub for transparency",
                },
                {
                  icon: CheckCircle2,
                  title: "Offline First",
                  desc: "Works perfectly without internet connection",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex gap-2 sm:gap-3"
                >
                  <feature.icon className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                  <div>
                    <p className="font-semibold text-foreground text-xs sm:text-sm">
                      {feature.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4"
          >
            <p className="text-[11px] sm:text-sm text-muted-foreground">
              <span className="font-semibold text-blue-400">Open Source:</span> This
              app is published on GitHub. You can review the code, fork it, and run it
              yourself—no servers, no tracking, no compromise.
            </p>
          </motion.div>
        </div>

        <div className="border-t border-white/20 p-4 sm:p-8 bg-white/5 backdrop-blur-sm">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={handleAccept}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg text-xs sm:text-base"
          >
            {accepted ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5" />
                Welcome Aboard!
              </span>
            ) : (
              "I Understand & Accept"
            )}
          </motion.button>
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-2 sm:mt-3">
            You can change your privacy settings anytime in the app
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
