"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { MediaAsset } from "@/types";
import { mediaAssetsList } from "@/data/mockData";
import { useToast } from "../common/Toast";

export function MediaLibraryView() {
  const { toast } = useToast();
  const [assets, setAssets] = useState<MediaAsset[]>(mediaAssetsList);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState("All Folders");
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const newAsset: MediaAsset = {
              id: `med-${Date.now()}`,
              name: "robotics-teleoperation-testbed-hd.jpg",
              type: "image",
              size: "3.2 MB",
              format: "JPEG",
              url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
              folder: "Research Projects",
              tags: ["Teleoperation", "Robotics", "Haptics"],
              dimensions: "3840 x 2160",
              uploadedAt: "2026-09-11",
              uploadedBy: "Admin",
            };
            setAssets((a) => [newAsset, ...a]);
            toast("Asset Uploaded Successfully", "Asset optimized and indexed with CDN URL.", "success");
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const filtered = assets.filter((a) => {
    const matchesFolder = selectedFolder === "All Folders" || a.folder === selectedFolder;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-10">
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
            High-resolution research imagery, lab footage, and publication figures with automated CDN caching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateUpload}
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
            <span>Encoding & Uploading to CIIRC S3 Storage...</span>
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
          </select>

          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white" : "text-slate-400"}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white" : "text-slate-400"}`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Asset Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="rounded-2xl ref-card overflow-hidden group hover:border-[#0066cc]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-video relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {asset.type === "image" ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Folder className="w-8 h-8 text-[#0066cc]" />
                    <span className="text-[10px] font-mono uppercase">{asset.format}</span>
                  </div>
                )}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white font-mono text-[10px]">
                  {asset.format}
                </span>
              </div>

              <div className="p-3">
                <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#0066cc] dark:group-hover:text-sky-400 transition-colors">
                  {asset.name}
                </div>
                <div className="flex items-center justify-between text-[11.5px] text-slate-400 mt-1">
                  <span>{asset.folder}</span>
                  <span>{asset.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl ref-card overflow-hidden">
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Asset Name</th>
                <th className="py-3.5 px-3">Folder</th>
                <th className="py-3.5 px-3">Size</th>
                <th className="py-3.5 px-3">Dimensions</th>
                <th className="py-3.5 px-3">Uploaded</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filtered.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-[#0066cc]" />
                    <span>{asset.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{asset.folder}</td>
                  <td className="py-3.5 px-3 font-mono text-[11.5px]">{asset.size}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11.5px]">{asset.dimensions || "-"}</td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11.5px]">{asset.uploadedAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(asset.url);
                        toast("Asset CDN URL Copied", asset.name, "success");
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0066cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-5 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="font-semibold text-[14px] truncate pr-2">{selectedAsset.name}</div>
              <button onClick={() => setSelectedAsset(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedAsset.type === "image" && (
              <div className="max-h-60 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img src={selectedAsset.url} alt={selectedAsset.name} className="max-h-60 object-contain" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 text-[12px]">
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] font-medium">Folder</span>
                <span className="font-semibold">{selectedAsset.folder}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] font-medium">File Size</span>
                <span className="font-semibold font-mono">{selectedAsset.size} ({selectedAsset.format})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] font-medium">Dimensions</span>
                <span className="font-semibold font-mono">{selectedAsset.dimensions || "N/A"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] font-medium">Uploaded By</span>
                <span className="font-semibold">{selectedAsset.uploadedBy}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(selectedAsset.url);
                  toast("CDN Link Copied", selectedAsset.url, "success");
                }}
                className="btn-secondary h-[34px] px-3.5 text-[12px] flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CDN URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
