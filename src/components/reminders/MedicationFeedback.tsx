import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, MessageCircle } from "lucide-react";
import { database } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedicationFeedbackProps {
  medicationId: string;
  userId: string;
  timestamp: string;
}

const predefinedMessages = [
  "Feeling good after taking medication",
  "Experiencing mild side effects",
  "Need to discuss with doctor",
  "Medication working well",
  "Other"
];

export const MedicationFeedback = ({ medicationId, userId, timestamp }: MedicationFeedbackProps) => {
  const [mood, setMood] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    try {
      const feedbackRef = ref(
        database,
        `medications/${userId}/${medicationId}/feedback/${timestamp}`
      );
      await set(feedbackRef, {
        mood,
        message,
        timestamp: Date.now(),
      });

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-nothing mt-4">
      <CardContent className="p-4 space-y-4">
        <h4 className="font-nothing">HOW ARE YOU FEELING?</h4>
        <div className="flex justify-around">
          <Button
            variant={mood === "good" ? "default" : "ghost"}
            onClick={() => setMood("good")}
            className="flex flex-col items-center gap-1"
          >
            <Smile className="h-6 w-6" />
            Good
          </Button>
          <Button
            variant={mood === "okay" ? "default" : "ghost"}
            onClick={() => setMood("okay")}
            className="flex flex-col items-center gap-1"
          >
            <Meh className="h-6 w-6" />
            Okay
          </Button>
          <Button
            variant={mood === "bad" ? "default" : "ghost"}
            onClick={() => setMood("bad")}
            className="flex flex-col items-center gap-1"
          >
            <Frown className="h-6 w-6" />
            Bad
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-nothing">ADD A MESSAGE</label>
          <Select onValueChange={setMessage}>
            <SelectTrigger>
              <SelectValue placeholder="Select a message" />
            </SelectTrigger>
            <SelectContent>
              {predefinedMessages.map((msg) => (
                <SelectItem key={msg} value={msg}>
                  {msg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSubmitFeedback} 
          className="w-full button-nothing"
          disabled={!mood}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
};