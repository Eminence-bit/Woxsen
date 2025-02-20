import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  user: User | null;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    console.log('Profile clicked, navigating to /profile');
    navigate('/profile');
  };

  return (
    <Card 
      className="w-full bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleProfileClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleProfileClick();
        }
      }}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-2 ring-primary/10">
            <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-primary/10 font-mono">
              {user?.displayName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-mono truncate">
              {user?.displayName || "USER"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
              {user?.email}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};