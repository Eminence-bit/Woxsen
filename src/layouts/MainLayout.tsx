import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Reminders from "@/pages/Reminders";
import Community from "@/pages/Community";
import Hospitals from "@/pages/Hospitals";
import HealthRecords from "@/pages/HealthRecords";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import Profile from "@/pages/Profile";

const MainLayout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname === "/" ? "home" : location.pathname.slice(1));
  const { user, loading } = useAuth();
  
  const showBackButton = location.pathname !== "/";
  const showNavigation = user && !["/login", "/signup", "/onboarding"].includes(location.pathname);

  if (loading) return null;

  if (!user && !["/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  if (user && ["/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background nothing-dots">
      {showNavigation && <Header showBackButton={showBackButton} />}

      <main className={`container max-w-md mx-auto ${showNavigation ? 'pt-20 pb-24' : 'pt-4'} px-4`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/community/*" element={<Community />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {showNavigation && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default MainLayout;