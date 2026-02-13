import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

const GenderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const gender = useAppStore((s) => s.profile?.gender);
  const currentTheme = useAppStore((s) => s.currentTheme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply gender theme
    if (gender === "female") {
      root.setAttribute("data-gender", "female");
    } else if (gender === "male") {
      root.setAttribute("data-gender", "male");
    } else {
      root.removeAttribute("data-gender");
    }
    
    // Apply cosmetic theme (Rose Gold is default)
    root.setAttribute("data-theme", currentTheme);
  }, [gender, currentTheme]);

  return <>{children}</>;
};

export default GenderThemeProvider;
