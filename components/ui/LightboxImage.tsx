"use client";

import { useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

interface LightboxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
}

export default function LightboxImage({
  src,
  alt,
  className,
  imageClassName,
  aspectRatio = "16 / 9",
}: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl bg-surface-muted border border-border",
          className,
        )}
        style={{ aspectRatio }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-full w-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]",
            imageClassName,
          )}
        />
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="full"
        className="bg-transparent shadow-none"
        showCloseButton
      >
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] w-full object-contain rounded-xl border border-border"
          />
        </div>
      </Dialog>
    </>
  );
}
