import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddMedicationForm } from "@/components/reminders/AddMedicationForm";
import { WeeklyOverview } from "@/components/reminders/WeeklyOverview";
import { ComplianceChart } from "@/components/reminders/ComplianceChart";
import { MedicationStatus } from "@/components/reminders/MedicationStatus";
import { useMedications } from "@/hooks/useMedications";
import { Card, CardContent } from "@/components/ui/card";
import { Medication } from "@/types/medication";
import { database } from "@/lib/firebase";
import { ref, update, remove } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Reminders = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: medications, isLoading, refetch } = useMedications();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpdate = async (updatedMedication: Medication) => {
    if (!user) return;
    
    try {
      const medicationRef = ref(database, `medications/${user.uid}/${updatedMedication.id}`);
      await update(medicationRef, updatedMedication);
      refetch();
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      const medicationRef = ref(database, `medications/${user.uid}/${id}`);
      await remove(medicationRef);
      refetch();
      toast({
        title: "Medication deleted successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Failed to delete medication",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-nothing">REMINDERS</h1>
        <Button onClick={() => setShowAddForm(true)} className="button-nothing gap-2">
          <Plus className="h-4 w-4" />
          ADD MEDICATION
        </Button>
      </div>

      {showAddForm && (
        <AddMedicationForm 
          onClose={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            refetch();
          }} 
        />
      )}

      <WeeklyOverview />
      <ComplianceChart />

      <div className="space-y-4">
        <h3 className="font-nothing">TODAY'S MEDICATIONS</h3>
        {isLoading ? (
          <Card className="card-nothing">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">Loading medications...</p>
            </CardContent>
          </Card>
        ) : medications && medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationStatus
              key={medication.id}
              medication={medication}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Card className="card-nothing">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">No active medications</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default Reminders;