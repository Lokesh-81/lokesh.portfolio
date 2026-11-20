export function getGoogleDriveFileId(value: string): string | null {
  const input = value.trim();
  if (!input) return null;
  try {
    const url = new URL(input);
    if (!/(^|\.)drive\.google\.com$/i.test(url.hostname) && !/(^|\.)docs\.google\.com$/i.test(url.hostname)) return null;
    const byPath = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const byQuery = url.searchParams.get('id');
    const id = byPath?.[1] || byQuery;
    return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Direct image URL for rendering a publicly shared Google Drive image. */
export function toGoogleDriveImageUrl(value: string): string {
  const id = getGoogleDriveFileId(value);
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : value.trim();
}

/** Preview URL for a publicly shared Google Drive document/PDF. */
export function toGoogleDrivePreviewUrl(value: string): string {
  const id = getGoogleDriveFileId(value);
  return id ? `https://drive.google.com/file/d/${id}/preview` : value.trim();
}
