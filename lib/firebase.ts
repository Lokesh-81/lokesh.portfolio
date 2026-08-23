import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  type Firestore
} from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import {
  initialStudioProjects,
  initialExperiments,
  initialChangelog,
  type StudioProject,
  type StudioExperiment,
  type StudioChangelog
} from "@/lib/data/studio"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || ""
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== ""
)

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

if (typeof window !== "undefined" && isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.warn("Firebase initialization skipped or error:", error)
  }
}

export { app, db, auth }

// Local storage key fallbacks when Firebase env vars aren't provided
const STORAGE_KEYS = {
  PROJECTS: "lokesh_studio_projects",
  EXPERIMENTS: "lokesh_studio_experiments",
  CHANGELOG: "lokesh_studio_changelog"
}

function getLocalData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback
  try {
    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(item) as T[]
  } catch {
    return fallback
  }
}

function saveLocalData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn("Failed to persist to localStorage", e)
  }
}

// Fetch Projects
export async function fetchStudioProjects(): Promise<StudioProject[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "studio_projects"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as StudioProject[]
      }
    } catch (e) {
      console.warn("Firestore fetch error, falling back to local data:", e)
    }
  }
  return getLocalData<StudioProject>(STORAGE_KEYS.PROJECTS, initialStudioProjects)
}

// Fetch Experiments
export async function fetchStudioExperiments(): Promise<StudioExperiment[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "experiments"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as StudioExperiment[]
      }
    } catch (e) {
      console.warn("Firestore experiments fetch error, falling back to local data:", e)
    }
  }
  return getLocalData<StudioExperiment>(STORAGE_KEYS.EXPERIMENTS, initialExperiments)
}

// Fetch Changelog
export async function fetchStudioChangelog(): Promise<StudioChangelog[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "changelog"), orderBy("date", "desc"))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as StudioChangelog[]
      }
    } catch (e) {
      console.warn("Firestore changelog fetch error, falling back to local data:", e)
    }
  }
  return getLocalData<StudioChangelog>(STORAGE_KEYS.CHANGELOG, initialChangelog)
}

// CRUD Operations for Studio Admin
export async function saveStudioProject(project: Omit<StudioProject, "id">, existingId?: string): Promise<StudioProject> {
  if (isFirebaseConfigured && db) {
    try {
      if (existingId) {
        const docRef = doc(db, "studio_projects", existingId)
        await updateDoc(docRef, { ...project, updatedAt: new Date().toISOString() })
        return { id: existingId, ...project }
      } else {
        const docRef = await addDoc(collection(db, "studio_projects"), {
          ...project,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        return { id: docRef.id, ...project }
      }
    } catch (e) {
      console.warn("Firestore save project error, saving locally:", e)
    }
  }

  // Local storage fallback
  const list = getLocalData<StudioProject>(STORAGE_KEYS.PROJECTS, initialStudioProjects)
  if (existingId) {
    const updated = list.map((p) => (p.id === existingId ? { ...p, ...project, updatedAt: new Date().toISOString() } : p))
    saveLocalData(STORAGE_KEYS.PROJECTS, updated)
    return { id: existingId, ...project }
  } else {
    const newProject: StudioProject = {
      id: `sp-${Date.now()}`,
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveLocalData(STORAGE_KEYS.PROJECTS, [newProject, ...list])
    return newProject
  }
}

export async function deleteStudioProject(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "studio_projects", id))
    } catch (e) {
      console.warn("Firestore delete project error:", e)
    }
  }
  const list = getLocalData<StudioProject>(STORAGE_KEYS.PROJECTS, initialStudioProjects)
  saveLocalData(STORAGE_KEYS.PROJECTS, list.filter((p) => p.id !== id))
}

export async function saveStudioExperiment(exp: Omit<StudioExperiment, "id">, existingId?: string): Promise<StudioExperiment> {
  if (isFirebaseConfigured && db) {
    try {
      if (existingId) {
        const docRef = doc(db, "experiments", existingId)
        await updateDoc(docRef, { ...exp })
        return { id: existingId, ...exp }
      } else {
        const docRef = await addDoc(collection(db, "experiments"), {
          ...exp,
          createdAt: new Date().toISOString()
        })
        return { id: docRef.id, ...exp }
      }
    } catch (e) {
      console.warn("Firestore save experiment error:", e)
    }
  }

  const list = getLocalData<StudioExperiment>(STORAGE_KEYS.EXPERIMENTS, initialExperiments)
  if (existingId) {
    const updated = list.map((item) => (item.id === existingId ? { ...item, ...exp } : item))
    saveLocalData(STORAGE_KEYS.EXPERIMENTS, updated)
    return { id: existingId, ...exp }
  } else {
    const newItem: StudioExperiment = {
      id: `exp-${Date.now()}`,
      ...exp,
      createdAt: new Date().toISOString()
    }
    saveLocalData(STORAGE_KEYS.EXPERIMENTS, [newItem, ...list])
    return newItem
  }
}

export async function deleteStudioExperiment(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "experiments", id))
    } catch (e) {
      console.warn("Firestore delete experiment error:", e)
    }
  }
  const list = getLocalData<StudioExperiment>(STORAGE_KEYS.EXPERIMENTS, initialExperiments)
  saveLocalData(STORAGE_KEYS.EXPERIMENTS, list.filter((item) => item.id !== id))
}

export async function saveStudioChangelog(entry: Omit<StudioChangelog, "id">, existingId?: string): Promise<StudioChangelog> {
  if (isFirebaseConfigured && db) {
    try {
      if (existingId) {
        const docRef = doc(db, "changelog", existingId)
        await updateDoc(docRef, { ...entry })
        return { id: existingId, ...entry }
      } else {
        const docRef = await addDoc(collection(db, "changelog"), { ...entry })
        return { id: docRef.id, ...entry }
      }
    } catch (e) {
      console.warn("Firestore save changelog error:", e)
    }
  }

  const list = getLocalData<StudioChangelog>(STORAGE_KEYS.CHANGELOG, initialChangelog)
  if (existingId) {
    const updated = list.map((item) => (item.id === existingId ? { ...item, ...entry } : item))
    saveLocalData(STORAGE_KEYS.CHANGELOG, updated)
    return { id: existingId, ...entry }
  } else {
    const newItem: StudioChangelog = {
      id: `ch-${Date.now()}`,
      ...entry
    }
    saveLocalData(STORAGE_KEYS.CHANGELOG, [newItem, ...list])
    return newItem
  }
}

export async function deleteStudioChangelog(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "changelog", id))
    } catch (e) {
      console.warn("Firestore delete changelog error:", e)
    }
  }
  const list = getLocalData<StudioChangelog>(STORAGE_KEYS.CHANGELOG, initialChangelog)
  saveLocalData(STORAGE_KEYS.CHANGELOG, list.filter((item) => item.id !== id))
}
