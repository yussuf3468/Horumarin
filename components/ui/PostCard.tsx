"use client";

import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import Avatar from "@/components/ui/Avatar";
import LightboxImage from "@/components/ui/LightboxImage";

interface PostCardProps {
  id: string;
  author: {
    id: string;
    fullName: string | null;
    avatar_url?: string | null;
  };
  title: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  userVote?: number;
  onVote?: (postId: string, value: number) => void;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostCard({
  id,
  author,
  title,
  content,
  category,
  imageUrl,
  linkUrl,
  voteCount,
  commentCount,
  createdAt,
  userVote = 0,
  onVote,
  isOwner = false,
  onEdit,
  onDelete,
}: PostCardProps) {
  const handleVote = (value: number) => {
    if (onVote) {
      onVote(id, value);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg hover:border-border-strong transition-all hover:shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Author Info */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Avatar
              src={author.avatar_url || undefined}
              alt={author.fullName || "User"}
              size="sm"
              className="w-8 h-8"
            />
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted">
              <span className="font-semibold text-foreground">
                {author.fullName || "User"}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary font-medium">
                {category}
              </span>
              <span>•</span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Edit/Delete Buttons for Owner */}
          {isOwner && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded hover:bg-surface-muted transition-colors text-foreground-muted hover:text-primary"
                  title="Wax ka beddel"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded hover:bg-surface-muted transition-colors text-foreground-muted hover:text-danger"
                  title="Tirtir"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/questions/${id}`}>
          <h2 className="text-lg sm:text-xl font-bold text-foreground hover:text-primary mb-2 line-clamp-2 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Content Preview */}
        {content && (
          <p className="text-sm sm:text-base text-foreground-muted mb-4 line-clamp-3">
            {content}
          </p>
        )}

        {/* Image */}
        {imageUrl && (
          <div className="mb-4">
            <LightboxImage
              src={imageUrl}
              alt={title}
              className="rounded border border-border"
              aspectRatio="16 / 9"
            />
          </div>
        )}

        {/* Link Preview */}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-surface-muted rounded-lg border border-border hover:border-primary/30 transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 text-foreground-muted flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="text-sm text-primary truncate font-medium">
              {linkUrl}
            </span>
          </a>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          {/* Like Button */}
          <button
            onClick={() => handleVote(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
              userVote === 1
                ? "text-danger border-danger/30 bg-danger/10"
                : "text-foreground-muted border-border hover:text-danger hover:border-danger/30"
            }`}
            aria-pressed={userVote === 1}
          >
            {userVote === 1 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            <span className="text-sm font-medium">{voteCount}</span>
          </button>

          {/* Comments */}
          <Link
            href={`/questions/${id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-foreground-muted hover:text-primary hover:border-primary/30 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">{commentCount}</span>
          </Link>

          {/* Share */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-foreground-muted hover:text-foreground hover:border-border-strong transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Share</span>
          </button>

          {/* Save */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-foreground-muted hover:text-foreground hover:border-border-strong transition-colors ml-auto">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
