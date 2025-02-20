import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { ExploreSection } from "@/components/community/ExploreSection";
import { PostCard } from "@/components/community/PostCard";
import { CreatePost } from "@/components/community/CreatePost";
import { useCommunityData } from "@/hooks/useCommunityData";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const CommunityFeed = () => {
  const { posts, isLoading, createPost, likePost, deletePost } = useCommunityData();

  if (isLoading) {
    return <div className="text-center py-8 font-nothing">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      <CreatePost onSubmit={(content) => createPost.mutate(content)} />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={(postId) => likePost.mutate(postId)}
          onDelete={(postId) => deletePost.mutate(postId)}
        />
      ))}
    </div>
  );
};

const ActivitiesSection = () => {
  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-4">
        <Card className="card-nothing p-4">
          <h3 className="font-nothing text-lg mb-4">TODAY'S ACTIVITIES</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Dr. Sarah Johnson posted a new article about mental wellness</span>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New members joined the "Healthy Living" group discussion</span>
              <span className="text-xs text-muted-foreground">4h ago</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Weekly meditation session scheduled for tomorrow</span>
              <span className="text-xs text-muted-foreground">5h ago</span>
            </li>
          </ul>
        </Card>
        
        <Card className="card-nothing p-4">
          <h3 className="font-nothing text-lg mb-4">UPCOMING HEALTH EVENTS</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-sm">
              <div>
                <p className="text-foreground font-nothing">Virtual Wellness Workshop</p>
                <p className="text-xs text-muted-foreground">With Dr. Michael Chen</p>
              </div>
              <span className="text-xs text-muted-foreground">Tomorrow, 3 PM</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div>
                <p className="text-foreground font-nothing">Mental Health Support Group</p>
                <p className="text-xs text-muted-foreground">Weekly Discussion</p>
              </div>
              <span className="text-xs text-muted-foreground">Friday, 5 PM</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div>
                <p className="text-foreground font-nothing">Nutrition Masterclass</p>
                <p className="text-xs text-muted-foreground">With Nutritionist Emma White</p>
              </div>
              <span className="text-xs text-muted-foreground">Saturday, 2 PM</span>
            </li>
          </ul>
        </Card>

        <Card className="card-nothing p-4">
          <h3 className="font-nothing text-lg mb-4">RECENT ACHIEVEMENTS</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Community reached 1000+ active members</span>
              <span className="text-xs text-muted-foreground">Today</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Successfully completed "30 Days Wellness Challenge"</span>
              <span className="text-xs text-muted-foreground">Yesterday</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New mental health resources added to the library</span>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </li>
          </ul>
        </Card>
      </div>
    </ScrollArea>
  );
};

const GuidelinesSection = () => {
  return (
    <ScrollArea className="h-[70vh]">
      <Card className="card-nothing p-6">
        <h3 className="font-nothing text-xl mb-4">Community Guidelines</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-nothing text-lg mb-2">1. Respect & Privacy</h4>
            <p className="text-sm text-muted-foreground">
              Treat all members with respect. Do not share personal medical information
              of others without consent.
            </p>
          </div>
          <div>
            <h4 className="font-nothing text-lg mb-2">2. Medical Advice</h4>
            <p className="text-sm text-muted-foreground">
              Information shared is for general purposes only. Always consult healthcare
              professionals for medical advice.
            </p>
          </div>
          <div>
            <h4 className="font-nothing text-lg mb-2">3. Content Quality</h4>
            <p className="text-sm text-muted-foreground">
              Share accurate, helpful information. Avoid misleading or unverified medical claims.
            </p>
          </div>
          <div>
            <h4 className="font-nothing text-lg mb-2">4. Engagement</h4>
            <p className="text-sm text-muted-foreground">
              Participate in discussions constructively. Support others in their health journey.
            </p>
          </div>
          <div>
            <h4 className="font-nothing text-lg mb-2">5. Reporting</h4>
            <p className="text-sm text-muted-foreground">
              Report inappropriate content or behavior to moderators immediately.
            </p>
          </div>
        </div>
      </Card>
    </ScrollArea>
  );
};

const Community = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("feed");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    navigate(`/community/${section}`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "feed":
        return <CommunityFeed />;
      case "explore":
        return <ExploreSection />;
      case "activities":
        return <ActivitiesSection />;
      case "guidelines":
        return <GuidelinesSection />;
      default:
        return <CommunityFeed />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-nothing">COMMUNITY</h1>
      </div>

      <CommunityHeader
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {renderSection()}

      <div className="system-status">
        <p>SYSTEM STATUS: ONLINE</p>
        <p>BATTERY: 73% | NETWORK: STABLE</p>
      </div>
    </div>
  );
};

export default Community;