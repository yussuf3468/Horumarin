import type {
  CreatePostCommand,
  PostRepository,
} from "@/domain/posts/repositories/PostRepository";
import type { Post } from "@/domain/posts/entities/Post";

export interface CreatePostInput {
  authorId: string;
  title: string;
  body: string;
  category: string;
  type: Post["type"];
  mediaUrl?: string | null;
  linkUrl?: string | null;
}

export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(input: CreatePostInput): Promise<Post> {
    const trimmedTitle = input.title.trim();
    const trimmedBody = input.body.trim();

    if (trimmedTitle.length < 8) {
      throw new Error("TITLE_TOO_SHORT");
    }

    if (trimmedBody.length < 20) {
      throw new Error("BODY_TOO_SHORT");
    }

    if (input.type === "resource" && !input.linkUrl?.trim()) {
      throw new Error("RESOURCE_LINK_REQUIRED");
    }

    const command: CreatePostCommand = {
      authorId: input.authorId,
      title: trimmedTitle,
      body: trimmedBody,
      category: input.category,
      type: input.type,
      mediaUrl: input.mediaUrl ?? null,
      linkUrl: input.linkUrl ?? null,
      createdBy: input.authorId,
    };

    return this.postRepository.create(command);
  }
}
