
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { HealthRecord } from "@/services/healthRecords";
import { AiAgent } from "./AiAgent";

interface RecordPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: HealthRecord | null;
}

export function RecordPreviewDialog({ isOpen, onClose, record }: RecordPreviewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{record.title}</h2>
          <div className="aspect-[16/9] relative">
            {record.fileUrl && (
              <iframe
                src={record.fileUrl}
                className="w-full h-full"
                title={record.title}
              />
            )}
          </div>
          
          {record.userId && record.id && (
            <AiAgent recordId={record.id} userId={record.userId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
