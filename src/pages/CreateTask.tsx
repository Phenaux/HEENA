import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ArrowLeft, Check, Clock, Bell } from "lucide-react";
import { useAppStore, type IdentityPath, type TaskType, type NotificationSettings } from "@/store/useAppStore";
import { PageLayout } from "@/components/PageLayout";

const TASK_TYPES: TaskType[] = [
  'lesson', 'practice', 'revision', 'test', 'recall',
  'workout', 'cardio', 'rest',
  'deepwork', 'admin', 'planning', 'reflection', 'habit'
];

const TASK_LABELS: Record<TaskType, string> = {
  lesson: '📚 Lesson',
  practice: '✏️ Practice',
  revision: '🔄 Revision',
  test: '🧪 Test',
  recall: '🧠 Recall',
  workout: '💪 Workout',
  cardio: '🏃 Cardio',
  rest: '🌳 Rest Day',
  deepwork: '🎯 Deep Work',
  admin: '📋 Admin',
  planning: '🗺️ Planning',
  reflection: '💭 Reflection',
  habit: '⭐ Habit',
};

const MODE_SUGGESTIONS: Record<IdentityPath, Array<{ name: string; type: TaskType }>> = {
  scholar: [
    { name: 'Read Chapter', type: 'lesson' },
    { name: 'Solve Problems', type: 'practice' },
    { name: 'Review Notes', type: 'revision' },
    { name: 'Take Practice Test', type: 'test' },
  ],
  warrior: [
    { name: 'Morning Workout', type: 'workout' },
    { name: 'Cardio Session', type: 'cardio' },
    { name: 'Strength Training', type: 'workout' },
    { name: 'Recovery Session', type: 'rest' },
  ],
  focus: [
    { name: 'Deep Work Session', type: 'deepwork' },
    { name: 'Focused Task', type: 'admin' },
    { name: 'Planning Session', type: 'planning' },
    { name: 'Reflect & Review', type: 'reflection' },
  ],
  discipline: [
    { name: 'Daily Habit', type: 'habit' },
    { name: 'Routine Task', type: 'admin' },
    { name: 'Self-Discipline Challenge', type: 'habit' },
    { name: 'Evening Reflection', type: 'reflection' },
  ],
};

const CreateTask = () => {
  const navigate = useNavigate();
  const { identity, addProtocol, customSettings } = useAppStore();
  
  const [taskName, setTaskName] = useState("");
  const [selectedType, setSelectedType] = useState<TaskType>('habit');
  const [xpValue, setXpValue] = useState(10);
  const [withReminder, setWithReminder] = useState(false);
  const [isDaily, setIsDaily] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Reminder settings
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [enableVibration, setEnableVibration] = useState(true);
  const [enableSound, setEnableSound] = useState(true);
  const [notifyIfTasksLeft, setNotifyIfTasksLeft] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  const modeSuggestions = identity ? MODE_SUGGESTIONS[identity] : [];

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      setError("Task name is required");
      return;
    }

    if (!identity) {
      setError("Please select your identity first");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const finalXp = Math.round(xpValue * customSettings.xpMultiplier);

      const notificationSettings: NotificationSettings = {
        enableVibration,
        enableSound,
        notifyIfTasksLeft,
        reminderMinutes,
      };

      addProtocol({
        name: taskName,
        category: identity,
        taskType: selectedType,
        xp: finalXp,
        remind: withReminder,
        isDaily: isDaily,
        scheduledTime: withReminder ? scheduledTime : undefined,
        notificationSettings: withReminder ? notificationSettings : undefined,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError("Failed to create task. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout showTitle="Create Task">
      <div className="px-6 py-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {modeSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-foreground">Quick Suggestions</label>
              <div className="grid grid-cols-2 gap-2">
                {modeSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.name}
                    onClick={() => {
                      setTaskName(suggestion.name);
                      setSelectedType(suggestion.type);
                    }}
                    className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 text-left transition-all active:scale-95"
                  >
                    <p className="text-xs font-medium text-foreground">{suggestion.name}</p>
                    <p className="text-[10px] text-muted-foreground">{TASK_LABELS[suggestion.type]}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Complete Chapter 5, Run 5km..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Task Type</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-hide">
              {TASK_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 text-xs font-medium transition-all whitespace-nowrap ${
                    selectedType === type
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {TASK_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-card border border-border">
            <label className="text-sm font-semibold text-foreground">
              Base XP Value: {xpValue}
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={xpValue}
              onChange={(e) => setXpValue(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              Final XP (with {customSettings.xpMultiplier}x multiplier): {Math.round(xpValue * customSettings.xpMultiplier)}
            </p>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors">
            <input
              type="checkbox"
              checked={withReminder}
              onChange={(e) => setWithReminder(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm font-medium text-foreground">Add reminder for this task</span>
          </label>

          {withReminder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              {/* Time of day */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="w-4 h-4" />
                  Time of Day
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">When should this task be done?</p>
              </div>

              {/* Reminder time before */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Remind me {reminderMinutes} minutes before
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Notification settings */}
              <div className="space-y-3 border-t border-primary/20 pt-3">
                <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <input
                    type="checkbox"
                    checked={enableVibration}
                    onChange={(e) => setEnableVibration(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-foreground">📳 Vibration</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <input
                    type="checkbox"
                    checked={enableSound}
                    onChange={(e) => setEnableSound(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-foreground">🔔 Sound</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <input
                    type="checkbox"
                    checked={notifyIfTasksLeft}
                    onChange={(e) => setNotifyIfTasksLeft(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-foreground">📊 Show tasks remaining</span>
                </label>
              </div>
            </motion.div>
          )}

          <label className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-pointer hover:border-primary/50 transition-colors">
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Add as Daily Task</span>
              <p className="text-[10px] text-muted-foreground">This task will repeat every day</p>
            </div>
          </label>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            onClick={handleCreateTask}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Task
              </>
            )}
          </motion.button>

          <div className="p-3 rounded-lg bg-card border border-border text-center">
            <p className="text-[10px] text-muted-foreground">
              💡 Tasks are added to your daily journey and contribute to your progression
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default CreateTask;
