"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import LightboxImage from "@/components/ui/LightboxImage";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
  maxSizeMB?: number;
  aspectRatio?: string;
  isUploading?: boolean;
  disabled?: boolean;
}

export default function ImageUpload({
  label = "Image",
  value,
  previewUrl,
  onChange,
  maxSizeMB = 8,
  aspectRatio = "16 / 9",
  isUploading = false,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      onChange(null, null);
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image size must be under ${maxSizeMB} MB.`);
      onChange(null, null);
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setError(null);
    onChange(file, nextPreview);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null, null);
    setError(null);
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
            Drop image to upload
          </div>
        )}
        {!previewUrl ? (
          <div className="space-y-3">
            <div className="text-sm text-foreground-muted">
              Drag and drop an image, or choose a file.
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePick}
              disabled={disabled}
            >
              Choose Image
            </Button>
            <div className="text-xs text-foreground-subtle">
              Max size {maxSizeMB} MB • JPG, PNG, WebP
            </div>
          </div>
        ) : (
          <LightboxImage
            src={previewUrl}
            alt="Selected image"
            aspectRatio={aspectRatio}
            className="border border-border"
          />
        )}
      </div>

      {error && <div className="text-sm text-danger-foreground">{error}</div>}

      {isUploading && (
        <div className="text-sm text-foreground-muted animate-pulse">
          Uploading image...
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
