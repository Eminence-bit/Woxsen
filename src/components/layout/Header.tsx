import { Bell, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  showBackButton: boolean;
}

export const Header = ({ showBackButton }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/26407d83-9dec-4656-81b5-1e8b9a964a81.png" 
              alt="MedTrack Logo" 
              className="h-6 w-6 invert dark:invert-0 border-2 border-foreground rounded-md p-0.5"
            />
            <span className="text-xl font-nothing tracking-wider">MEDTRACK</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};