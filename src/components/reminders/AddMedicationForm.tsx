import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addMedication } from "@/services/reminders";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddMedicationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMedicationForm = ({ onClose, onSuccess }: AddMedicationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMedication, setNewMedication] = useState({
    name: "",
    startDate: "",
    endDate: "",
    timings: [""],
    remarks: "",
    frequency: "",
  });

  const handleAddTiming = () => {
    setNewMedication({
      ...newMedication,
      timings: [...newMedication.timings, ""],
    });
  };

  const handleRemoveTiming = (index: number) => {
    const newTimings = newMedication.timings.filter((_, i) => i !== index);
    setNewMedication({
      ...newMedication,
      timings: newTimings,
    });
  };

  const handleTimingChange = (index: number, value: string) => {
    const newTimings = [...newMedication.timings];
    newTimings[index] = value;
    setNewMedication({
      ...newMedication,
      timings: newTimings,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add medications",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await addMedication({
        ...newMedication,
        userId: user.uid,
      });
      
      toast({
        title: "Success",
        description: "Medication added successfully",
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in card-nothing">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-nothing">NEW MEDICATION</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="nothing-glow"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">MEDICATION NAME</Label>
            <Input
              id="name"
              placeholder="Enter medication name"
              value={newMedication.name}
              onChange={(e) =>
                setNewMedication({ ...newMedication, name: e.target.value })
              }
              className="input-nothing"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">START DATE</Label>
              <Input
                id="startDate"
                type="date"
                value={newMedication.startDate}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, startDate: e.target.value })
                }
                className="input-nothing"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">END DATE</Label>
              <Input
                id="endDate"
                type="date"
                value={newMedication.endDate}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, endDate: e.target.value })
                }
                className="input-nothing"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>TIMINGS</Label>
            {newMedication.timings.map((timing, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="time"
                  value={timing}
                  onChange={(e) => handleTimingChange(index, e.target.value)}
                  className="input-nothing flex-1"
                  required
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
              placeholder="Daily, Twice a day, etc."
              value={newMedication.frequency}
              onChange={(e) =>
                setNewMedication({ ...newMedication, frequency: e.target.value })
              }
              className="input-nothing"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">REMARKS</Label>
            <Textarea
              id="remarks"
              placeholder="Take after food, etc."
              value={newMedication.remarks}
              onChange={(e) =>
                setNewMedication({ ...newMedication, remarks: e.target.value })
              }
              className="input-nothing resize-none"
            />
          </div>

          <Button 
            className="w-full button-nothing" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "SAVING..." : "SAVE MEDICATION"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};