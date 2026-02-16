"use client";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-surface-elevated rounded-xl p-6 shadow-sm border border-border"
        >
          <div className="animate-pulse">
            <div className="h-4 bg-surface-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-surface-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-surface-muted rounded w-5/6 mb-4"></div>
            <div className="flex gap-4">
              <div className="h-3 bg-surface-muted rounded w-20"></div>
              <div className="h-3 bg-surface-muted rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
