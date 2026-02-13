import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Sliders, RotateCcw, Save, Lock } from "lucide-react";
import { useAppStore, type CustomSettings } from "@/store/useAppStore";
import { PageLayout } from "@/components/PageLayout";

const Settings = () => {
  const navigate = useNavigate();
  const { customSettings, updateCustomSettings, backgroundImage, setBackgroundImage, level } = useAppStore();
  const [localSettings, setLocalSettings] = useState<CustomSettings>(customSettings);
  const [bgPreview, setBgPreview] = useState<string | null>(backgroundImage);
  const [uploaded, setUploaded] = useState(false);

  const isSettingsUnlocked = level >= 3;
  const isPhotoUnlocked = level >= 5;

  if (!isSettingsUnlocked) {
    return (
      <PageLayout showTitle="Settings">
        <div className="px-6 py-8 max-w-md mx-auto flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Settings Locked</h2>
            <p className="text-sm text-muted-foreground">
              Reach <span className="font-bold">Level 3</span> to unlock settings customization
            </p>
            <p className="text-xs text-muted-foreground">
              Current Level: {level}
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setBgPreview(base64);
        setBackgroundImage(base64);
        setUploaded(true);
        setTimeout(() => setUploaded(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingChange = <K extends keyof CustomSettings>(key: K, value: CustomSettings[K]) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    updateCustomSettings(updated);
  };

  const resetToDefaults = () => {
    const defaults: CustomSettings = {
      xpMultiplier: 1.0,
      difficultyLevel: 'normal',
      autoGenerateTasks: true,
      showMotivationalMessages: true,
      enableNotifications: true,
      bgDimLevel: 0.5,
    };
    setLocalSettings(defaults);
    updateCustomSettings(defaults);
  };

  return (
    <PageLayout showTitle="Settings">
      <div className="px-6 py-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`space-y-4 relative ${!isPhotoUnlocked ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {!isPhotoUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-lg backdrop-blur-sm z-10">
                <div className="text-center space-y-1">
                  <Lock className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-xs font-bold">Unlocks at Level 10</p>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Background Image</h3>
              <p className="text-xs text-muted-foreground mb-4">Upload a photo to personalize your app</p>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={!isPhotoUnlocked}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isPhotoUnlocked 
                  ? 'border-border hover:border-primary/50 cursor-pointer' 
                  : 'border-muted-foreground/20 cursor-not-allowed'
              }`}>
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs font-medium text-foreground">Click to upload image</p>
                <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {bgPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <div className="rounded-lg overflow-hidden border border-border h-32">
                  <img
                    src={bgPreview}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    setBgPreview(null);
                    setBackgroundImage(null);
                  }}
                  className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  Remove Image
                </button>
              </motion.div>
            )}

            {uploaded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-green-500 font-medium"
              >
                ✓ Background saved locally
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Customize Difficulty</h3>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
              <label className="text-xs font-medium text-foreground">
                XP Multiplier: {localSettings.xpMultiplier.toFixed(1)}x
              </label>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={localSettings.xpMultiplier}
                onChange={(e) => handleSettingChange('xpMultiplier', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-full accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                {localSettings.xpMultiplier < 1 ? 'Easier (less XP)' : localSettings.xpMultiplier > 1 ? 'Harder (more XP)' : 'Normal'}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
              <label className="text-xs font-medium text-foreground">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'normal', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSettingChange('difficultyLevel', level)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      localSettings.difficultyLevel === level
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {level === 'easy' ? '🌱' : level === 'normal' ? '⚡' : '🔥'} {level}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {localSettings.difficultyLevel === 'easy'
                  ? 'Fewer tasks, lower XP values'
                  : localSettings.difficultyLevel === 'hard'
                  ? 'More tasks, higher XP values'
                  : 'Balanced task load'}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
              <label className="text-xs font-medium text-foreground">
                Background Darkness: {Math.round(localSettings.bgDimLevel * 100)}%
              </label>
              <input
                type="range"
                min={0.2}
                max={0.8}
                step={0.05}
                value={localSettings.bgDimLevel}
                onChange={(e) => handleSettingChange('bgDimLevel', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-full accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                Higher = darker overlay over background
              </p>
            </div>


            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="checkbox"
                  checked={localSettings.autoGenerateTasks}
                  onChange={(e) => handleSettingChange('autoGenerateTasks', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs font-medium text-foreground">Auto-generate daily tasks</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="checkbox"
                  checked={localSettings.showMotivationalMessages}
                  onChange={(e) => handleSettingChange('showMotivationalMessages', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs font-medium text-foreground">Show motivational messages</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="checkbox"
                  checked={localSettings.enableNotifications}
                  onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs font-medium text-foreground">Enable notifications</span>
              </label>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={resetToDefaults}
            className="w-full py-3 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-[10px] text-green-500 font-medium flex items-center justify-center gap-1">
              <Save className="w-3 h-3" />
              All settings saved locally
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-border"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Contributors
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                <p className="text-xs font-medium text-foreground">Phenaux</p>
                <p className="text-[10px] text-muted-foreground">Core Developer & Contributor</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              HEENɅ is open source on{' '}
              <a 
                href="https://github.com/Phenaux/HEENA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Settings;
