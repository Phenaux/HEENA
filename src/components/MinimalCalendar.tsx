import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MinimalCalendarProps {
  phaseColor?: string;
}

interface Holiday {
  date: string;
  name: string;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Common holidays by country (ISO 3166-1 alpha-2)
const HOLIDAYS_BY_COUNTRY: { [key: string]: { [key: string]: string } } = {
  US: {
    "01-01": "New Year",
    "01-20": "MLK Jr. Day",
    "02-17": "Presidents Day",
    "05-27": "Memorial Day",
    "07-04": "Independence Day",
    "09-02": "Labor Day",
    "10-14": "Columbus Day",
    "11-11": "Veterans Day",
    "11-28": "Thanksgiving",
    "12-25": "Christmas",
  },
  GB: {
    "01-01": "New Year",
    "04-19": "Good Friday",
    "04-22": "Easter Monday",
    "05-06": "Early May Bank",
    "05-27": "Spring Bank",
    "08-26": "Summer Bank",
    "12-25": "Christmas",
    "12-26": "Boxing Day",
  },
  CA: {
    "01-01": "New Year",
    "02-18": "Family Day",
    "03-29": "Good Friday",
    "05-20": "Victoria Day",
    "07-01": "Canada Day",
    "08-05": "Civic Holiday",
    "09-02": "Labour Day",
    "09-30": "National Day Truth",
    "12-25": "Christmas",
    "12-26": "Boxing Day",
  },
  IN: {
    "01-26": "Republic Day",
    "03-25": "Holi",
    "04-17": "Ram Navami",
    "04-21": "Mahavir Jayanti",
    "05-23": "Buddha Purnima",
    "08-15": "Independence Day",
    "09-16": "Milad-un-Nabi",
    "10-02": "Gandhi Jayanti",
    "12-25": "Christmas",
  },
  AU: {
    "01-01": "New Year",
    "01-26": "Australia Day",
    "04-10": "Good Friday",
    "04-13": "Easter Monday",
    "04-25": "Anzac Day",
    "06-10": "Queen's Birthday",
    "12-25": "Christmas",
    "12-26": "Boxing Day",
  },
};

export const MinimalCalendar = ({ phaseColor = "#A78BFA" }: MinimalCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [userCountry, setUserCountry] = useState("US");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const today = new Date();

  useEffect(() => {
    // Get user country from locale or geolocation
    const getCountry = async () => {
      try {
        // Try to get from browser language
        const lang = navigator.language || navigator.languages?.[0];
        const countryCode = lang?.split("-")[1]?.toUpperCase() || "US";
        setUserCountry(countryCode);
      } catch (err) {
        console.log("Using default country: US");
        setUserCountry("US");
      }
    };
    getCountry();
  }, []);

  useEffect(() => {
    // Load holidays for the current month
    const countryHolidays = HOLIDAYS_BY_COUNTRY[userCountry] || HOLIDAYS_BY_COUNTRY["US"];
    const monthHolidays: Holiday[] = [];
    
    for (const [dateStr, name] of Object.entries(countryHolidays)) {
      const [month, day] = dateStr.split("-");
      if (parseInt(month) === currentMonth.getMonth() + 1) {
        monthHolidays.push({
          date: dateStr,
          name,
        });
      }
    }
    setHolidays(monthHolidays);
  }, [currentMonth, userCountry]);

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

  const isHoliday = (day: number) => {
    const monthStr = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return holidays.some((h) => h.date === `${monthStr}-${dayStr}`);
  };

  const getHolidayName = (day: number) => {
    const monthStr = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return holidays.find((h) => h.date === `${monthStr}-${dayStr}`)?.name;
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-5 bg-card border border-border/60 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
        <h3
          className="text-sm font-semibold"
          style={{ color: phaseColor }}
        >
          {monthYear}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-tight py-1"
          >
            {day.slice(0, 2)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const today_check = isToday(day);
          const holiday = isHoliday(day);
          const holidayName = getHolidayName(day);

          return (
            <motion.div
              key={day}
              className="relative group"
              whileHover={today_check ? {} : { scale: 1.08 }}
            >
              <div
                className="aspect-square rounded-md flex items-center justify-center text-xs font-semibold transition-all relative"
                style={{
                  background: today_check
                    ? phaseColor
                    : holiday
                    ? `${phaseColor}15`
                    : "transparent",
                  color: today_check ? "#000" : "var(--foreground)",
                  border:
                    today_check || holiday
                      ? `1.5px solid ${phaseColor}`
                      : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                {day}
                {holiday && (
                  <div
                    className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: phaseColor }}
                  />
                )}
              </div>
              
              {/* Holiday tooltip */}
              {holiday && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  whileHover={{ opacity: 1, y: -8 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-[9px] font-medium rounded whitespace-nowrap pointer-events-none z-10"
                >
                  {holidayName}
                </motion.div>
              )}

              {/* Today indicator */}
              {today_check && (
                <motion.div
                  className="absolute inset-0 rounded-md"
                  style={{
                    border: `1.5px solid ${phaseColor}`,
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current date info */}
      <div className="mt-5 pt-4 border-t border-border/50 text-center">
        <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
          Today
        </p>
        <p
          className="text-sm font-semibold"
          style={{ color: phaseColor }}
        >
          {today.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </motion.div>
  );
};
