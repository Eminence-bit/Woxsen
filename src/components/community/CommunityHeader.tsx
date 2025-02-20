import { Button } from "@/components/ui/button";
import { MessageSquare, Compass, Plus, Activity, BookOpen } from "lucide-react";

interface CommunityHeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const CommunityHeader = ({ activeSection, onSectionChange }: CommunityHeaderProps) => {
  const sections = [
    { id: "feed", label: "FEED", icon: MessageSquare },
    { id: "explore", label: "EXPLORE", icon: Compass },
    { id: "create", label: "CREATE POST", icon: Plus },
    { id: "activities", label: "ACTIVITIES", icon: Activity },
    { id: "guidelines", label: "GUIDELINES", icon: BookOpen },
  ];

  return (
    <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "default" : "outline"}
          className="button-nothing flex items-center gap-2 whitespace-nowrap"
          onClick={() => onSectionChange(section.id)}
        >
          <section.icon className="h-4 w-4" />
          {section.label}
        </Button>
      ))}
    </div>
  );
};