"use client";

import React, { useState, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Folder,
  Search,
  Grid,
  List as ListIcon,
  Tag,
  Download,
  Copy,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";
import { MediaAsset } from "@/types";
import {
  mediaAssetsList,
  cmsPagesList,
  researchersList,
  facilitiesList,
  eventsList,
} from "@/data/mockData";
import { useToast } from "../common/Toast";
import { validateUpload } from "@/lib/uploadSecurity";
import { logAuditEntry } from "@/lib/auditLogger";

export function MediaLibraryView() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaAsset[]>(mediaAssetsList);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState("All Folders");
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Collect all known referenced URLs across institutional entities to identify orphaned files
  const referencedUrls = new Set<string>();
  researchersList.forEach((r) => r.avatar && referencedUrls.add(r.avatar));
  facilitiesList.forEach((f) => (f as any).heroImage && referencedUrls.add((f as any).heroImage));
  eventsList.forEach((e) => (e as any).banner && referencedUrls.add((e as any).banner));
  cmsPagesList.forEach((p) => {
    if (p.contentMarkdown) {
      const imgMatches = p.contentMarkdown.match(/\((https?:\/\/[^\s)]+)\)/g);
      imgMatches?.forEach((m) => referencedUrls.add(m.replace(/[()]/g, "")));
    }
  });

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleRealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Multi-layer institutional security validation
    const validation = validateUpload(file.name, file.type, file.size);
    if (!validation.valid) {
      toast("Upload Blocked by Security Engine", validation.error || "File validation failed.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const sizeFormatted =
              file.size > 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.round(file.size / 1024)} KB`;

            const format = validation.sanitizedFilename.split(".").pop()?.toUpperCase() || "BIN";
            const isImage = file.type.startsWith("image/");
            const previewUrl = URL.createObjectURL(file);

            const newAsset: MediaAsset = {
              id: `med-${Date.now()}`,
              name: validation.sanitizedFilename,
              type: isImage ? "image" : "document",
              size: sizeFormatted,
              format,
              url: previewUrl,
              folder: selectedFolder !== "All Folders" && selectedFolder !== "Orphaned Assets" ? selectedFolder : "Research Projects",
              tags: ["Research", format, "New Upload"],
              dimensions: isImage ? "1920 x 1080" : undefined,
              uploadedAt: new Date().toISOString().split("T")[0],
              uploadedBy: "Admin",
            };

            setAssets((a) => [newAsset, ...a]);

            logAuditEntry({
              userId: "usr-admin",
              userName: "Admin",
              userRole: "Content Manager",
              action: `Uploaded and scanned digital asset: ${validation.sanitizedFilename}`,
              entityType: "MediaAsset",
              entityId: newAsset.id,
              status: "Success",
            });

            toast("Asset Uploaded & Scanned", `${validation.sanitizedFilename} stored and CDN indexed.`, "success");
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }

    logAuditEntry({
      userId: "usr-admin",
      userName: "Admin",
      userRole: "Content Manager",
      action: `Deleted asset from CDN storage: ${name}`,
      entityType: "MediaAsset",
      entityId: id,
      status: "Success",
    });

    toast("Asset Deleted", `Removed ${name} from institutional CDN storage.`, "info");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    toast("CDN URL Copied", "Direct asset URL copied to clipboard.", "success");
  };

  const filtered = assets.filter((a) => {
    const isOrphaned = !referencedUrls.has(a.url);
    const matchesFolder =
      selectedFolder === "All Folders" ||
      (selectedFolder === "Orphaned Assets" ? isOrphaned : a.folder === selectedFolder);

    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-10">
      {/* Hidden Real File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleRealUpload}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.svg,.docx"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[25px] leading-8 font-bold tracking-[-0.022em] text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Media Library & Digital Assets</span>
            <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-[#edf2fe] text-[#0055b3] dark:bg-blue-950/50 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
              CDN Storage
            </span>
          </h1>
          <p className="text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 mt-0.5">
            High-resolution research imagery, lab footage, and publication figures with automated CDN caching and orphan scanning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerUpload}
            disabled={isUploading}
            className="btn-primary h-[35px] disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>{isUploading ? `Uploading ${uploadProgress}%` : "Upload New Asset"}</span>
          </button>
        </div>
      </div>

      {/* Upload Progress Bar (when active) */}
      {isUploading && (
        <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-[#edf2fe]/80 dark:bg-blue-950/30 space-y-2 animate-in fade-in duration-150">
          <div className="flex justify-between text-[12px] font-semibold text-[#0055b3] dark:text-sky-300">
            <span>Scanning, Optimizing & Uploading to CIIRC CDN Storage...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-[#0066cc] transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl ref-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.85} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by file name or tags..."
            className="w-full h-[35px] pl-8 pr-3 text-[12.5px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="h-[35px] px-2.5 text-[12px] font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All Folders">All Folders</option>
            <option value="Research Projects">Research Projects</option>
            <option value="Field Trials">Field Trials</option>
            <option value="Events">Events</option>
            <option value="Patents & Lab">Patents & Lab</option>
            <option value="Institutional Reports">Institutional Reports</option>
            <option value="Orphaned Assets">⚠️ Orphaned Assets (Unlinked)</option>
          </select>

          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white" : "text-slate-400"}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white" : "text-slate-400"}`}
              title="List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List View */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center ref-card rounded-2xl space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">
            No media assets found
          </h3>
          <p className="text-[12px] text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or upload a new file.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedFolder("All Folders");
            }}
            className="btn-secondary h-[32px] text-xs mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group ref-card rounded-xl overflow-hidden cursor-pointer hover:border-[#0066cc]/40 dark:hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                {asset.type === "image" ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  {asset.format}
                </span>
              </div>

              <div className="p-2.5 space-y-1">
                <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate" title={asset.name}>
                  {asset.name}
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                  <span>{asset.size}</span>
                  <span>{asset.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl ref-card overflow-hidden">
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-3">Folder</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filtered.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                      {asset.name}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{asset.folder}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {asset.format}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{asset.size}</td>
                  <td className="py-3 px-3 text-slate-400">{asset.uploadedAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(asset.url);
                      }}
                      className="text-xs font-semibold text-[#0066cc] dark:text-sky-400 hover:underline mr-3"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset.id, asset.name);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Detail Drawer Modal */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl ref-card p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white truncate max-w-[360px]">
                {selectedAsset.name}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-850 overflow-hidden flex items-center justify-center">
              {selectedAsset.type === "image" ? (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-slate-400" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <span className="text-slate-400">File Size:</span>{" "}
                <strong className="text-slate-700 dark:text-slate-200">{selectedAsset.size}</strong>
              </div>
              <div>
                <span className="text-slate-400">Format:</span>{" "}
                <strong className="text-slate-700 dark:text-slate-200">{selectedAsset.format}</strong>
              </div>
              <div>
                <span className="text-slate-400">Uploaded Date:</span>{" "}
                <strong className="text-slate-700 dark:text-slate-200">{selectedAsset.uploadedAt}</strong>
              </div>
              <div>
                <span className="text-slate-400">Uploader:</span>{" "}
                <strong className="text-slate-700 dark:text-slate-200">{selectedAsset.uploadedBy}</strong>
              </div>
              {selectedAsset.dimensions && (
                <div className="col-span-2">
                  <span className="text-slate-400">Resolution:</span>{" "}
                  <strong className="text-slate-700 dark:text-slate-200">{selectedAsset.dimensions}</strong>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleCopyUrl(selectedAsset.url)}
                className="btn-secondary h-[34px] text-xs flex-1 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CDN URL</span>
              </button>
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id, selectedAsset.name)}
                className="btn-danger h-[34px] text-xs px-4 flex items-center gap-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
