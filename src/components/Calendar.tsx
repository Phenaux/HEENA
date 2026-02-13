import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  workedDays?: number[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Holiday definitions (MM-DD -> name)
const HOLIDAYS_BY_COUNTRY: Record<string, Record<string, string>> = {
  LK: {
    "01-11": "Duruthu Poya",
    "02-04": "Independence Day",
    "04-14": "Sinhala & Tamil New Year",
    "05-23": "Vesak Poya",
    "08-15": "Nikini Poya",
    "10-21": "Navam Poya",
    "12-25": "Christmas",
  },
  US: {
    "01-01": "New Year's Day",
    "01-20": "MLK Jr. Day",
    "02-17": "Presidents Day",
    "05-26": "Memorial Day",
    "07-04": "Independence Day",
    "09-01": "Labor Day",
    "10-13": "Columbus Day",
    "11-11": "Veterans Day",
    "11-27": "Thanksgiving",
    "12-25": "Christmas",
  },
  IN: {
    "01-26": "Republic Day",
    "03-08": "Maha Shivaratri",
    "03-25": "Holi",
    "04-17": "Ram Navami",
    "04-21": "Mahavir Jayanti",
    "05-23": "Buddha Purnima",
    "08-15": "Independence Day",
    "08-28": "Janmashtami",
    "10-02": "Gandhi Jayanti",
    "10-12": "Dussera",
    "10-31": "Diwali",
    "11-01": "Govardhan Puja",
    "11-15": "Guru Nanak Jayanti",
    "12-25": "Christmas",
  },
};

const COUNTRY_NAMES: Record<string, string> = {
  LK: "Sri Lanka 🇱🇰",
  US: "United States 🇺🇸",
  IN: "India 🇮🇳",
};

export const Calendar = ({ selectedDate = new Date(), onDateSelect, workedDays = [] }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { weeklyData } = useAppStore();
  const [userCountry, setUserCountry] = useState<string>("LK");
  const [holidays, setHolidays] = useState<Record<string, string>>(HOLIDAYS_BY_COUNTRY["LK"]);
  const [selectedHoliday, setSelectedHoliday] = useState<{ day: number; name: string } | null>(null);
  const [clickedHolidays, setClickedHolidays] = useState<Set<string>>(new Set());
  const today = new Date();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isFutureDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate > today;
  };

  const isCommitted = (day: number) => workedDays.includes(day);
  
  // Determine if this date had activity based on weeklyData
  const hasActivity = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayOfWeek = checkDate.getDay();
    return weeklyData[dayOfWeek] > 0;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    // Allow navigating to future months to view future holidays
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Allow viewing any date, but holidays always show details
    if (isHoliday(day) || date <= today) {
      onDateSelect?.(date);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Detect user country from IP address
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // First, try browser locale
        const lang = navigator.language || (navigator.languages?.[0]) || "";
        let code = "";
        
        // Extract country code from locale (e.g., "en-LK" -> "LK")
        if (lang.includes("-")) {
          code = lang.split("-")[1].toUpperCase();
        } else {
          const resolved = Intl.DateTimeFormat().resolvedOptions().locale || "";
          if (resolved.includes("-")) {
            code = resolved.split("-")[1].toUpperCase();
          }
        }
        
        if (code && HOLIDAYS_BY_COUNTRY[code]) {
          setUserCountry(code);
          setHolidays(HOLIDAYS_BY_COUNTRY[code]);
          return;
        }

        // Fallback to IP-based geolocation
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const countryCode = (data.country_code || "").toUpperCase();
          
          if (countryCode && HOLIDAYS_BY_COUNTRY[countryCode]) {
            setUserCountry(countryCode);
            setHolidays(HOLIDAYS_BY_COUNTRY[countryCode]);
          }
        } catch (e) {
          // IP detection failed, keep default LK
        }
      } catch (e) {
        // Any error, keep default LK
      }
    };

    detectCountry();
  }, []);

  const isHoliday = (day: number) => {
    const mm = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return !!holidays[`${mm}-${dd}`];
  };

  const getHolidayName = (day: number) => {
    const mm = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return holidays[`${mm}-${dd}`] || null;
  };

  const getHolidayKey = (day: number) => {
    const mm = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const yyyy = currentMonth.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const isHolidayClicked = (day: number) => {
    return clickedHolidays.has(getHolidayKey(day));
  };

  const handleHolidayClick = (day: number) => {
    const name = getHolidayName(day);
    const key = getHolidayKey(day);
    
    setSelectedHoliday({ day, name: name || "Holiday" });
    handleDayClick(day);
    
    // Add to clicked holidays
    setClickedHolidays(prev => new Set(prev).add(key));
  };

  return (
    <div className="space-y-4">
      {/* Header with Month and Country */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{monthYear}</h2>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Country Display */}
        {userCountry && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 py-1.5 rounded">
            <MapPin className="w-3.5 h-3.5" />
            <span>{COUNTRY_NAMES[userCountry] || userCountry}</span>
          </div>
        )}
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const committed = isCommitted(day);
          const isFuture = isFutureDate(day);
          const today_check = isToday(day);
          const selected = isSelected(day);
          const hasActiv = hasActivity(day);

          return (
            <motion.button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={isFuture}
              className={`aspect-square rounded-lg text-xs font-medium transition-all relative overflow-hidden group ${committed ? 'ring-2 ring-accent' : ''} ${isFuture ? 'opacity-30 cursor-not-allowed' : ''}`}
              whileHover={isFuture ? {} : { scale: 1.05 }}
              whileTap={isFuture ? {} : { scale: 0.95 }}
              style={{
                background: today_check
                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.2))"
                  : selected
                  ? "var(--primary)"
                  : committed
                  ? "rgba(99, 102, 241, 0.2)"
                  : hasActiv
                  ? "rgba(16, 185, 129, 0.15)"
                  : "var(--muted)",
                color: selected ? "var(--primary-foreground)" : "var(--foreground)",
                border: today_check ? "2px solid rgba(59, 130, 246, 0.6)" : "1px solid var(--border)",
                boxShadow: today_check ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
              }}
            >
              <div className="relative z-10">
                {day}
              </div>

              {/* Indicators */}
              {today_check && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-0.5 left-0.5 px-1.5 py-0.5 bg-blue-500/80 text-[8px] font-bold text-white rounded-sm"
                >
                  Today
                </motion.div>
              )}
                  {committed && !selected && (
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-green-500" />
                  )}
                  {hasActiv && !selected && (
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-emerald-400" />
                  )}
                  {isHoliday(day) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHolidayClick(day);
                      }}
                      type="button"
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border-2 cursor-pointer hover:scale-150 transition-all pointer-events-auto ${
                        isHolidayClicked(day)
                          ? "bg-rose-500 border-rose-600 ring-2 ring-rose-400/50 shadow-lg shadow-rose-400/50"
                          : "bg-amber-400 border-amber-600 hover:shadow-lg hover:shadow-amber-400/50"
                      }`}
                      title={getHolidayName(day) || "Holiday"}
                    />
                  )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
        <div className="text-[10px] text-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1" />
          <p className="text-muted-foreground">Worked</p>
        </div>
        <div className="text-[10px] text-center">
          <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto mb-1" />
          <p className="text-muted-foreground">Active</p>
        </div>
        <div className="text-[10px] text-center">
          <div className="w-3 h-3 rounded-full bg-amber-400 mx-auto mb-1" />
          <p className="text-muted-foreground">Holiday</p>
        </div>
        <div className="text-[10px] text-center">
          <div className="w-3 h-3 rounded-full bg-rose-500 ring-1 ring-rose-400 mx-auto mb-1" />
          <p className="text-muted-foreground">Viewed</p>
        </div>
      </div>

      {/* Year Progress Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-[11px] text-muted-foreground mb-2">
          Year Progress {new Date().getFullYear()}
        </div>
        {(() => {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          const endOfYear = new Date(today.getFullYear(), 11, 31);
          const daysInYear = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const daysPassed = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const percentage = Math.round((daysPassed / daysInYear) * 100);
          return (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{daysPassed} / {daysInYear} days</span>
                <span className="font-semibold">{percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
