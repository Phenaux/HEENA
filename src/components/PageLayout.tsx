import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Dock } from "@/components/Dock";

interface PageLayoutProps {
  children: React.ReactNode;
  showTitle?: string;
}

const PHASE_COLORS = {
  1: "#A78BFA",  // Purple
  2: "#6366F1",  // Indigo
  3: "#14B8A6",  // Teal
  4: "#EC4899",  // Pink
  5: "#F59E0B",  // Amber
};

export const PageLayout = ({ children, showTitle }: PageLayoutProps) => {
  const { phase, backgroundImage, customSettings, isPremium, premiumTrialEndDate } = useAppStore();
  const navigate = useNavigate();
  const phaseColor = PHASE_COLORS[phase as keyof typeof PHASE_COLORS] || PHASE_COLORS[1];

  // Check if trial is still active
  const isTrialActive = premiumTrialEndDate ? new Date(premiumTrialEndDate) > new Date() : false;

  return (
    <>
      {/* Full-Screen Background Layer - Constrained to app width */}
      <div className="fixed inset-0 -z-50 w-screen h-screen overflow-hidden">
        <div className="w-full h-full max-w-md mx-auto flex flex-col">
          {/* Header spacer (accounts for fixed header height) */}
          <div className="h-20 flex-shrink-0" />
          
          {/* Background image area - behind content */}
          {backgroundImage && (
            <div
              className="flex-1 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundAttachment: 'scroll',
                backgroundPosition: 'center',
              }}
            />
          )}
          
          {/* Fallback color if no image */}
          {!backgroundImage && <div className="flex-1 bg-background" />}
        </div>
        
        {/* Dark overlay */}
        <div
          className="absolute inset-0 max-w-md mx-auto transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${customSettings.bgDimLevel})`,
          }}
        />
      </div>

      {/* Main App Container */}
      <div className="relative z-0 min-h-screen flex flex-col max-w-md mx-auto bg-transparent">
        {/* Fixed Top Brand Bar - No bounce animation */}
        <div className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background/95 backdrop-blur-sm border-b border-border z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <span 
                className="text-2xl font-bold tracking-tight"
                style={{ color: phaseColor }}
              >
                HEENɅ
              </span>
              {isPremium && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isTrialActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}
                >
                  {isTrialActive ? 'TRIAL' : 'PRO'}
                </motion.span>
              )}
            </div>
            {showTitle && (
              <h1 className="text-sm font-semibold text-foreground">{showTitle}</h1>
            )}
            <button
              onClick={() => navigate("/settings")}
              className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors hover:scale-110"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content - with top and bottom padding for fixed bars */}
        <div className="flex-1 pt-20 pb-20 overflow-y-auto">
          {children}
        </div>

        {/* Fixed Bottom Dock Component */}
        <Dock />
      </div>
    </>
  );
};
