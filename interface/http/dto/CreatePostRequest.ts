export interface CreatePostRequestDto {
  title: string;
  body: string;
  category: string;
  type: "question" | "discussion" | "resource" | "announcement";
  mediaUrl?: string | null;
  linkUrl?: string | null;
}

export interface CreatePostResponseDto {
  id: string;
  createdAt: string;
}
