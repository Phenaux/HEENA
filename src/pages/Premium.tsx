import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Shield, Crown, Key, Flame, Target, Trophy } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageLayout } from "@/components/PageLayout";

const features = [
  { icon: Zap, text: "Unlimited Protocols", desc: "Break the cognitive limits of the baseline experience." },
  { icon: Star, text: "Ascension Phases", desc: "Access Phase 4 (Mastery) & 5 (Neural Ascension)." },
  { icon: Shield, text: "Heena Vault", desc: "Biometric encryption for your subconscious logs." },
  { icon: Key, text: "Identity Themes", desc: "Reskin your interface to match your character's frequency." },
];

const Premium = () => {
  const { isPremium, startPremiumTrial, premiumTrialEndDate, level, consecutiveDays, premiumUnlockedByStreak, premiumUnlockedByLevel10, premiumUnlockedByLevel100 } = useAppStore();
  const [codeStatus, setCodeStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const isTrialUnlocked = level >= 7;

  const isOnTrial = premiumTrialEndDate ? new Date(premiumTrialEndDate) > new Date() : false;
  const daysRemaining = isOnTrial
    ? Math.ceil((new Date(premiumTrialEndDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const showFeedback = (status: "success" | "error", msg: string) => {
    setCodeStatus(status);
    setStatusMessage(msg);
    if (status === "error") {
      setTimeout(() => setCodeStatus("idle"), 3000);
    }
  };

  const unlocksData = [
    {
      icon: Flame,
      title: "7-Day Streak",
      desc: "7 days premium",
      progress: consecutiveDays,
      target: 7,
      unlocked: premiumUnlockedByStreak,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    {
      icon: Target,
      title: "Level 10",
      desc: "2 months premium",
      progress: level,
      target: 10,
      unlocked: premiumUnlockedByLevel10,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Trophy,
      title: "Level 100",
      desc: "Forever premium",
      progress: level,
      target: 100,
      unlocked: premiumUnlockedByLevel100,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    }
  ];

  return (
    <PageLayout showTitle="Neural Upgrade">
      <div className="px-5 py-8 max-w-lg mx-auto pb-24">
        
        {/* Psychological Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-4 mb-10"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-primary/20 mb-2 rotate-3 group-hover:rotate-0 transition-transform">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tighter">
            The Superior <span className="text-primary font-mono">Self</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "Software is the only limit to human potential. Your current version is a trial. 
            Ascension is the permanent patch for the subconscious."
          </p>
        </motion.div>

        {/* Feature List */}
        <div className="grid grid-cols-1 gap-3 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-inner">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">{f.text}</h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-tight">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 space-y-3"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Unlock Premium by Playing
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {unlocksData.map((unlock, idx) => (
              <motion.div
                key={unlock.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  unlock.unlocked
                    ? `${unlock.bgColor} ${unlock.borderColor}`
                    : 'bg-card/50 border-muted/30 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <unlock.icon className={`w-5 h-5 ${unlock.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{unlock.title}</p>
                    <p className="text-[10px] text-muted-foreground">{unlock.desc}</p>
                  </div>
                  {unlock.unlocked && (
                    <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-bold text-green-400">Unlocked</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((unlock.progress / unlock.target) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${unlock.color.replace('text-', 'bg-')}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground w-12 text-right">
                    {unlock.progress}/{unlock.target}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ascension Status / Action */}
        <AnimatePresence mode="wait">
          {!isPremium ? (
            <motion.div 
              key="upgrade"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* 2-Month Trial Option */}
              <div className={`p-5 rounded-2xl border-2 relative overflow-hidden ${
                isTrialUnlocked 
                  ? 'bg-card border-primary/30' 
                  : 'bg-card/50 border-muted/30'
              }`}>
                <div className="absolute -right-3 -top-3 text-4xl opacity-20">🎁</div>
                {!isTrialUnlocked && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl z-20">
                    <div className="text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unlock at Level 7</p>
                    </div>
                  </div>
                )}
                <div className={`relative z-10 ${!isTrialUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">2-Month Free Trial</span>
                  <div className="mt-3">
                    <p className="text-sm font-bold text-foreground mb-2">Experience Premium for free</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Full access to all features. No credit card required. Cancel anytime.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      startPremiumTrial();
                      showFeedback("success", "2-Month Trial Activated! ✨");
                    }}
                    disabled={!isTrialUnlocked}
                    className="w-full py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start 2-Month Trial
                  </button>
                </div>
              </div>

              {/* Only 2-Month Trial - No Payment Options */}
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-8 bg-card border-2 rounded-3xl text-center space-y-4 shadow-xl ${
                isOnTrial 
                  ? 'border-blue-500/50 shadow-blue-500/10' 
                  : 'border-primary shadow-primary/10'
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isOnTrial 
                  ? 'bg-blue-500/10' 
                  : 'bg-primary/10'
              }`}>
                <Star className={`w-10 h-10 fill-current ${isOnTrial ? 'text-blue-400' : 'text-primary'}`} />
              </div>
              <h3 className="text-2xl font-black italic uppercase">
                {isOnTrial ? `Trial Active` : `Level: Ascended`}
              </h3>
              <div className={`h-1 w-24 mx-auto rounded-full ${isOnTrial ? 'bg-blue-500/30' : 'bg-primary/30'}`} />
              {isOnTrial ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground px-6 leading-relaxed">
                    2-Month Premium Trial
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-2xl font-black text-blue-400">{daysRemaining}</p>
                    <p className="text-xs text-blue-300">days remaining</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trial expires: {new Date(premiumTrialEndDate!).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground px-6 leading-relaxed">
                  Identity verified. All protocols are now running at 100% capacity.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default Premium;