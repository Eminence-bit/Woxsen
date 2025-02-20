
import { FileText, Calendar, Eye, Download, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RecordActions } from "./RecordActions";
import { Button } from "@/components/ui/button";
import type { HealthRecord } from "@/services/healthRecords";
import { analyzeHealthRecord } from "@/services/aiAgent";
import { AiAgent } from "./AiAgent";
import { toast } from "sonner";
import { useState } from "react";

interface RecordCardProps {
  record: HealthRecord;
  onPreview: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
  onDownload: (fileUrl: string, fileName: string) => void;
}

export function RecordCard({ record, onPreview, onDelete, onDownload }: RecordCardProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [showAiAgent, setShowAiAgent] = useState(false);

  const handleAnalyze = async () => {
    if (!record.id || !record.userId) {
      toast.error("Cannot analyze this record");
      return;
    }

    setAnalyzing(true);
    try {
      await analyzeHealthRecord(record.id, record.userId);
      setShowAiAgent(true);
      toast.success("Document analyzed successfully");
    } catch (error) {
      console.error("Error analyzing document:", error);
      toast.error("Failed to analyze document");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="card-nothing hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-nothing flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {record.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2 font-nothing">
                <Calendar className="h-4 w-4" />
                {new Date(record.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground font-nothing">{record.doctor}</p>
              {record.notes && (
                <p className="text-sm text-muted-foreground mt-2 font-nothing">{record.notes}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                <Search className="h-4 w-4 mr-2" />
                {analyzing ? "Analyzing..." : "Ask AI Assistant"}
              </Button>
            </div>
            <RecordActions
              record={record}
              onPreview={onPreview}
              onDelete={onDelete}
              onDownload={onDownload}
            />
          </div>
        </CardContent>
      </Card>
      
      {showAiAgent && record.id && record.userId && (
        <AiAgent recordId={record.id} userId={record.userId} />
      )}
    </div>
  );
}
