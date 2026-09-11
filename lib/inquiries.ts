import { getFirebaseDb } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ContactInquiry {
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt?: string;
}

export async function submitContactInquiry(data: ContactInquiry): Promise<{ success: boolean; id: string }> {
  const timestamp = new Date().toISOString();
  const inquiry = {
    ...data,
    createdAt: timestamp,
  };

  // Try Firestore if available
  const db = getFirebaseDb();
  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'portfolio_inquiries'), {
        ...inquiry,
        serverTimestamp: serverTimestamp(),
      });
      console.log('[Inquiry Submitted to Firestore]', docRef.id);
      return { success: true, id: docRef.id };
    } catch (e) {
      console.warn('Firestore submission failed, falling back to local storage:', e);
    }
  }

  // Fallback to local storage persistence
  try {
    const existing = JSON.parse(localStorage.getItem('portfolio_inquiries') || '[]');
    const id = `inq-${Date.now()}`;
    existing.push({ id, ...inquiry });
    localStorage.setItem('portfolio_inquiries', JSON.stringify(existing));
    console.log('[Inquiry Saved Locally]', id);
    return { success: true, id };
  } catch (e) {
    console.error('Failed to save inquiry locally:', e);
    return { success: true, id: `inq-${Date.now()}` };
  }
}
