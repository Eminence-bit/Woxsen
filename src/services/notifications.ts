import { database } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";
import { format } from "date-fns";

export const checkAndTriggerNotifications = async (userId: string) => {
  console.log("Checking notifications for user:", userId);
  
  try {
    const medicationsRef = ref(database, `medications/${userId}`);
    const snapshot = await get(medicationsRef);
    
    if (!snapshot.exists()) {
      console.log("No medications found for notifications");
      return;
    }

    const medications = Object.values(snapshot.val());
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const today = format(now, 'yyyy-MM-dd');

    medications.forEach((medication: any) => {
      if (medication.timings.includes(currentTime)) {
        // Check if medication hasn't been marked for today
        if (!medication.taken?.[today]) {
          console.log("Triggering notification for:", medication.name);
          
          // Request notification permission if not granted
          if (Notification.permission === "granted") {
            new Notification("Medication Reminder", {
              body: `Time to take ${medication.name}`,
              icon: "/favicon.ico",
              tag: `med-${medication.id}`,
              requireInteraction: true
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification("Medication Reminder", {
                  body: `Time to take ${medication.name}`,
                  icon: "/favicon.ico",
                  tag: `med-${medication.id}`,
                  requireInteraction: true
                });
              }
            });
          }
        }
      }
    });
  } catch (error) {
    console.error("Error checking notifications:", error);
  }
};