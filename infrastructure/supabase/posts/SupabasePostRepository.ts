import { supabase } from "@/lib/supabase/client";
import type { Post } from "@/domain/posts/entities/Post";
import type {
  CreatePostCommand,
  FeedQuery,
  FeedResult,
  PostRepository,
} from "@/domain/posts/repositories/PostRepository";

export class SupabasePostRepository implements PostRepository {
  async create(command: CreatePostCommand): Promise<Post> {
    const { data, error } = await (supabase as any)
      .from("posts")
      .insert([
        {
          user_id: command.authorId,
          title: command.title,
          content: command.body,
          category: command.category,
          post_type: command.type,
          image_video_url: command.mediaUrl ?? null,
          link_url: command.linkUrl ?? null,
          visibility: "active",
          created_by: command.createdBy,
          updated_by: command.createdBy,
        },
      ])
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "POST_CREATE_FAILED");
    }

    return mapRowToPost(data);
  }

  async getById(id: string): Promise<Post | null> {
    const { data, error } = await (supabase as any)
      .from("posts")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !data) {
      return null;
    }

    return mapRowToPost(data);
  }

  async getFeed(query: FeedQuery): Promise<FeedResult> {
    let qb = (supabase as any)
      .from("feed_cache")
      .select("*")
      .is("deleted_at", null)
      .limit(query.limit + 1);

    if (query.category) {
      qb = qb.eq("category", query.category);
    }

    if (query.sort === "new") {
      qb = qb.order("created_at", { ascending: false });
    } else if (query.sort === "top") {
      qb = qb.order("vote_count", { ascending: false });
    } else if (query.sort === "trending") {
      qb = qb.order("score_trending", { ascending: false });
    } else {
      qb = qb.order("score_hot", { ascending: false });
    }

    if (query.cursor) {
      qb = qb.lt("created_at", query.cursor);
    }

    const { data, error } = await qb;

    if (error || !data) {
      throw new Error(error?.message || "FEED_FETCH_FAILED");
    }

    const hasMore = data.length > query.limit;
    const rows = hasMore ? data.slice(0, query.limit) : data;
    const items = rows.map(mapRowToPost);
    const nextCursor = hasMore ? rows[rows.length - 1].created_at : null;

    return { items, nextCursor };
  }

  async incrementView(postId: string): Promise<void> {
    await (supabase as any).rpc("increment_post_view", { post_id: postId });
  }

  async softDelete(postId: string, actorId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from("posts")
      .update({
        deleted_at: new Date().toISOString(),
        visibility: "removed",
        updated_by: actorId,
      })
      .eq("id", postId);

    if (error) {
      throw new Error(error.message || "POST_DELETE_FAILED");
    }
  }
}

function mapRowToPost(row: any): Post {
  return {
    id: row.id,
    authorId: row.user_id,
    title: row.title,
    body: row.content,
    type: row.post_type,
    category: row.category,
    mediaUrl: row.image_video_url,
    linkUrl: row.link_url,
    visibility: row.visibility ?? "active",
    scoreHot: row.score_hot ?? 0,
    scoreTrending: row.score_trending ?? 0,
    voteCount: row.vote_count ?? 0,
    commentCount: row.comment_count ?? 0,
    viewCount: row.view_count ?? 0,
    moderationFlagsCount: row.moderation_flags_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at ?? null,
    createdBy: row.created_by ?? row.user_id,
    updatedBy: row.updated_by ?? row.user_id,
  };
}
