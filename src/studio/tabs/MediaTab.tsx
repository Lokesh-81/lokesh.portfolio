'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadMediaToSupabase } from '@/lib/supabase';
import type { MediaItem } from '@/lib/portfolio-types';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

interface MediaTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function MediaTab({ showToast }: MediaTabProps) {
  const { mediaItems, addMediaItem, deleteMediaItem } = usePortfolio();

  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadMediaToSupabase(file, 'general');
        const mediaRecord: MediaItem = {
          id: `media-${Date.now()}-${i}`,
          name: file.name,
          url: res.url,
          size: file.size,
          mimeType: file.type,
          bucket: 'portfolio-media',
          createdAt: new Date().toISOString(),
        };
        await addMediaItem(mediaRecord);
        successCount++;
      } catch (err: any) {
        showToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      showToast(`Successfully uploaded ${successCount} file(s)!`, 'success');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Asset URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete media asset "${name}"?`)) return;
    try {
      await deleteMediaItem(id);
      showToast('Media deleted', 'success');
    } catch (err: any) {
      showToast('Failed to delete media', 'error');
    }
  };

  const filteredItems = mediaItems.filter((item) => {
    const matchesType =
      filterType === 'all' ||
      (filterType === 'image' && item.mimeType?.startsWith('image/')) ||
      (filterType === 'document' && !item.mimeType?.startsWith('image/'));
    const matchesSearch =
      !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Media & Asset Library</h2>
          <p className="text-xs text-[#94A3B8]">
            Upload and host images, diagrams, certificates, and assets in Supabase Storage with instant public CDN URLs.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer">
          <Upload className="h-4 w-4" />
          <span>{isUploading ? 'Uploading to Supabase...' : 'Upload Files'}</span>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          {(['all', 'image', 'document'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#111827] text-[#94A3B8] hover:bg-[#1F2937]'
              }`}
            >
              {t === 'all' ? 'All Files' : `${t}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files..."
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3 py-1.5 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredItems.map((item) => {
          const isImage = item.mimeType?.startsWith('image/') || item.url.match(/\.(png|jpe?g|gif|svg|webp)$/i);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-3 hover:border-[#60A5FA]/40 transition-all shadow-xs"
            >
              {/* Asset Preview */}
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-[#1F2937] bg-[#0B132B]">
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FileText className="h-10 w-10 text-[#60A5FA]" />
                )}
              </div>

              {/* Info */}
              <div className="mt-2.5">
                <p className="text-xs font-semibold text-[#E0E7FF] truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="mt-0.5 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>{item.size ? `${(item.size / 1024).toFixed(0)} KB` : 'CDN Asset'}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-2.5 flex items-center justify-between border-t border-[#1F2937]/60 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#60A5FA] hover:underline cursor-pointer"
                  title="Copy Public CDN URL"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[#64748B] hover:text-[#CBD5E1]"
                    title="Open full size"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1 text-[#64748B] hover:text-red-400 cursor-pointer"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#1F2937] p-10 text-center text-xs text-[#64748B]">
          <ImageIcon className="h-10 w-10 text-[#334155] mx-auto mb-2" />
          <span>No media files found. Upload your project photos, diagrams, or certificates above.</span>
        </div>
      )}
    </div>
  );
}
