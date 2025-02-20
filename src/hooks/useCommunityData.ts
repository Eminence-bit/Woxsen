import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { database } from "@/lib/firebase";
import { ref, get, push, set, remove } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/community";
import { toast } from "sonner";

export const useCommunityData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchPosts = async (): Promise<Post[]> => {
    console.log("Fetching posts...");
    const postsRef = ref(database, "posts");
    const snapshot = await get(postsRef);
    
    if (!snapshot.exists()) return [];
    
    const posts: Post[] = [];
    snapshot.forEach((child) => {
      posts.push({ id: child.key, ...child.val() });
    });
    
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Must be logged in to post");
      
      const newPost = {
        author: {
          id: user.uid,
          name: user.displayName || "Anonymous",
          role: "Member",
        },
        content,
        likes: 0,
        comments: 0,
        timestamp: Date.now(),
        likedBy: [],
      };

      const postsRef = ref(database, "posts");
      const newPostRef = push(postsRef);
      await set(newPostRef, newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!", {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error("Failed to create post: " + error.message, {
        duration: 3000,
      });
    },
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Must be logged in to like posts");
      
      const postRef = ref(database, `posts/${postId}`);
      const snapshot = await get(postRef);
      const post = snapshot.val();
      
      const likedBy = post.likedBy || [];
      const userIndex = likedBy.indexOf(user.uid);
      
      if (userIndex === -1) {
        likedBy.push(user.uid);
        await set(postRef, {
          ...post,
          likes: post.likes + 1,
          likedBy,
        });
      } else {
        likedBy.splice(userIndex, 1);
        await set(postRef, {
          ...post,
          likes: post.likes - 1,
          likedBy,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error("Failed to like post: " + error.message, {
        duration: 3000,
      });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Must be logged in to delete posts");
      
      const postRef = ref(database, `posts/${postId}`);
      await remove(postRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!", {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error("Failed to delete post: " + error.message, {
        duration: 3000,
      });
    },
  });

  return {
    posts,
    isLoading,
    createPost,
    likePost,
    deletePost,
  };
};