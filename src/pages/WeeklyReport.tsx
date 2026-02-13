import { useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { PageLayout } from "@/components/PageLayout";
import { Calendar } from "@/components/Calendar";
import { TrendingUp } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WeeklyReport = () => {
  const { weeklyData, monthlyData, yearlyData, protocols, isPremium } = useAppStore();
  
  // Calculate streak for the report calendar
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const prevDay = new Date(today);
  prevDay.setDate(today.getDate() - 2);
  
  // Get committed days for the current month from protocols
  const committedDays = protocols
    .filter((p) => p.completed)
    .map((p) => new Date().getDate());
  
  // For demo, mark yesterday and prevDay as worked if any protocol completed
  const workedDays = [];
  if (protocols.some((p) => p.completed)) {
    workedDays.push(yesterday.getDate());
    workedDays.push(prevDay.getDate());
  }
  
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.selectedDate ? "calendar" : "weekly");
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || new Date());

  // Weekly stats
  const weeklyMax = Math.max(...weeklyData, 1);
  const weeklyTotal = weeklyData.reduce((a, b) => a + b, 0);
  
  // Monthly stats
  const monthlyMax = Math.max(...monthlyData, 1);
  const monthlyTotal = monthlyData.reduce((a, b) => a + b, 0);
  
  // Yearly stats
  const yearlyMax = Math.max(...yearlyData, 1);
  const yearlyTotal = yearlyData.reduce((a, b) => a + b, 0);
  
  const longestStreak = Math.max(...protocols.map((p) => p.streak), 0);

  return (
    <PageLayout showTitle="Report">
      <div className="px-6 py-8 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-foreground">
              {activeTab === "weekly" ? "Weekly Report" : activeTab === "monthly" ? "Monthly Report" : activeTab === "yearly" ? "Yearly Report" : "Calendar"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeTab === "weekly"
                ? "Your consistency this week"
                : activeTab === "monthly"
                ? "Your progress this month"
                : activeTab === "yearly"
                ? "Your progress this year"
                : "Your commitment history"}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-border overflow-x-auto">
            {["weekly", "monthly", "yearly", "calendar"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Weekly Tab */}
          {activeTab === "weekly" && (
            <>
              {/* Bar Chart */}
              <div className={`relative ${!isPremium ? "select-none" : ""}`}>
                {!isPremium && (
                  <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-foreground font-medium">Premium Feature</p>
                      <a href="/premium" className="text-xs text-primary hover:underline">
                        Unlock full report
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between gap-2 h-32 px-2">
                  {weeklyData.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full rounded-sm bg-primary/20"
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / weeklyMax) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        style={{ minHeight: val > 0 ? 4 : 0 }}
                      >
                        <div
                          className="w-full h-full rounded-sm bg-primary/60"
                          style={{ opacity: val > 0 ? 1 : 0 }}
                        />
                      </motion.div>
                      <span className="text-[9px] text-muted-foreground">{days[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xl font-semibold text-foreground">{weeklyTotal}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Completed this week</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xl font-semibold text-foreground">{longestStreak}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Longest streak</p>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                You're building momentum
              </p>
            </>
          )}

          {/* Monthly Tab */}
          {activeTab === "monthly" && (
            <>
              {/* Monthly Bar Chart (31 days) */}
              <div className={`relative ${!isPremium ? "select-none" : ""}`}>
                {!isPremium && (
                  <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-foreground font-medium">Premium Feature</p>
                      <a href="/premium" className="text-xs text-primary hover:underline">
                        Unlock full report
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-muted-foreground mb-3 font-medium">Daily Completions</div>
                  <div className="grid grid-cols-7 gap-1 h-24 px-2">
                    {monthlyData.slice(0, 31).map((val, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <motion.div
                          className="w-full h-full rounded-sm bg-primary/20"
                          initial={{ height: 0 }}
                          animate={{ height: val > 0 ? "100%" : "4px" }}
                          transition={{ delay: (i % 7) * 0.02, duration: 0.4 }}
                        >
                          <div
                            className="w-full h-full rounded-sm bg-primary/60"
                            style={{ opacity: val > 0 ? 1 : 0.2 }}
                          />
                        </motion.div>
                        <span className="text-[7px] text-muted-foreground">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xl font-semibold text-foreground">{monthlyTotal}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Completed this month</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xl font-semibold text-foreground">{Math.round((monthlyTotal / 31) * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Month completion rate</p>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1"
              >
                <TrendingUp className="w-3 h-3 text-green-500" />
                {monthlyTotal > 0 ? "Keep the streak alive" : "Start your journey this month"}
              </motion.p>
            </>
          )}

          {/* Yearly Tab */}
          {activeTab === "yearly" && (
            <>
              {/* Yearly Bar Chart (12 months) */}
              <div className={`relative ${!isPremium ? "select-none" : ""}`}>
                {!isPremium && (
                  <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-foreground font-medium">Premium Feature</p>
                      <a href="/premium" className="text-xs text-primary hover:underline">
                        Unlock full report
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between gap-1.5 h-40 px-2">
                  {yearlyData.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full rounded-sm bg-primary/20"
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / yearlyMax) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        style={{ minHeight: val > 0 ? 4 : 0 }}
                      >
                        <div
                          className="w-full h-full rounded-sm bg-primary/60"
                          style={{ opacity: val > 0 ? 1 : 0 }}
                        />
                      </motion.div>
                      <span className="text-[9px] text-muted-foreground">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yearly Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xl font-semibold text-foreground">{yearlyTotal}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Completed this year</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xl font-semibold text-foreground">{Math.round((yearlyTotal / 365) * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Year completion rate</p>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1"
              >
                <TrendingUp className="w-3 h-3 text-blue-500" />
                You're building a sustainable habit
              </motion.p>
            </>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="rounded-lg p-4 bg-card border border-border">
              {/* Streak Section */}
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-yellow-200/60 to-orange-100/60 border border-yellow-300 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Current Streak</p>
                  <p className="text-lg font-bold text-yellow-700">{Math.max(...protocols.map((p) => p.streak), 0)} days</p>
                </div>
              </div>
              <Calendar
            />
          </div>
        )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default WeeklyReport;
