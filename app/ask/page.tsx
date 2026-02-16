/**
 * Ask Question Page
 *
 * Uses service layer for creating questions.
 * No direct Supabase calls - ready for Django migration.
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import LightboxImage from "@/components/ui/LightboxImage";
import FloatingShapes from "@/components/layout/FloatingShapes";
import { createQuestion } from "@/services/question.service";
import { uploadPostImage } from "@/services/media.service";
import { categories } from "@/utils/constants";
import { compressImage } from "@/utils/image";

export default function AskQuestionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [postType, setPostType] = useState<
    "question" | "discussion" | "resource"
  >("question");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [linkUrl, setLinkUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const postTypeLabels = {
    question: "Su'aal",
    discussion: "Dood",
    resource: "Link",
  } as const;

  const previewHtml = useMemo(() => {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const escaped = escapeHtml(formData.content);
    const withCode = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    const withBold = withCode.replace(
      /\*\*([^*]+)\*\*/g,
      "<strong>$1</strong>",
    );
    const withItalic = withBold.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    const withLinks = withItalic.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary underline" target="_blank" rel="noreferrer">$1</a>',
    );

    return withLinks.replace(/\n/g, "<br />");
  }, [formData.content]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    if (postType === "resource" && !linkUrl.trim()) {
      toast.error("Fadlan geli link sax ah.");
      setSubmitting(false);
      return;
    }

    const loadingToast = toast.loading("Qoraalka waa la diyaarinayaa...");

    let imageUrl: string | null = null;

    if (imageFile) {
      setUploadingImage(true);
      try {
        const compressed = await compressImage(imageFile, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
        });

        const { publicUrl, error: uploadError } = await uploadPostImage(
          compressed,
          user.id,
        );

        if (uploadError) {
          toast.dismiss(loadingToast);
          toast.error(uploadError);
          setUploadingImage(false);
          setSubmitting(false);
          return;
        }

        imageUrl = publicUrl;
      } catch (uploadError: any) {
        toast.dismiss(loadingToast);
        toast.error(uploadError?.message || "Failed to upload image.");
        setUploadingImage(false);
        setSubmitting(false);
        return;
      }
      setUploadingImage(false);
    }

    // Using question service - when migrating to Django, only service layer changes
    const { question, error: createError } = await createQuestion({
      userId: user.id,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      postType,
      imageVideoUrl: imageUrl,
      linkUrl: linkUrl || null,
    });

    if (createError) {
      toast.dismiss(loadingToast);
      toast.error(createError);
      setSubmitting(false);
      return;
    }

    if (question) {
      toast.dismiss(loadingToast);
      toast.success(
        postType === "question"
          ? "Su'aashaada waa la dhiibay!"
          : "Qoraalkaaga waa la dhiibay!",
      );
      // Optimistic UI update - redirect immediately
      router.push(`/questions/${question.id}`);
    }

    setSubmitting(false);
  };

  if (authLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <FloatingShapes />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 lg:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Qor Qoraal</h1>
            <p className="text-foreground-muted text-base sm:text-lg">
              Fudud: qor cinwaan, sharaxaad, dooro qaybta, kadib dir.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_480px] gap-6 lg:gap-8">
            <Card className="p-5 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Nooca Qoraalka
                    </label>
                    <select
                      value={postType}
                      onChange={(e) =>
                        setPostType(
                          e.target.value as
                            | "question"
                            | "discussion"
                            | "resource",
                        )
                      }
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="question">
                        {postTypeLabels.question}
                      </option>
                      <option value="discussion">
                        {postTypeLabels.discussion}
                      </option>
                      <option value="resource">
                        {postTypeLabels.resource}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Qaybta
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Input
                    label="Cinwaanka Qoraalka"
                    placeholder="Tusaale: Sidee loo barto React bilow ahaan?"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                  <p className="mt-1 text-sm text-foreground-subtle">
                    Cinwaan cad oo kooban oo qeexaya qoraalkaaga
                  </p>
                </div>

                <div>
                  <Input
                    label="Link (Ikhtiyaari)"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    required={postType === "resource"}
                  />
                  <p className="mt-1 text-sm text-foreground-subtle">
                    Hadii aad doorato Resource, link-gu waa qasab. Noocyada kale
                    waa ikhtiyaari.
                  </p>
                </div>

                <div>
                  <ImageUpload
                    label="Sawir (Ikhtiyaari)"
                    value={imageFile}
                    previewUrl={imagePreviewUrl}
                    onChange={(file, previewUrl) => {
                      setImageFile(file);
                      setImagePreviewUrl(previewUrl);
                    }}
                    isUploading={uploadingImage}
                    disabled={submitting || uploadingImage}
                  />
                  <p className="mt-1 text-sm text-foreground-subtle">
                    Sawir ma aha qasab. Waad diri kartaa adigoon sawir ku darin.
                  </p>
                </div>

                {/* Content */}
                <div>
                  <Textarea
                    label="Qoraalka"
                    placeholder="Sharax su'aashaada ama fikraddaada si fudud oo cad..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    required
                  />
                  <p className="mt-1 text-sm text-foreground-subtle">
                    Waxaad isticmaali kartaa **bold**, *italic*, iyo
                    [link](https://...)
                  </p>
                </div>

                {/* Tips */}
                <div className="bg-surface-muted border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    💡 Tilmaamo
                  </h4>
                  <ul className="text-sm text-foreground-muted space-y-1">
                    <li>• Hal mawduuc ku koob qoraalkaaga</li>
                    <li>• Cinwaan kooban + sharaxaad cad</li>
                    <li>• Sawirku waa ikhtiyaari (optional)</li>
                    <li>
                      • Dhammaan fields waa muuqdaan, ma jiraan tabs qarsoon
                    </li>
                  </ul>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={submitting || uploadingImage}
                    className="flex-1 w-full"
                  >
                    {postType === "question"
                      ? "Soo Dir Su'aasha"
                      : "Soo Dir Qoraalka"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                    disabled={submitting || uploadingImage}
                    className="w-full sm:w-auto"
                  >
                    Ka Noqo
                  </Button>
                </div>
              </form>
            </Card>

            {/* Live Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 lg:sticky lg:top-24 self-start"
            >
              <div className="text-sm font-semibold text-foreground-muted uppercase tracking-widest">
                Hordhac
              </div>
              <Card className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-subtle mb-3">
                  <span className="px-2 py-1 rounded-full bg-surface-muted border border-border text-foreground-muted">
                    {postTypeLabels[postType]}
                  </span>
                  <span>•</span>
                  <span>
                    {categories.find((c) => c.id === formData.category)?.name ||
                      "Guud"}
                  </span>
                </div>

                {formData.title ? (
                  <h2 className="text-2xl font-bold mb-3">{formData.title}</h2>
                ) : (
                  <p className="text-foreground-subtle">Cinwaan la'aan</p>
                )}

                {formData.content ? (
                  <div
                    className="text-sm text-foreground leading-relaxed space-y-2"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <p className="text-sm text-foreground-subtle">
                    Qoraalka ayaa halkan ka muuqan doona.
                  </p>
                )}

                {linkUrl && (
                  <div className="mt-4 rounded-xl border border-border bg-surface-muted p-3">
                    <div className="text-xs text-foreground-subtle mb-1">
                      Link
                    </div>
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline break-all"
                    >
                      {linkUrl}
                    </a>
                  </div>
                )}

                {imagePreviewUrl && (
                  <div className="mt-4">
                    <LightboxImage
                      src={imagePreviewUrl}
                      alt={formData.title || "Post preview image"}
                      className="border border-border"
                      aspectRatio="16 / 9"
                    />
                  </div>
                )}

                <div className="flex gap-4 mt-4 pt-4 border-t border-border text-xs text-foreground-subtle">
                  <span>📅 Hadda</span>
                  <span>👤 {user?.email || "Xubin"}</span>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
