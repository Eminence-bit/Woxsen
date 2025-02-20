import { Post } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Share2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const PostCard = ({ post, onLike, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const isAuthor = user?.uid === post.author.id;
  const hasLiked = post.likedBy?.includes(user?.uid || "");

  const handleCommentClick = () => {
    toast.info("Comments feature coming soon!", {
      description: "We're working on implementing comments.",
      duration: 3000,
    });
  };

  return (
    <Card className="animate-fade-in nothing-glow bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            {post.author.name[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{post.author.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
              <span className="text-sm text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(post.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        <p className="text-sm mb-4">{post.content}</p>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 group nothing-glow ${hasLiked ? 'text-primary' : ''}`}
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp className={`h-4 w-4 group-hover:scale-110 transition-transform duration-300 ${
              hasLiked ? 'fill-primary' : ''
            }`} />
            {post.likes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 group nothing-glow"
            onClick={handleCommentClick}
          >
            <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            {post.comments}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 group nothing-glow">
            <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
          </Button>
          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive ml-auto group nothing-glow"
              onClick={() => onDelete(post.id)}
            >
              <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};