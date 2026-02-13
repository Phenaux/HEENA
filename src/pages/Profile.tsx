import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Zap, Heart, TrendingUp, Lock, Shield } from "lucide-react";
import { useAppStore, type Gender } from "@/store/useAppStore";
import { PageLayout } from "@/components/PageLayout";
import XPBar from "@/components/XPBar";
import { LevelUnlocks } from "@/components/LevelUnlocks";
import { PowerRankingSummary } from "@/components/PowerRankingSummary";

const PHASE_NAMES = ["", "Awareness", "Discipline", "Momentum", "Mastery", "Ascension"];

const genderOptions: { id: Gender; label: string }[] = [
  { id: "female", label: "Girl" },
  { id: "male", label: "Boy" },
  { id: "other", label: "Other" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { phase, level, totalXp, xpToNextLevel, xpToNextPhase, profile, setProfile, identity, identityStrength, updateIdentityStrength, weeklyXpGain, isPremium, useStreakProtection } = useAppStore();
  const needsSetup = !profile;

  const [name, setName] = useState(profile?.name || "");
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [gender, setGender] = useState<Gender | null>(profile?.gender || null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [showStreakProtectionAlert, setShowStreakProtectionAlert] = useState(false);

  useEffect(() => {
    updateIdentityStrength();
  }, [updateIdentityStrength]);

  const handleSave = () => {
    if (!name.trim() || !age || !gender) return;
    setProfile({ name: name.trim(), age: parseInt(age), gender });
    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  const handleClearData = () => {
    if (!profile || deleteInput.trim() !== profile.name.trim()) return;
    localStorage.removeItem("heena");
    window.location.href = "/";
  };

  if (needsSetup) {
    return (
      <PageLayout showTitle="Profile Setup">
        <div className="px-6 py-8 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Set up your profile</h2>
              <p className="text-xs text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  min="10"
                  max="99"
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {genderOptions.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGender(g.id)}
                      className={`py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                        gender === g.id
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:bg-surface-hover"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!name.trim() || !age || !gender}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Save Profile
            </button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showTitle="Profile">
      <div className="px-6 py-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="space-y-1">
            <motion.p
              className="text-sm text-primary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {profile.name}
            </motion.p>
            <motion.p
              className="text-[10px] text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {profile.age} years old
            </motion.p>
          </div>

          <div className="space-y-4">
            <motion.p
              className="text-xs text-muted-foreground uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your Power Level
            </motion.p>
            <motion.div
              className="flex items-end gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="text-center">
                <h1 className="text-8xl font-black text-primary">{level}</h1>
                <p className="text-xs text-muted-foreground mt-1">Level</p>
              </div>
              <div className="text-center pb-2">
                <p className="text-4xl font-bold text-amber-500">⚡</p>
                <p className="text-xs text-muted-foreground">Power</p>
              </div>
              <div className="text-center">
                <h2 className="text-5xl font-bold text-accent">{phase}</h2>
                <p className="text-xs text-muted-foreground mt-1">Phase</p>
              </div>
            </motion.div>
            <motion.p
              className="text-sm text-center text-primary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {PHASE_NAMES[phase] || `Phase ${phase}`}
            </motion.p>
          </div>

          {/* Identity Strength Meter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="space-y-3 p-4 bg-primary/5 border border-primary/10 rounded-lg"
          >
            <div className="flex items-center gap-2 justify-center">
              <Heart className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Identity Strength</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${identityStrength}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-primary"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground font-medium">{identityStrength}%</span>
                <span className="text-[10px] text-muted-foreground">
                  {identityStrength >= 80 ? '🔥 Unstoppable' : identityStrength >= 60 ? '💪 Strong' : identityStrength >= 40 ? '⚡ Building' : '🌱 Emerging'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Based on your completion rate & streak consistency
            </p>
          </motion.div>

          {/* Power Ranking - Weekly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68 }}
            className="w-full max-w-sm mx-auto"
          >
            <PowerRankingSummary />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <XPBar current={totalXp} max={xpToNextPhase} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {phase < 5 ? (
              <p className="text-[10px] text-muted-foreground">
                {xpToNextPhase - totalXp} XP until Phase {phase + 1}
              </p>
            ) : (
              <p className="text-[10px] text-primary animate-subtle-pulse">
                Maximum phase reached
              </p>
            )}
          </motion.div>

          {/* Level & XP Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6 pt-4 border-t border-border"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Level {level}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground">Level Progress</span>
                  <span className="text-xs text-muted-foreground">{totalXp % 50} / 50 XP</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalXp % 50) / 50 * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {50 - (totalXp % 50)} XP to level {level + 1}
              </p>
            </div>

            {/* Level Unlocks */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-4 bg-accent/5 border border-accent/10 rounded-lg"
            >
              <LevelUnlocks level={level} />
            </motion.div>
          </motion.div>

          {/* Clear Data */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="pt-4 space-y-4"
          >
            {/* Streak Protection - Premium */}
            {isPremium && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center space-y-2"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-semibold text-blue-500">Premium: Streak Protection</p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  1 free pass per week if you miss a day.
                </p>
                {!showStreakProtectionAlert && (
                  <button
                    onClick={() => {
                      if (useStreakProtection()) {
                        setShowStreakProtectionAlert(true);
                        setTimeout(() => setShowStreakProtectionAlert(false), 3000);
                      }
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-blue-500 text-white hover:opacity-90 transition-opacity"
                  >
                    Activate This Week
                  </button>
                )}
                {showStreakProtectionAlert && (
                  <p className="text-xs text-green-500 font-medium animate-pulse">✓ Protection active until Sunday</p>
                )}
              </motion.div>
            )}

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
            >
              <p className="text-[10px] text-muted-foreground">
                🔒 <span className="text-green-500 font-medium">Your privacy matters:</span> All data saved locally. We never collect a byte.
              </p>
            </motion.div>

            {/* Clear Data Button */}
            <div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 mx-auto text-xs text-destructive/70 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All Data
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5"
                  >
                    <div className="flex items-center gap-2 justify-center text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-xs font-medium">This will erase everything</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Type <span className="text-foreground font-medium">"{profile.name}"</span> to confirm
                    </p>
                    <input
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder="Type your name to confirm"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-destructive/50 transition-colors"
                      maxLength={100}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInput("");
                        }}
                        className="flex-1 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleClearData}
                        disabled={deleteInput.trim() !== profile.name.trim()}
                        className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
                      >
                        Delete Everything
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Profile;
