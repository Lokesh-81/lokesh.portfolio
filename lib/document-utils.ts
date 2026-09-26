/**
 * Utilities for viewing, downloading, and sanitizing document URLs
 * Handles HTTP/HTTPS links, Supabase URLs, and Base64 Data URLs reliably across all browsers.
 */

export function getCleanDocDisplayName(url?: string | null, fallback: string = 'document.pdf'): string {
  if (!url) return fallback;

  // Never display raw Data URLs or Blob URLs as a filename
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return fallback;
  }

  // If the URL is absurdly long or contains encoded base64 chunks
  if (url.length > 80 || url.includes('base64') || url.includes(';')) {
    return fallback;
  }

  try {
    // If it's a valid path/URL
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    const filename = parsed.pathname.split('/').filter(Boolean).pop();
    if (filename && filename.length > 0 && filename.length <= 50) {
      return decodeURIComponent(filename);
    }
  } catch {
    const parts = url.split('/');
    const last = parts.pop();
    if (last && last.length > 0 && last.length <= 50 && !last.includes('=')) {
      return last;
    }
  }

  return fallback;
}

/**
 * Converts a base64 Data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
  const b64Data = parts[1];
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Safely opens any document URL (even large Base64 Data URLs) in a new browser tab.
 * Modern browsers block top-frame navigation to "data:" URLs; this converts them to
 * an unblocked Object URL so it opens seamlessly.
 */
export function openDocumentInNewTab(url: string, title: string = 'Document') {
  if (!url) return;

  // Standard web URL or relative path: open directly
  if (!url.startsWith('data:')) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    const blob = dataUrlToBlob(url);
    const blobUrl = URL.createObjectURL(blob);

    const newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      // Popup blocked by browser: trigger invisible link click
      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Revoke after 2 minutes so browser tab has plenty of time to finish rendering
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 120000);
  } catch (err) {
    console.error('[Document] Error opening Data URL in new tab:', err);
    // Fallback: download directly
    downloadDocument(url, `${title.replace(/\s+/g, '_')}.pdf`);
  }
}

/**
 * Downloads a document with a proper filename, handling Data URLs, Blob URLs, and external links.
 */
export function downloadDocument(url: string, filename: string = 'document.pdf') {
  if (!url) return;

  const safeFilename = filename.endsWith('.pdf') || filename.endsWith('.svg') || filename.endsWith('.png')
    ? filename
    : `${filename}.pdf`;

  if (url.startsWith('data:')) {
    try {
      const blob = dataUrlToBlob(url);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    } catch (err) {
      console.error('[Document] Error downloading Data URL:', err);
    }
  }

  // Standard URL download
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
