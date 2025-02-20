import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface CreatePostProps {
  onSubmit: (content: string) => void;
}

export const CreatePost = ({ onSubmit }: CreatePostProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  const handleImageClick = () => {
    toast.info("Image upload feature coming soon!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="nothing-glow bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] nothing-glow bg-background/80"
          />
          <div className="flex items-center justify-between mt-4">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleImageClick}
              className="nothing-glow"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button type="submit" disabled={!content.trim()} className="nothing-glow">
              Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};