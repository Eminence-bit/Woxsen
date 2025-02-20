import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";
import { EditMedicationDialog } from "./EditMedicationDialog";
import { useToast } from "@/components/ui/use-toast";
import { Medication } from "@/types/medication";

interface MedicationStatusProps {
  medication: Medication;
  onUpdate: (updatedMedication: Medication) => void;
  onDelete: (id: string) => void;
}

export const MedicationStatus = ({
  medication,
  onUpdate,
  onDelete,
}: MedicationStatusProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const handleStatusUpdate = async (taken: boolean) => {
    try {
      console.log('Updating medication status:', { medicationId: medication.id, taken });
      const updatedMedication = {
        ...medication,
        taken: {
          ...medication.taken,
          [today]: taken,
        },
      };
      await onUpdate(updatedMedication);
      toast({
        title: taken ? "Medication marked as taken" : "Medication marked as not taken",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error updating medication status:', error);
      toast({
        title: "Failed to update medication status",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleEdit = () => {
    console.log('Opening edit dialog for medication:', medication.name);
    setShowEditDialog(true);
  };

  const handleEditSuccess = async (updatedMedication: Medication) => {
    try {
      console.log('Submitting medication update:', updatedMedication);
      await onUpdate(updatedMedication);
      setShowEditDialog(false);
      toast({
        title: "Medication updated successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error updating medication:', error);
      toast({
        title: "Failed to update medication",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 
                className="font-nothing cursor-pointer hover:text-primary transition-colors"
                onClick={handleEdit}
              >
                {medication.name}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-6 w-6 cursor-pointer hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusUpdate(true)}
                className={`h-8 w-8 ${
                  medication.taken?.[today] === true ? "bg-green-100 text-green-600" : ""
                }`}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusUpdate(false)}
                className={`h-8 w-8 ${
                  medication.taken?.[today] === false ? "bg-red-100 text-red-600" : ""
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {medication.frequency} - {medication.timings.join(", ")}
          </p>
        </div>
      </div>

      <EditMedicationDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        medication={medication}
        onSuccess={handleEditSuccess}
        onDelete={onDelete}
      />
    </div>
  );
};