/**
 * PROFILE SKELETON LOADER
 * Loading placeholder for profile pages
 */

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner Skeleton */}
      <div className="h-44 bg-gradient-to-r from-surface-muted to-surface-elevated animate-pulse">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex items-center gap-6">
            <Skeleton variant="circular" width={80} height={80} />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6">
              <div className="flex flex-wrap gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </Card>

            {/* Recent Activity Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-border">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Answers Card */}
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-border">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card className="p-6">
              <Skeleton className="h-4 w-20 mb-4" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-5" />
            </Card>

            {/* Communities Card */}
            <Card className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6">
              <Skeleton className="h-4 w-20 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-3 w-full" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
