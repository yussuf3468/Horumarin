import type { Post } from "../entities/Post";

export interface CreatePostCommand {
  authorId: string;
  title: string;
  body: string;
  category: string;
  type: Post["type"];
  mediaUrl?: string | null;
  linkUrl?: string | null;
  createdBy: string;
}

export interface FeedQuery {
  category?: string;
  cursor?: string;
  limit: number;
  sort: "hot" | "new" | "top" | "trending";
  includeRemoved?: boolean;
}

export interface FeedResult {
  items: Post[];
  nextCursor: string | null;
}

export interface PostRepository {
  create(command: CreatePostCommand): Promise<Post>;
  getById(id: string): Promise<Post | null>;
  getFeed(query: FeedQuery): Promise<FeedResult>;
  incrementView(postId: string): Promise<void>;
  softDelete(postId: string, actorId: string): Promise<void>;
}
