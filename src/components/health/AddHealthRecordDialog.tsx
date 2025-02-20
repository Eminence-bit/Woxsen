import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadHealthRecord, createHealthRecord, type HealthRecord } from "@/services/healthRecords";
import { toast } from "sonner";

interface AddHealthRecordDialogProps {
  onRecordAdded: () => void;
}

export const AddHealthRecordDialog = ({ onRecordAdded }: AddHealthRecordDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    doctor: "",
    type: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let fileUrl = "";
      let fileName = "";
      
      if (file) {
        fileUrl = await uploadHealthRecord(file, user.uid);
        fileName = file.name;
      }

      const record: HealthRecord = {
        ...formData,
        userId: user.uid,
        fileUrl,
        fileName,
      };

      await createHealthRecord(record);
      toast.success("Health record added successfully");
      setOpen(false);
      onRecordAdded();
      
      // Reset form
      setFormData({
        title: "",
        doctor: "",
        type: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
      setFile(null);
    } catch (error) {
      console.error("Error adding health record:", error);
      toast.error("Failed to add health record");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Input
              id="doctor"
              value={formData.doctor}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Record Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laboratory">Laboratory</SelectItem>
                <SelectItem value="Check-up">Check-up</SelectItem>
                <SelectItem value="Immunization">Immunization</SelectItem>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Imaging">Imaging</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Attachment</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Record
              </>
            ) : (
              "Add Record"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};