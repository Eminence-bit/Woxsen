import { Button } from "@/components/ui/button";
import { Shield, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PreferencesCard } from "@/components/settings/PreferencesCard";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { usePreferences } from "@/hooks/usePreferences";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { preferences, handleToggle } = usePreferences();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  const handleNavigation = (path: string) => {
    console.log('Navigation clicked:', path);
    if (path === '/privacy' || path === '/help') {
      toast.info("This feature will be available soon!");
      return;
    }
    navigate(path);
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-6 space-y-6">
      <ProfileCard user={user} />

      <PreferencesCard 
        preferences={preferences}
        onToggle={handleToggle}
      />

      <div className="space-y-2">
        {[
          { icon: Shield, label: "PRIVACY & SECURITY", onClick: () => handleNavigation('/privacy') },
          { icon: HelpCircle, label: "HELP & SUPPORT", onClick: () => handleNavigation('/help') },
          { icon: LogOut, label: "LOGOUT", onClick: handleLogout, variant: "destructive" as const },
        ].map((item) => (
          <Button
            key={item.label}
            variant={item.variant || "ghost"}
            className="w-full justify-start h-12 sm:h-14 px-4 font-mono hover:bg-accent/50 cursor-pointer"
            onClick={item.onClick}
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
            <span className="text-xs sm:text-sm">{item.label}</span>
          </Button>
        ))}
      </div>

      <div className="text-xs text-center text-muted-foreground font-mono space-y-1 pt-4">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>VERSION: 1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;