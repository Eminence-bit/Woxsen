import { HomeIcon, Calendar, Users, FileText, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    onTabChange(path);
    navigate(path === "home" ? "/" : `/${path}`);
  };

  const navItems = [
    { icon: HomeIcon, id: "home", label: "Home" },
    { icon: Calendar, id: "reminders", label: "Reminders" },
    { icon: Users, id: "community", label: "Community" },
    { icon: FileText, id: "health-records", label: "Records" },
    { icon: Bell, id: "hospitals", label: "Hospitals" },
    { icon: Settings, id: "settings", label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t h-16 nothing-dots">
      <div className="container max-w-md mx-auto h-full">
        <div className="grid grid-cols-6 h-full">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`
                relative flex flex-col items-center justify-center h-full w-full transition-all duration-300 ease-in-out nothing-glow
                ${
                  activeTab === item.id
                    ? "text-primary after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-primary"
                }
                active:scale-95
              `}
              onClick={() => handleNavigation(item.id)}
              title={item.label}
            >
              <item.icon className="h-6 w-6" />
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};