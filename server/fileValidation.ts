export function normalizeUploadFileName(fileName: string): string {
  const normalized = fileName.normalize("NFKC");
  const lastDot = normalized.lastIndexOf(".");
  const rawStem = lastDot > 0 ? normalized.slice(0, lastDot) : normalized;
  const rawExtension = lastDot > 0 ? normalized.slice(lastDot).replace(/[^a-zA-Z0-9.]/g, "") : "";
  const stem = rawStem
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 180);
  const extension = rawExtension.replace(/\.+/g, ".").slice(0, 24);

  const candidate = `${stem}${extension}`;
  return /[a-zA-Z0-9]/.test(candidate) ? candidate : "upload.bin";
}
