import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore, type ModeConfig, type IdentityPath } from "@/store/useAppStore";
import { ChevronRight, ChevronLeft } from "lucide-react";

const ModeSetup = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { setModeConfig, generateDailyTasks } = useAppStore();

  const [config, setConfig] = useState<ModeConfig>({});
  const [step, setStep] = useState(1);

  if (!mode || !['scholar', 'warrior', 'focus', 'discipline'].includes(mode)) {
    return null;
  }

  const identity = mode as IdentityPath;

  const handleNext = () => {
    if (identity === 'scholar' && step === 1) setStep(2);
    else if (identity === 'scholar' && step === 2) setStep(3);
    else if (identity === 'scholar' && step === 3) complete();

    else if (identity === 'warrior' && step === 1) setStep(2);
    else if (identity === 'warrior' && step === 2) setStep(3);
    else if (identity === 'warrior' && step === 3) complete();

    else if (identity === 'focus' && step === 1) setStep(2);
    else if (identity === 'focus' && step === 2) complete();

    else if (identity === 'discipline' && step === 1) complete();
  };

  const complete = () => {
    setModeConfig(config);
    setTimeout(() => {
      generateDailyTasks();
      navigate('/dashboard');
    }, 100);
  };

  if (identity === 'scholar') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">🧠 Scholar Setup</h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 && "What subjects are you studying?"}
              {step === 2 && "How many hours per day?"}
              {step === 3 && "Exam date (optional)"}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter subjects (comma-separated)</label>
                <textarea
                  placeholder="Math, Physics, Chemistry..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows={3}
                  value={config.subjects?.join(', ') || ''}
                  onChange={(e) => setConfig({ ...config, subjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily study hours</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={config.hoursDaily || 3}
                    onChange={(e) => setConfig({ ...config, hoursDaily: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-12">{config.hoursDaily || 3}h</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam date (optional)</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={config.examDate || ''}
                onChange={(e) => setConfig({ ...config, examDate: e.target.value })}
              />
            </div>
          )}

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm border rounded-lg hover:bg-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90"
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (identity === 'warrior') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">🏋️ Warrior Setup</h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 && "What's your fitness level?"}
              {step === 2 && "Where do you train?"}
              {step === 3 && "Days per week"}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setConfig({ ...config, fitnessLevel: level })}
                  className={`w-full p-3 text-left rounded-lg border transition ${
                    config.fitnessLevel === level
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              {(['home', 'gym'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setConfig({ ...config, location: loc })}
                  className={`w-full p-3 text-left rounded-lg border transition ${
                    config.location === loc
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Days per week</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={config.daysPerWeek || 4}
                    onChange={(e) => setConfig({ ...config, daysPerWeek: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-12">{config.daysPerWeek || 4}d</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm border rounded-lg hover:bg-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90"
              disabled={!config.fitnessLevel && step === 1 || !config.location && step === 2}
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (identity === 'focus') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">🎯 Focus Setup</h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 && "What's your focus type?"}
              {step === 2 && "Hours available per day?"}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-2">
              {(['student', 'entrepreneur', 'creator'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setConfig({ ...config, studentType: type })}
                  className={`w-full p-3 text-left rounded-lg border transition ${
                    config.studentType === type
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hours available daily</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={config.hoursAvailable || 6}
                    onChange={(e) => setConfig({ ...config, hoursAvailable: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-12">{config.hoursAvailable || 6}h</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm border rounded-lg hover:bg-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90"
              disabled={!config.studentType && step === 1}
            >
              {step === 2 ? 'Complete Setup' : 'Next'}
              {step < 2 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (identity === 'discipline') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">🧱 Discipline Setup</h1>
            <p className="text-sm text-muted-foreground">
              What time do you wake up?
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Wake time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={config.wakeTime || '06:00'}
              onChange={(e) => setConfig({ ...config, wakeTime: e.target.value })}
            />
          </div>

          <button
            onClick={complete}
            className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90"
          >
            Complete Setup & Start
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ModeSetup;
