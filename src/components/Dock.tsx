import { useLocation, useNavigate } from "react-router-dom";
import { Plus, BarChart3, User, Crown, Home } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const Dock = () => {
  const { isPremium } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine where the middle button should navigate and what icon to show
  // Show Home icon if we are NOT on the dashboard
  const isNotDashboard = location.pathname !== "/dashboard" && location.pathname !== "/";
  
  console.log("Current pathname:", location.pathname);
  console.log("Is showing home icon:", isNotDashboard);
  
  const handleMiddleButtonClick = () => {
    if (isNotDashboard) {
      // If not on dashboard, go home
      navigate("/dashboard");
    } else {
      // Otherwise (on dashboard), go to create page
      navigate("/create");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background/95 backdrop-blur-sm border-t border-border z-40 pointer-events-auto">
      <div className="flex items-center justify-between px-6 py-4">
        <NavBtn 
          icon={BarChart3} 
          label="Report" 
          onClick={() => handleNavigation("/report")} 
        />
        <button
          onClick={handleMiddleButtonClick}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg hover:scale-110"
        >
          {isNotDashboard ? (
            <Home className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Plus className="w-4 h-4 text-primary-foreground" />
          )}
        </button>
        <NavBtn 
          icon={User} 
          label="Profile" 
          onClick={() => handleNavigation("/profile")} 
        />
        {!isPremium && (
          <NavBtn 
            icon={Crown} 
            label="Pro" 
            onClick={() => handleNavigation("/premium")} 
          />
        )}
      </div>
    </div>
  );
};

const NavBtn = ({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: typeof BarChart3; 
  label: string; 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors hover:scale-110"
  >
    <Icon className="w-4 h-4" />
    <span className="text-[10px]">{label}</span>
  </button>
);
