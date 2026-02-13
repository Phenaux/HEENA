import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import GenderThemeProvider from "@/components/GenderThemeProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PrivacyWelcome } from "@/components/PrivacyWelcome";
import { triggerHaptic } from "@/hooks/use-haptic";
// import { trackUserDevice } from "@/lib/tracking";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import WeeklyReport from "./pages/WeeklyReport";
import Onboarding from "./pages/Onboarding";
import ModeSetup from "./pages/ModeSetup";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import Settings from "./pages/Settings";
import CreateTask from "./pages/CreateTask";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const welcomeStyle = {
  header: "color: #D4AF37; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #D4AF37;",
  info: "color: #06B6D4; font-size: 13px;",
  success: "color: #10B981; font-size: 13px;",
  warning: "color: #F59E0B; font-size: 13px;"
};

if (typeof window !== 'undefined') {
  console.log(
    "%c🎮 HEENA - Adaptive Intelligence System",
    welcomeStyle.header
  );
  console.log(
    "%c✨ Open-source, privacy-first, offline-first\n%c📍 100% local storage - no data leaves your browser\n%c🔗 github.com/yourusername/heena",
    welcomeStyle.info,
    welcomeStyle.success,
    welcomeStyle.info
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPrivacyWelcome, setShowPrivacyWelcome] = useState(false);

  useEffect(() => {
    const hasSeenPrivacyWelcome = localStorage.getItem("privacy_welcome_seen");
    if (!hasSeenPrivacyWelcome) {
      setShowPrivacyWelcome(true);
    }
  }, []);

  useEffect(() => {
    const phases = [0, 25, 50, 75, 90, 100];
    let phaseIndex = 0;

    const loadInterval = setInterval(() => {
      if (phaseIndex < phases.length) {
        setProgress(phases[phaseIndex]);
        if (phases[phaseIndex] === 100) {
          setTimeout(() => {
            setIsLoading(false);
          }, 600);
        }
        phaseIndex++;
      }
    }, 200);

    return () => clearInterval(loadInterval);
  }, []);

  useEffect(() => {
    const handleInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.classList.contains("clickable") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("[role='tab']") ||
        target.closest("[role='menuitem']");

      if (isInteractive) {
        triggerHaptic(10);
      }
    };

    document.addEventListener("click", handleInteraction, true);
    document.addEventListener("touchstart", handleInteraction, true);

    return () => {
      document.removeEventListener("click", handleInteraction, true);
      document.removeEventListener("touchstart", handleInteraction, true);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" isVisible={isLoading} progress={progress} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showPrivacyWelcome && (
          <PrivacyWelcome
            key="privacy-welcome"
            onAccept={() => setShowPrivacyWelcome(false)}
          />
        )}
      </AnimatePresence>

      {!isLoading && !showPrivacyWelcome && (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <GenderThemeProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/setup/:mode" element={<ModeSetup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create" element={<CreateTask />} />
                  <Route path="/report" element={<WeeklyReport />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </GenderThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
