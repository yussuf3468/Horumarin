"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { updateUserProfile } from "@/services/user.service";
import { uploadAvatar } from "@/services/storage.service";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SettingsSkeleton from "@/components/ui/SettingsSkeleton";
import { toast } from "react-hot-toast";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refetch } = useProfile(user?.id);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    avatarUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
      });
      setAvatarPreview(profile.avatarUrl || "");
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setFormData({ ...formData, avatarUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsSaving(true);

    try {
      let avatarUrl = formData.avatarUrl;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        setIsUploading(true);
        const uploadResult = await uploadAvatar(avatarFile, user.id);

        if (uploadResult.error) {
          toast.error(uploadResult.error);
          setIsSaving(false);
          setIsUploading(false);
          return;
        }

        avatarUrl = uploadResult.url || "";
        setIsUploading(false);
      }

      const result = await updateUserProfile(user.id, {
        fullName: formData.fullName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        await refetch();
        router.push(`/profile/${user.id}`);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (authLoading || profileLoading) {
    return <SettingsSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-foreground-muted">
            Update your personal information and profile settings
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-foreground-subtle">
                Your name will be visible to other users
              </p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <p className="mt-1 text-xs text-foreground-subtle">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Picture
              </label>

              {/* Current Avatar Preview */}
              <div className="mb-4">
                {avatarPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-surface-muted border-2 border-dashed border-border flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
              </div>

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                id="avatarFile"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Choose Image"}
                </Button>

                {avatarPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <p className="mt-2 text-xs text-foreground-subtle">
                Upload a profile picture (max 5MB). Supported: JPG, PNG, GIF,
                WebP
              </p>
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-border bg-surface-muted text-foreground-muted cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-foreground-subtle">
                Email cannot be changed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex-1"
              >
                {isSaving
                  ? isUploading
                    ? "Uploading..."
                    : "Saving..."
                  : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving || isUploading}
                className="flex-1 text-foreground-muted hover:text-foreground hover:bg-surface-muted"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 p-4 rounded-lg bg-surface-muted border border-border">
          <h3 className="font-medium mb-2">Privacy & Security</h3>
          <ul className="text-sm text-foreground-muted space-y-1">
            <li>• Your email is only visible to you</li>
            <li>• Your full name and bio are visible to all users</li>
            <li>• You can update your profile information at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
