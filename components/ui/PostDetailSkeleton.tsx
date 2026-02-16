/**
 * POST DETAIL SKELETON LOADER
 * Loading placeholder for question/post detail pages
 */

import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

export default function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Post Header */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Title */}
              <Skeleton className="h-8 w-3/4 mb-4" />

              {/* Content */}
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Image placeholder */}
              <Skeleton className="h-64 w-full mb-4" />

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>

            {/* Answers Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton variant="circular" width={40} height={40} />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex items-center gap-4 mt-4">
                          <Skeleton className="h-7 w-16" />
                          <Skeleton className="h-7 w-20" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-10 w-32" />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Author Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </Card>

            {/* Post Stats Card */}
            <Card className="p-5">
              <Skeleton className="h-5 w-20 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Category Card */}
            <Card className="p-5">
              <Skeleton className="h-5 w-16 mb-3" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </Card>

            {/* Related Posts Card */}
            <Card className="p-5">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Guidelines Card */}
            <Card className="p-5">
              <Skeleton className="h-5 w-20 mb-3" />
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
