export type PostType = "question" | "discussion" | "resource" | "announcement";

export type ContentVisibilityState =
  | "active"
  | "under_review"
  | "removed"
  | "archived";

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  type: PostType;
  category: string;
  mediaUrl: string | null;
  linkUrl: string | null;
  visibility: ContentVisibilityState;
  scoreHot: number;
  scoreTrending: number;
  voteCount: number;
  commentCount: number;
  viewCount: number;
  moderationFlagsCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string;
}
