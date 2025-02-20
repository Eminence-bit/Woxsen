import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Moon, Globe } from "lucide-react";
import { toast } from "sonner";

interface PreferencesProps {
  preferences: {
    pushNotifications: boolean;
    soundEffects: boolean;
    darkMode: boolean;
    reduceMotion: boolean;
    useDeviceLanguage: boolean;
    regionalFormat: boolean;
  };
  onToggle: (key: string) => void;
}

export const PreferencesCard = ({ preferences, onToggle }: PreferencesProps) => {
  const handleToggle = (key: string) => {
    console.log('Toggle clicked:', key);
    try {
      onToggle(key);
      toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!preferences[key as keyof typeof preferences] ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling preference:', error);
      toast.error('Failed to update preference');
    }
  };

  const sections = [
    {
      title: "APP PREFERENCES",
      icon: Bell,
      items: [
        { key: 'pushNotifications', label: "PUSH NOTIFICATIONS" },
        { key: 'soundEffects', label: "SOUND EFFECTS" },
      ],
    },
    {
      title: "DISPLAY",
      icon: Moon,
      items: [
        { key: 'darkMode', label: "DARK MODE" },
        { key: 'reduceMotion', label: "REDUCE MOTION" },
      ],
    },
    {
      title: "LANGUAGE & REGION",
      icon: Globe,
      items: [
        { key: 'useDeviceLanguage', label: "USE DEVICE LANGUAGE" },
        { key: 'regionalFormat', label: "REGIONAL FORMAT" },
      ],
    },
  ];

  return (
    <div className="space-y-4 w-full">
      {sections.map((section) => (
        <Card key={section.title} className="w-full bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <h2 className="font-mono text-xs sm:text-sm">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs sm:text-sm font-mono">
                    {item.label}
                  </span>
                  <Switch 
                    checked={preferences[item.key as keyof typeof preferences]}
                    onCheckedChange={() => handleToggle(item.key)}
                    className="data-[state=checked]:bg-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};