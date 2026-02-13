import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] text-[#F1F5F9] px-6 text-center">
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1, 0.98] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl mb-8 text-[#6366F1]"
      >
        ∧
      </motion.div>

      <h1 className="text-3xl font-bold mb-4">404: Path Lost</h1>
      
      <p className="text-[#94A3B8] max-w-xs mb-8 leading-relaxed">
        You've wandered off the protocol. This area of the dream hasn't manifested yet.
      </p>

      <Link to="/">
        <button className="h-12 px-8 bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95">
          Return to the Path
        </button>
      </Link>

      <p className="mt-12 text-[#475569] text-xs italic">
        "Who are you becoming in the void?"
      </p>
    </div>
  );
}
