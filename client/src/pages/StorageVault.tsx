import { useMemo, useRef, useState } from "react";
import { FileText, FolderOpen, Image, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export default function StorageVault() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [integrationSlug, setIntegrationSlug] = useState("");
  const integrationsQuery = trpc.integration.list.useQuery();
  const filesQuery = trpc.files.list.useQuery();
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: async () => {
      await filesQuery.refetch();
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("File stored in Kova OS");
    },
    onError: error => toast.error(error.message || "Upload failed"),
  });

  const selectedIntegrationName = useMemo(
    () => integrationsQuery.data?.find(item => item.id === integrationSlug)?.name,
    [integrationsQuery.data, integrationSlug],
  );

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Choose a file first");
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      toast.error("Files must be 25 MB or smaller");
      return;
    }

    try {
      const data = await fileToBase64(selectedFile);
      uploadMutation.mutate({
        fileName: selectedFile.name,
        contentType: selectedFile.type || "application/octet-stream",
        data,
        integrationSlug: integrationSlug || undefined,
      });
    } catch {
      toast.error("The selected file could not be read");
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="container py-12 max-w-6xl">
        <div className="flex flex-col gap-3 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-cyan-300">
            <FolderOpen className="w-4 h-4" /> Persistent storage
          </div>
          <h1 className="font-display text-4xl font-bold text-white">Kova Storage Vault</h1>
          <p className="max-w-2xl text-zinc-400 leading-relaxed">
            Upload documents, images, and working files into secure platform storage. Kova keeps the file bytes in object storage and persists searchable ownership metadata in the database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] gap-6">
          <section className="glass-card p-6 border border-white/10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Add a file</h2>
                <p className="text-sm text-zinc-500 mt-1">Maximum 25 MB per upload.</p>
              </div>
              <Upload className="w-5 h-5 text-cyan-300" />
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl border border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-8 text-center"
            >
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                onChange={event => setSelectedFile(event.target.files?.[0] ?? null)}
              />
              <Upload className="w-8 h-8 mx-auto text-zinc-400 mb-3" />
              <span className="block text-sm text-white font-medium">
                {selectedFile ? selectedFile.name : "Choose a file from your device"}
              </span>
              <span className="block text-xs text-zinc-500 mt-2">Images, PDFs, documents, exports, and media</span>
            </button>

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedFile.type.startsWith("image/") ? <Image className="w-4 h-4 text-pink-300" /> : <FileText className="w-4 h-4 text-cyan-300" />}
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{selectedFile.name}</p>
                    <p className="text-xs text-zinc-500">{formatBytes(selectedFile.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedFile(null)} className="text-zinc-500 hover:text-white" aria-label="Remove selected file">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-5">
              <label className="block text-xs uppercase tracking-[0.14em] text-zinc-500 mb-2" htmlFor="integration-link">
                Link to an integration (optional)
              </label>
              <select
                id="integration-link"
                value={integrationSlug}
                onChange={event => setIntegrationSlug(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
              >
                <option value="" className="bg-zinc-900">No integration link</option>
                {integrationsQuery.data?.map(integration => (
                  <option key={integration.id} value={integration.id} className="bg-zinc-900">{integration.name}</option>
                ))}
              </select>
              {integrationsQuery.isLoading && (
                <p className="text-xs text-cyan-200 mt-2">Loading integration records…</p>
              )}
              {integrationsQuery.isError && (
                <p className="text-xs text-amber-200 mt-2">Integration records could not be loaded. You can still upload without linking a service.</p>
              )}
              {selectedIntegrationName && <p className="text-xs text-cyan-300 mt-2">Linked to {selectedIntegrationName}</p>}
            </div>

            <Button
              className="w-full mt-6 bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0"
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploadMutation.isPending ? "Storing file…" : "Store file"}
            </Button>
          </section>

          <section className="glass-card p-6 border border-white/10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Stored files</h2>
                <p className="text-sm text-zinc-500 mt-1">Your persistent file index.</p>
              </div>
              <span className="rounded-full bg-cyan-400/10 border border-cyan-300/20 px-2.5 py-1 text-xs text-cyan-200">
                {filesQuery.data?.length ?? 0} files
              </span>
            </div>

            {filesQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-500 py-8"><Loader2 className="w-4 h-4 animate-spin" /> Loading storage index…</div>
            ) : filesQuery.isError ? (
              <div className="py-8 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 text-sm text-amber-200">
                The storage index could not be loaded. Refresh after signing in again to reconnect the database.
              </div>
            ) : filesQuery.data?.length ? (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filesQuery.data.map(file => (
                  <a
                    key={file.id}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{file.fileName}</p>
                        <p className="text-xs text-zinc-500 mt-1">{formatBytes(file.sizeBytes)} · {file.contentType}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                <FolderOpen className="w-8 h-8 mx-auto text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400">No files stored yet.</p>
                <p className="text-xs text-zinc-600 mt-1">Your uploaded files will appear here.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
