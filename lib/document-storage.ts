/**
 * Persistent document storage utilizing IndexedDB with LocalStorage fallback.
 * Allows storing full-size PDF documents and provides cross-tab synchronization.
 */

const DB_NAME = 'lokesh_portfolio_docs_db';
const DB_VERSION = 1;
const STORE_NAME = 'documents';
const SYNC_CHANNEL_NAME = 'lokesh_portfolio_sync_channel';

// Initialize IndexedDB
function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('[DocStorage] IndexedDB open error, falling back to storage');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

export interface StoredDocument {
  id: string;
  dataUrl?: string;
  blob?: Blob;
  name: string;
  type: string;
  size: number;
  updatedAt: string;
}

export const ACTIVE_RESUME_DOC_ID = 'active_portfolio_resume';
const LOCAL_ACTIVE_RESUME_KEY = 'lokesh_active_resume_meta';

/**
 * Save active resume document both in IndexedDB and in localStorage
 */
export async function saveActiveResumeDocument(doc: {
  name: string;
  dataUrl: string;
  size?: number;
  type?: string;
}): Promise<boolean> {
  const payload: StoredDocument = {
    id: ACTIVE_RESUME_DOC_ID,
    name: doc.name,
    dataUrl: doc.dataUrl,
    size: doc.size || doc.dataUrl.length,
    type: doc.type || 'application/pdf',
    updatedAt: new Date().toISOString(),
  };

  // Save metadata to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        LOCAL_ACTIVE_RESUME_KEY,
        JSON.stringify({
          name: doc.name,
          size: doc.size,
          updatedAt: payload.updatedAt,
          hasPayload: true,
        })
      );
    } catch {}
  }

  // Save full binary data to IndexedDB
  const ok = await saveDocumentToDb(payload);
  broadcastPortfolioSync('resume_replaced', { name: doc.name, updatedAt: payload.updatedAt });
  return ok;
}

/**
 * Retrieve the active resume document from IndexedDB
 */
export async function getActiveResumeDocument(): Promise<StoredDocument | null> {
  return await getDocumentFromDb(ACTIVE_RESUME_DOC_ID);
}

/**
 * Check if an active uploaded resume document exists
 */
export function hasActiveUploadedResume(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem(LOCAL_ACTIVE_RESUME_KEY);
  } catch {
    return false;
  }
}

/**
 * Save document in IndexedDB
 */
export async function saveDocumentToDb(doc: StoredDocument): Promise<boolean> {
  try {
    const db = await openDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(doc);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('[DocStorage] Error saving to IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieve document from IndexedDB
 */
export async function getDocumentFromDb(id: string): Promise<StoredDocument | null> {
  try {
    const db = await openDb();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Delete document from IndexedDB
 */
export async function deleteDocumentFromDb(id: string): Promise<boolean> {
  try {
    const db = await openDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Cross-tab and cross-window real-time notification
 */
export function broadcastPortfolioSync(action: string, payload?: any) {
  if (typeof window === 'undefined') return;

  try {
    // 1. BroadcastChannel (modern browsers)
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ action, payload, timestamp: Date.now() });
      channel.close();
    }
  } catch {}

  // 2. CustomEvent in same window / frame
  try {
    window.dispatchEvent(
      new CustomEvent('portfolio_dataset_updated', {
        detail: { action, payload, timestamp: Date.now() },
      })
    );
  } catch {}
}

/**
 * Subscribe to sync messages
 */
export function subscribeToPortfolioSync(callback: (event: { action: string; payload?: any }) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let channel: BroadcastChannel | null = null;
  const onBroadcast = (msg: MessageEvent) => {
    if (msg.data) {
      callback(msg.data);
    }
  };

  const onCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.addEventListener('message', onBroadcast);
    }
  } catch {}

  window.addEventListener('portfolio_dataset_updated', onCustomEvent);

  return () => {
    if (channel) {
      try {
        channel.removeEventListener('message', onBroadcast);
        channel.close();
      } catch {}
    }
    window.removeEventListener('portfolio_dataset_updated', onCustomEvent);
  };
}

/**
 * Appends cache-busting timestamp to URLs to ensure browsers don't serve stale cached PDFs
 */
export function getCacheBustedUrl(url?: string | null, customTimestamp?: string | number): string {
  if (!url) return '';
  // Data URLs and blob URLs don't need cache busters
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  const t = customTimestamp || Date.now();
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}cb=${t}`;
}
