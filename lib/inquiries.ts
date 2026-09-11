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
  // Validate required fields
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    throw new Error('Please fill in all required fields (name, email, message).');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    throw new Error('Please provide a valid email address.');
  }

  const timestamp = new Date().toISOString();
  const inquiry = {
    name: data.name.trim(),
    email: data.email.trim(),
    projectType: data.projectType?.trim() || 'General Inquiry',
    message: data.message.trim(),
    createdAt: timestamp,
  };

  const db = getFirebaseDb();
  if (!db) {
    throw new Error('Database connection unavailable. Please contact directly via WhatsApp or email.');
  }

  // 10-second timeout guard to prevent UI from hanging on "Sending..."
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Network request timed out. Please check your connection or reach out on WhatsApp.'));
    }, 10000);
  });

  const writePromise = (async () => {
    const docRef = await addDoc(collection(db, 'portfolio_inquiries'), {
      ...inquiry,
      serverTimestamp: serverTimestamp(),
    });
    console.log('[Inquiry Submitted to Firestore]', docRef.id);
    return { success: true, id: docRef.id };
  })();

  return await Promise.race([writePromise, timeoutPromise]);
}

