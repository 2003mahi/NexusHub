'use client';

import React, { useState, useRef } from 'react';
import { DocumentItem } from '../types';

interface DocumentsTabProps {
  documents: DocumentItem[];
  onUploadDocument: (data: {
    name: string;
    fileType: string;
    size: number;
    category: DocumentItem['category'];
    fileData?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onDeleteDocument: (docId: string) => Promise<{ success: boolean; error?: string }>;
}

const categoryLabels: Record<DocumentItem['category'], string> = {
  resume: 'Resume / CV',
  id_verification: 'Identity Verification',
  portfolio: 'Portfolio & Work Samples',
  certificate: 'Certificate & Degree',
  pitch_deck: 'Venture Pitch Deck',
};

export default function DocumentsTab({
  documents,
  onUploadDocument,
  onDeleteDocument,
}: DocumentsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<DocumentItem['category']>('resume');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    setFeedback(null);

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        text: 'File exceeds 5MB limit. Please compress the document before uploading.',
      });
      return;
    }

    // Validate MIME types
    const allowed = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowed.includes(file.type.toLowerCase())) {
      setFeedback({
        type: 'error',
        text: 'Invalid file format. Please upload PDF, PNG, JPG, WebP, DOCX, or TXT.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to Base64 for secure client-to-server transmission
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result as string;
        const res = await onUploadDocument({
          name: file.name,
          fileType: file.type || 'application/octet-stream',
          size: file.size,
          category: selectedCategory,
          fileData,
        });

        if (res.success) {
          setFeedback({
            type: 'success',
            text: `"${file.name}" uploaded to secure vault successfully!`,
          });
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setFeedback({ type: 'error', text: res.error || 'Failed to upload document.' });
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        setFeedback({ type: 'error', text: 'Error reading file.' });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch {
      setFeedback({ type: 'error', text: 'Unexpected upload error.' });
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDelete = async (docId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    setDeletingId(docId);
    setFeedback(null);
    try {
      const res = await onDeleteDocument(docId);
      if (res.success) {
        setFeedback({ type: 'success', text: `"${name}" removed from vault.` });
      } else {
        setFeedback({ type: 'error', text: res.error || 'Failed to delete document.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error deleting document.' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Document "${doc.name}" is stored encrypted. Direct data stream not available.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12182B] via-[#0E1322] to-[#0A0D18] border border-white/[0.09] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Encrypted Credential Vault
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Secure Document Management
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 max-w-xl">
            Store and manage verification IDs, academic diplomas, professional resumes, and investor pitch decks. Only authorized organizations reviewing your applications have access.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl self-start md:self-auto">
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{documents.length}</span>
            <span className="block text-[11px] text-gray-400">Vault Documents</span>
          </div>
          <span className="text-2xl">🔒</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          }`}
        >
          <span>{feedback.type === 'success' ? '✓ ' : '⚠️ '}{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-white/50 hover:text-white">✕</button>
        </div>
      )}

      {/* ── Upload Area ───────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Upload New Document</h3>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Select Document Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {(Object.keys(categoryLabels) as DocumentItem['category'][]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600/30 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-white/[0.02] text-gray-400 hover:text-white border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and drop box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-white/[0.12] hover:border-indigo-500/50 bg-white/[0.01] hover:bg-white/[0.03]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx,.doc"
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-2xl mb-3 shadow-inner">
            {isUploading ? '⏳' : '📁'}
          </div>

          <h4 className="text-sm font-bold text-white mb-1">
            {isUploading
              ? 'Encrypting & Uploading File...'
              : 'Click to select or drag and drop document'}
          </h4>

          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Uploading as <span className="text-indigo-400 font-semibold">{categoryLabels[selectedCategory]}</span>.
            Supports PDF, DOCX, PNG, JPG (Max 5MB).
          </p>
        </div>
      </div>

      {/* ── Document Vault List ───────────────────────────────────────────── */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Stored Vault Items</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.05] text-gray-300 border border-white/[0.08]">
              {documents.length} Files
            </span>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs">
            No documents stored in your vault. Upload your resume or ID above to increase your completion score.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const sizeInKB = (doc.size / 1024).toFixed(1);
              const dateStr = new Date(doc.uploadedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={doc.id}
                  className="rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] p-5 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-bold">
                          {doc.name.endsWith('.pdf') ? '📄' : doc.name.match(/\.(png|jpg|jpeg|webp)$/i) ? '🖼️' : '📝'}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px]" title={doc.name}>
                            {doc.name}
                          </h4>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {sizeInKB} KB · {dateStr}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          doc.status === 'verified'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : doc.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 inline-block mt-2">
                      {categoryLabels[doc.category] || doc.category}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                    >
                      <span>Download / View</span>
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      disabled={deletingId === doc.id}
                      className="text-xs font-medium text-gray-400 hover:text-rose-400 transition-colors p-1"
                    >
                      {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
