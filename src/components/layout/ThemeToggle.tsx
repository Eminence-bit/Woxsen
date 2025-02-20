import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/usePreferences";

export const ThemeToggle = () => {
  const { preferences, handleToggle } = usePreferences();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => handleToggle('darkMode')}
    >
      {preferences.darkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};