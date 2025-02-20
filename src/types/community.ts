export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: number;
  likedBy: string[];
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  timestamp: number;
}