import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import Onboarding from "./Onboarding";

const Index = () => {
  const identity = useAppStore((s) => s.identity);
  const profile = useAppStore((s) => s.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) return;

    if (!profile) {
      navigate("/profile", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  }, [identity, profile, navigate]);

  if (!identity) {
    return <Onboarding />;
  }

  return null;
};

export default Index;
