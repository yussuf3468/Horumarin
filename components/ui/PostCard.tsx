"use client";

import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import Avatar from "@/components/ui/Avatar";
import LightboxImage from "@/components/ui/LightboxImage";
import Card from "@/components/ui/Card";
import SaveButton from "@/components/ui/SaveButton";
import { motion } from "framer-motion";

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
  userId?: string | null;
  isSaved?: boolean;
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
  userId = null,
  isSaved = false,
}: PostCardProps) {
  const handleVote = (value: number) => {
    if (onVote) {
      onVote(id, value);
    }
  };

  return (
    <Card hover className="overflow-hidden">
      <div className="p-3 sm:p-4 md:p-6">
        {/* Author Info */}
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar
              src={author.avatar_url || undefined}
              alt={author.fullName || "User"}
              size="sm"
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
            />
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-0.5 sm:gap-1.5 text-xs text-foreground-muted min-w-0">
              <span className="font-semibold text-foreground truncate">
                {author.fullName || "User"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary font-medium text-[10px] sm:text-xs w-fit">
                {category}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-[10px] sm:text-xs">
                {formatDate(createdAt)}
              </span>
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
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground hover:text-primary mb-2 line-clamp-2 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Content Preview */}
        {content && (
          <p className="text-sm text-foreground-muted mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
            {content}
          </p>
        )}

        {/* Image */}
        {imageUrl && (
          <div className="mb-3 sm:mb-4 -mx-3 sm:-mx-4 md:-mx-6">
            <LightboxImage
              src={imageUrl}
              alt={title}
              className="w-full"
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
        <div className="flex items-center gap-2 sm:gap-4 pt-2 sm:pt-3 border-t border-border flex-wrap">
          {/* Like Button with Animation */}
          <motion.button
            onClick={() => handleVote(1)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all text-xs sm:text-sm ${
              userVote === 1
                ? "text-orange-600 border-orange-300 bg-orange-50 dark:bg-orange-900/20"
                : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-orange-600 hover:border-orange-300"
            }`}
            aria-pressed={userVote === 1}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={userVote === 1 ? "currentColor" : "none"}
              stroke={userVote === 1 ? "none" : "currentColor"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              animate={
                userVote === 1
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, -15, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              {userVote === 1 ? (
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              )}
            </motion.svg>
            <span className="font-medium">{voteCount}</span>
          </motion.button>

          {/* Comments */}
          <Link
            href={`/questions/${id}`}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border text-foreground-muted hover:text-primary hover:border-primary/30 transition-colors text-xs sm:text-sm"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
            <span className="font-medium">{commentCount}</span>
          </Link>

          {/* Share */}
          <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border text-foreground-muted hover:text-foreground hover:border-border-strong transition-colors text-xs sm:text-sm">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
            <span className="font-medium hidden sm:inline">Share</span>
          </button>

          {/* Save Button */}
          <div className="ml-auto">
            <SaveButton
              postId={id}
              userId={userId}
              initialSaved={isSaved}
              variant="inline"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
