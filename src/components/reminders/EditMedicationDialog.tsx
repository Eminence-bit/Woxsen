import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";
import { Medication } from "@/types/medication";

interface EditMedicationDialogProps {
  medication: Medication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (medication: Medication) => void;
  onDelete?: (id: string) => void;
}

export const EditMedicationDialog = ({
  medication,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: EditMedicationDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [editedMedication, setEditedMedication] = useState<Medication>({
    ...medication,
    remarks: medication.remarks || "",
  });

  const handleAddTiming = () => {
    setEditedMedication({
      ...editedMedication,
      timings: [...editedMedication.timings, ""],
    });
  };

  const handleRemoveTiming = (index: number) => {
    const newTimings = editedMedication.timings.filter((_, i) => i !== index);
    setEditedMedication({
      ...editedMedication,
      timings: newTimings,
    });
  };

  const handleTimingChange = (index: number, value: string) => {
    const newTimings = [...editedMedication.timings];
    newTimings[index] = value;
    setEditedMedication({
      ...editedMedication,
      timings: newTimings,
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log('Submitting medication update:', editedMedication);
      
      const medicationRef = ref(database, `medications/${medication.userId}/${medication.id}`);
      await update(medicationRef, editedMedication);
      
      toast({
        title: "Success",
        description: "Medication updated successfully",
      });
      
      onSuccess?.(editedMedication);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating medication:', error);
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-nothing">EDIT MEDICATION</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">MEDICATION NAME</Label>
            <Input
              id="name"
              value={editedMedication.name}
              onChange={(e) =>
                setEditedMedication({ ...editedMedication, name: e.target.value })
              }
              className="input-nothing"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">START DATE</Label>
              <Input
                id="startDate"
                type="date"
                value={editedMedication.startDate}
                onChange={(e) =>
                  setEditedMedication({ ...editedMedication, startDate: e.target.value })
                }
                className="input-nothing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">END DATE</Label>
              <Input
                id="endDate"
                type="date"
                value={editedMedication.endDate}
                onChange={(e) =>
                  setEditedMedication({ ...editedMedication, endDate: e.target.value })
                }
                className="input-nothing"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>TIMINGS</Label>
            {editedMedication.timings.map((timing, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="time"
                  value={timing}
                  onChange={(e) => handleTimingChange(index, e.target.value)}
                  className="input-nothing flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveTiming(index)}
                    className="button-nothing"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTiming}
              className="w-full button-nothing mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD TIMING
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">FREQUENCY</Label>
            <Input
              id="frequency"
              value={editedMedication.frequency}
              onChange={(e) =>
                setEditedMedication({ ...editedMedication, frequency: e.target.value })
              }
              className="input-nothing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">REMARKS</Label>
            <Textarea
              id="remarks"
              value={editedMedication.remarks}
              onChange={(e) =>
                setEditedMedication({ ...editedMedication, remarks: e.target.value })
              }
              className="input-nothing resize-none"
            />
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          className="w-full button-nothing"
          disabled={isLoading}
        >
          {isLoading ? "UPDATING..." : "UPDATE MEDICATION"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};