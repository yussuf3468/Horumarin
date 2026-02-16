export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

function getOutputType(inputType: string): string {
  if (inputType === "image/jpeg" || inputType === "image/webp") {
    return inputType;
  }
  return "image/jpeg";
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selected file is not an image.");
  }

  const maxWidth = options.maxWidth ?? 1600;
  const maxHeight = options.maxHeight ?? 1600;
  const quality = options.quality ?? 0.82;

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = objectUrl;
    });

    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);

    const targetWidth = Math.round(image.width * scale);
    const targetHeight = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not available in this browser.");
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const outputType = getOutputType(file.type);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, quality),
    );

    if (!blob) {
      throw new Error("Image compression failed.");
    }

    const fileNameBase = file.name.replace(/\.[^/.]+$/, "");
    const fileExt = outputType === "image/webp" ? "webp" : "jpg";
    const compressedName = `${fileNameBase}.${fileExt}`;

    return new File([blob], compressedName, { type: outputType });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
