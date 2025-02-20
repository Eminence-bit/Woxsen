import { Button } from "@/components/ui/button";
import { Eye, Download, Trash } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import type { HealthRecord } from "@/services/healthRecords";

interface RecordActionsProps {
  record: HealthRecord;
  onPreview: (record: HealthRecord) => void;
  onDelete: (id: string) => void;
  onDownload: (url: string, filename: string) => void;
}

export function RecordActions({ record, onPreview, onDelete, onDownload }: RecordActionsProps) {
  console.log("RecordActions rendered with record:", record);

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Preview clicked");
    e.preventDefault();
    e.stopPropagation();
    onPreview(record);
  };

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Download clicked");
    e.preventDefault();
    e.stopPropagation();
    if (record.fileUrl) {
      onDownload(record.fileUrl, record.fileName || 'download');
    }
  };

  const handleDelete = () => {
    console.log("Delete clicked");
    if (record.id) {
      onDelete(record.id);
    }
  };

  return (
    <div 
      className="flex items-center gap-2 relative z-10" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {record.fileUrl && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePreview}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <Download className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            type="button"
            variant="outline"
            size="icon"
            className="cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              health record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}