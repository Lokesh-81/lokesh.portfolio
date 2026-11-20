'use client';

import React, { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';

interface StudioDropzoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  title: string;
  description?: string;
  compact?: boolean;
  className?: string;
  onFiles: (files: File[]) => void | Promise<void>;
  children?: React.ReactNode;
}

export function StudioDropzone({
  accept,
  multiple = false,
  disabled = false,
  title,
  description,
  compact = false,
  className = '',
  onFiles,
  children,
}: StudioDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const deliverFiles = (files: FileList | File[]) => {
    const selected = Array.from(files);
    if (!selected.length || disabled) return;
    void onFiles(selected);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <label
      className={`studio-dropzone ${compact ? 'is-compact' : ''} ${isDragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      onDragEnter={(event) => { event.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragOver={(event) => { event.preventDefault(); if (!disabled) event.dataTransfer.dropEffect = 'copy'; }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        deliverFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="studio-dropzone-input"
        onChange={(event) => { if (event.target.files) deliverFiles(event.target.files); }}
      />
      {children ? (
        <div className="studio-dropzone-preview">{children}</div>
      ) : (
        <div className="studio-dropzone-icon"><FileUp size={compact ? 16 : 22} /></div>
      )}
      <div className="studio-dropzone-copy">
        <strong>{disabled ? 'Uploading…' : title}</strong>
        {description && <span>{description}</span>}
      </div>
      <span className="studio-dropzone-browse">{disabled ? 'Please wait' : 'Browse files'}</span>
    </label>
  );
}
