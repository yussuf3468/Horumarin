"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import LightboxImage from "@/components/ui/LightboxImage";
import { cn } from "@/lib/utils";

type MediaType = "image" | "video";

interface MediaUploadProps {
  label?: string;
  value: File | null;
  previewUrl: string | null;
  mediaType: MediaType | null;
  onChange: (file: File | null, previewUrl: string | null, mediaType: MediaType | null) => void;
  maxImageMB?: number;
  maxVideoMB?: number;
  isUploading?: boolean;
  disabled?: boolean;
}

export default function MediaUpload({
  label = "Photo or Video (Optional)",
  value,
  previewUrl,
  mediaType,
  onChange,
  maxImageMB = 8,
  maxVideoMB = 100,
  isUploading = false,
  disabled = false,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    setError(null);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError("Only image or video files are supported.");
      return;
    }

    if (isImage && file.size > maxImageMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxImageMB} MB.`);
      return;
    }

    if (isVideo && file.size > maxVideoMB * 1024 * 1024) {
      setError(`Video must be smaller than ${maxVideoMB} MB.`);
      return;
    }

    // Revoke old preview URL if it's a blob
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    onChange(file, newPreviewUrl, isImage ? "image" : "video");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    if (inputRef.current) inputRef.current.value = "";
    onChange(null, null, null);
    setError(null);
  };

  const handlePick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
            disabled={disabled}
          >
            Remove
          </button>
        )}
      </div>

      <div
        className={cn(
          "relative rounded-xl border border-border bg-surface-elevated p-4 transition-colors",
          value ? "" : "text-center",
          isDragging && "border-border-strong bg-surface-muted",
          disabled && "opacity-70",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        aria-disabled={disabled}
      >
        {isDragging && !disabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-dashed border-border-strong bg-background/60 text-sm text-foreground">
            Drop file to upload
          </div>
        )}

        {!previewUrl ? (
          <div className="space-y-3">
            <div className="text-sm text-foreground-muted">
              Drag and drop a photo or video, or choose a file.
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePick}
              disabled={disabled}
            >
              Choose Photo / Video
            </Button>
            <div className="text-xs text-foreground-subtle">
              Photos: max {maxImageMB} MB (JPG, PNG, WebP) &nbsp;·&nbsp; Videos: max {maxVideoMB} MB (MP4, MOV, WebM)
            </div>
          </div>
        ) : mediaType === "video" ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <video
              src={previewUrl}
              controls
              preload="metadata"
              className="w-full max-h-80 object-contain bg-black rounded-lg"
            />
          </div>
        ) : (
          <LightboxImage
            src={previewUrl}
            alt="Selected image"
            className="border border-border"
          />
        )}
      </div>

      {error && <div className="text-sm text-danger-foreground">{error}</div>}

      {isUploading && (
        <div className="text-sm text-foreground-muted animate-pulse">
          {mediaType === "video" ? "Uploading video..." : "Uploading image..."}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
