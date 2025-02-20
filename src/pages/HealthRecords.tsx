import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AddHealthRecordDialog } from "@/components/health/AddHealthRecordDialog";
import { RecordPreviewDialog } from "@/components/health/RecordPreviewDialog";
import { RecordCard } from "@/components/health/RecordCard";
import { useAuth } from "@/contexts/AuthContext";
import { getHealthRecords, deleteHealthRecord, type HealthRecord } from "@/services/healthRecords";
import { toast } from "sonner";

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const fetchedRecords = await getHealthRecords(user.uid);
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast.error("Failed to load health records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDelete = async (recordId: string) => {
    if (!user || !recordId) return;
    
    try {
      await deleteHealthRecord(user.uid, recordId);
      toast.success("Record deleted successfully");
      await fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    if (!fileUrl) {
      toast.error("No file available for download");
      return;
    }

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'health-record';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-nothing">HEALTH RECORDS</h1>
        <AddHealthRecordDialog onRecordAdded={fetchRecords} />
      </div>

      {records.length === 0 ? (
        <Card className="card-nothing">
          <CardContent className="p-6 text-center text-muted-foreground font-nothing">
            <p>No health records found. Add your first record to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      <RecordPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
      />

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default HealthRecords;