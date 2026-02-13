import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { PageLayout } from "@/components/PageLayout";
import { PhaseDashboard } from "@/components/PhaseDashboard";
import { FailureAnalysis } from "@/components/FailureAnalysis";
import HabitCard from "@/components/HabitCard";
import { useTaskReminder } from "@/hooks/use-task-reminder";
import { BookOpen, Zap, Brain, Shield, TrendingUp, Flame, Plus, Heart, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { phase, totalXp, xpToNextPhase, protocols, toggleProtocol, identity, modeConfig, generateDailyTasks, dailyTasksGenerated, missionIntent, setMissionIntent, lastCompletedDate } = useAppStore();
  const [showMissionDialog, setShowMissionDialog] = useState(false);
  const [showFailureAnalysis, setShowFailureAnalysis] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<'normal' | 'high-energy' | 'low-energy' | 'recovery'>(missionIntent);

  // Hook for task reminders
  useTaskReminder();

  const completedToday = protocols.filter((p) => p.completed).length;
  const hasSetup = Object.keys(modeConfig).length > 0;

  useEffect(() => {
    if (hasSetup && lastCompletedDate) {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = new Date(lastCompletedDate);
      const today_date = new Date(today);
      const daysDiff = Math.floor((today_date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 2) {
        const failureAnalysisShown = sessionStorage.getItem('failureAnalysisShown');
        if (!failureAnalysisShown) {
          setShowFailureAnalysis(true);
          sessionStorage.setItem('failureAnalysisShown', 'true');
        }
      }
    }
  }, [hasSetup, lastCompletedDate]);

  useEffect(() => {
    if (hasSetup && !dailyTasksGenerated) {
      generateDailyTasks();
    }
  }, [hasSetup, dailyTasksGenerated, generateDailyTasks]);

  useEffect(() => {
    if (hasSetup && protocols.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const lastIntentDate = localStorage.getItem('lastMissionIntentDate');
      if (lastIntentDate !== today) {
        setShowMissionDialog(true);
      }
    }
  }, [hasSetup, protocols]);

  const handleMissionIntentSelect = (intent: typeof selectedIntent) => {
    setSelectedIntent(intent);
    setMissionIntent(intent);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastMissionIntentDate', today);
    setShowMissionDialog(false);
  };

  const getModeIcon = () => {
    switch (identity) {
      case 'scholar': return <BookOpen className="w-6 h-6" />;
      case 'warrior': return <Zap className="w-6 h-6" />;
      case 'focus': return <Brain className="w-6 h-6" />;
      case 'discipline': return <Shield className="w-6 h-6" />;
      default: return null;
    }
  };

  const getModeTitle = () => {
    switch (identity) {
      case 'scholar': return 'Scholar Mode';
      case 'warrior': return 'Warrior Mode';
      case 'focus': return 'Focus Mode';
      case 'discipline': return 'Discipline Mode';
      default: return 'Dashboard';
    }
  };

  const getModeMotto = () => {
    switch (identity) {
      case 'scholar': return 'Master your knowledge';
      case 'warrior': return 'Build your strength';
      case 'focus': return 'Own your time';
      case 'discipline': return 'Control your destiny';
      default: return 'Your journey';
    }
  };

  const getStreakCount = () => {
    return Math.max(...protocols.map((p) => p.streak), 0);
  };

  return (
    <PageLayout>
      <FailureAnalysis open={showFailureAnalysis} onClose={() => setShowFailureAnalysis(false)} />
      <Dialog open={showMissionDialog} onOpenChange={setShowMissionDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>How's your energy today?</DialogTitle>
            <DialogDescription>
              This affects your daily tasks. Be honest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <button
              onClick={() => handleMissionIntentSelect('high-energy')}
              className="w-full p-4 border-2 border-transparent rounded-lg hover:border-primary/50 transition-all text-left space-y-1 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">High Energy</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Bring it on—I'm ready to push.</p>
            </button>

            <button
              onClick={() => handleMissionIntentSelect('normal')}
              className="w-full p-4 border-2 border-transparent rounded-lg hover:border-primary/50 transition-all text-left space-y-1 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="font-semibold">Normal</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Standard session. Let's do this.</p>
            </button>

            <button
              onClick={() => handleMissionIntentSelect('low-energy')}
              className="w-full p-4 border-2 border-transparent rounded-lg hover:border-primary/50 transition-all text-left space-y-1 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Low Energy</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Tired. Keep it light & manageable.</p>
            </button>

            <button
              onClick={() => handleMissionIntentSelect('recovery')}
              className="w-full p-4 border-2 border-transparent rounded-lg hover:border-primary/50 transition-all text-left space-y-1 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Recovery</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">Just maintaining. Light touch.</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="px-6 py-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 space-y-2"
        >
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="text-primary">
                {getModeIcon()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{getModeTitle()}</h1>
                <p className="text-xs text-muted-foreground">{getModeMotto()}</p>
              </div>
            </div>
            <button
              onClick={() => setShowMissionDialog(true)}
              className="text-xs px-3 py-1 border rounded-full hover:bg-primary/10 transition-colors"
              title="Change energy level"
            >
              {selectedIntent === 'high-energy' && '⚡ High'}
              {selectedIntent === 'normal' && '❤️ Normal'}
              {selectedIntent === 'low-energy' && '🍃 Low'}
              {selectedIntent === 'recovery' && '🛡️ Recovery'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <PhaseDashboard phase={phase} totalXp={totalXp} xpToNextPhase={xpToNextPhase} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 grid grid-cols-2 gap-2"
        >
          <div className="bg-card border rounded-lg p-2 text-center space-y-0.5 flex flex-col items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-base font-bold">{getStreakCount()}</div>
            <div className="text-[10px] text-muted-foreground">streak</div>
          </div>
          <div className="bg-card border rounded-lg p-2 text-center space-y-0.5 flex flex-col items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div className="text-base font-bold">{completedToday}/{protocols.length}</div>
            <div className="text-[10px] text-muted-foreground">today</div>
          </div>
        </motion.div>


        {/* Today's Tasks Section or Setup Prompt */}
        {!hasSetup ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 mt-8 mb-6"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 space-y-4 text-center">
              <h2 className="text-lg font-bold text-foreground">Welcome!</h2>
              <p className="text-sm text-muted-foreground">
                Let's set up your personalized {getModeTitle().toLowerCase()} to get started.
              </p>
              <button
                onClick={() => navigate(`/setup/${identity}`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                Start Setup
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 space-y-2 mt-8 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-semibold">
                TODAY'S JOURNEY
              </p>
              <div className="flex-1 h-1 bg-muted rounded-full ml-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedToday / Math.max(protocols.length, 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            {protocols.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-3"
              >
                <p className="text-sm font-semibold text-primary">
                  No tasks yet.
                </p>
                <p className="text-xs text-muted-foreground">
                  Complete your setup to generate personalized tasks.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {protocols.map((protocol, i) => (
                  <motion.div
                    key={protocol.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <HabitCard protocol={protocol} onToggle={toggleProtocol} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Motivational message based on mode */}
        {completedToday > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-2 mb-6 text-xs text-muted-foreground"
          >
            {identity === 'scholar' && (
              <p>Every problem solved is knowledge gained. Keep learning. ✨</p>
            )}
            {identity === 'warrior' && (
              <p>Every rep counts. You're building an unbreakable version of yourself. 💪</p>
            )}
            {identity === 'focus' && (
              <p>Deep work compounds over time. This session matters. 🎯</p>
            )}
            {identity === 'discipline' && (
              <p>Small choices compound into character. You're becoming unstoppable. 🧱</p>
            )}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
