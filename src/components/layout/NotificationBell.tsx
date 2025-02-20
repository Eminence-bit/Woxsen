import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { checkAndTriggerNotifications } from "@/services/notifications";

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Request notification permission on mount
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    // Check for notifications every minute
    const interval = setInterval(() => {
      checkAndTriggerNotifications(user.uid);
    }, 60000); // Every minute

    // Initial check
    checkAndTriggerNotifications(user.uid);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-4 w-4" />
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </Button>
  );
};