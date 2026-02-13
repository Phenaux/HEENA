import { motion } from "framer-motion";

interface LoadingScreenProps {
  isVisible?: boolean;
  progress?: number;
}

export const LoadingScreen = ({ isVisible = true, progress = 0 }: LoadingScreenProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Grain background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /><feDisplacementMap in=\"SourceGraphic\" scale=\"50\" /><feColorMatrix type=\"saturate\" values=\"0.3\"/></filter><rect width=\"100\" height=\"100\" fill=\"%23000\" filter=\"url(%23noise)\" opacity=\"0.1\"/></svg>')",
          backgroundSize: "300px 300px",
          animation: "grain 8s linear infinite",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-xs">
        {/* Peak Symbol - Animated Entrance */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.8,
          }}
          className="relative"
        >
          {/* Glow backdrop */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 20px rgba(99, 102, 241, 0.3)",
                "0 0 60px rgba(99, 102, 241, 0.6)",
                "0 0 20px rgba(99, 102, 241, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              width: "120px",
              height: "120px",
            }}
          />

          {/* Peak Symbol */}
          <motion.span
            className="text-9xl font-bold text-primary drop-shadow-2xl relative z-10"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ∧
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            HEEN
            <span className="inline-block text-primary animate-peak-bounce">∧</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Master your habits. Build your character.
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          className="w-32 h-1 bg-surface-active rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-teal-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress || 100}%` }}
            transition={{
              duration: progress > 0 ? 0.3 : 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Orbiting Particles */}
        <motion.div
          className="relative w-24 h-24 mt-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {[0, 120, 240].map((angle) => (
            <motion.div
              key={angle}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary opacity-40"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translateX(40px) translateY(-50%)`,
              }}
            />
          ))}
        </motion.div>

        {/* Status Text */}
        <motion.p
          className="text-xs text-muted-foreground mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            delay: 0.8,
            duration: 2,
            repeat: Infinity,
          }}
        >
          Initializing your dreams...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
