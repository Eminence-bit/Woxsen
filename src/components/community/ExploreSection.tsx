import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const ExploreSection = () => {
  const topics = ["Mental Health", "Nutrition", "Exercise", "Meditation", "Sleep", "Wellness"];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10 input-nothing" placeholder="Search posts, topics, or users..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Card key={topic} className="card-nothing hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <h3 className="font-nothing text-sm">{topic}</h3>
              <p className="text-xs text-muted-foreground mt-1">Join the discussion</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};