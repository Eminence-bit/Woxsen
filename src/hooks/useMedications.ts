import { useQuery } from "@tanstack/react-query";
import { getMedications } from "@/services/reminders";
import { useAuth } from "@/contexts/AuthContext";

export const useMedications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["medications", user?.uid],
    queryFn: () => getMedications(user?.uid || ""),
    enabled: !!user?.uid,
  });
};