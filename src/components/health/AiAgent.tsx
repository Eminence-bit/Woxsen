
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bot, Send } from "lucide-react";
import { analyzeHealthRecord } from "@/services/aiAgent";
import { toast } from "sonner";

interface AiAgentProps {
  recordId: string;
  userId: string;
}

export function AiAgent({ recordId, userId }: AiAgentProps) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState<{ text: string; mealPlan?: string[]; recommendations?: string[] } | null>(null);

  const handleAnalyze = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeHealthRecord(recordId, userId);
      setAnalysis(result);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      toast.error('Failed to analyze record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a question about your health record..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="self-start"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {analysis && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Analysis</h3>
                <p className="text-sm text-muted-foreground">{analysis.text}</p>
              </div>
              
              {analysis.mealPlan && analysis.mealPlan.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Recommended Meal Plan</h3>
                  <ul className="list-disc pl-4">
                    {analysis.mealPlan.map((meal, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{meal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Health Recommendations</h3>
                  <ul className="list-disc pl-4">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
