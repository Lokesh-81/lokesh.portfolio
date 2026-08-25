"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  User as UserIcon,
  Briefcase,
  Layers,
  Code2,
  FolderGit2,
  Share2,
  PhoneCall,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Lock,
  LogOut,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Database,
  ArrowUpRight,
  MoveUp,
  MoveDown,
  Globe,
  Sliders,
  CheckCircle2,
  Mail,
  Copy,
  ChevronRight,
  HelpCircle
} from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import {
  type User,
  type ProfileData,
  type ExperienceItem,
  type TechItem,
  type ProjectItem,
  type SocialData,
  type ContactData,
  type SkillLevel,
  ADMIN_EMAIL,
  subscribeToAuth,
  signInWithGoogle,
  signInWithEmail,
  createAdminAccount,
  sendAdminPasswordReset,
  signOutStudio,
  saveProfileData,
  saveExperienceItem,
  deleteExperienceItem,
  saveTechStackItem,
  deleteTechStackItem,
  saveProjectItem,
  deleteProjectItem,
  saveSocialData,
  saveContactData,
  uploadProfilePhoto,
  seedInitialDataToFirestore
} from "@/lib/firebase"
import { usePortfolio } from "@/lib/portfolio-context"

type StudioTab = "profile" | "experience" | "projects" | "skills" | "contact" | "system"

export default function StudioPage() {
  const {
    profile,
    experiences,
    technologies,
    projects,
    social,
    contact,
    refreshAll,
    updateProfileState,
    updateSocialState,
    updateContactState,
    setExperiencesState,
    setTechnologiesState,
    setProjectsState
  } = usePortfolio()

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authEmail, setAuthEmail] = useState(ADMIN_EMAIL)
  const [authPassword, setAuthPassword] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  // Navigation
  const [activeTab, setActiveTab] = useState<StudioTab>("profile")

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  // Profile Form State
  const [profileForm, setProfileForm] = useState<ProfileData>(profile)
  const [photoUploadProgress, setPhotoUploadProgress] = useState<number | null>(null)
  const [photoUrlInput, setPhotoUrlInput] = useState("")
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Experience Modal / Edit State
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null)
  const [isExpModalOpen, setIsExpModalOpen] = useState(false)
  const [newRespInput, setNewRespInput] = useState("")
  const [newTechExpInput, setNewTechExpInput] = useState("")

  // Project Modal / Edit State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [newWorkItemInput, setNewWorkItemInput] = useState("")
  const [newProjectTechInput, setNewProjectTechInput] = useState("")
  const [projectFilterCategory, setProjectFilterCategory] = useState("All")

  // Skills State
  const [editingTech, setEditingTech] = useState<TechItem | null>(null)
  const [isTechModalOpen, setIsTechModalOpen] = useState(false)
  const [techCategoryFilter, setTechCategoryFilter] = useState("All")

  // Social & Contact State
  const [socialForm, setSocialForm] = useState<SocialData>(social)
  const [contactForm, setContactForm] = useState<ContactData>(contact)

  // General Loading/Saving States
  const [savingSection, setSavingSection] = useState<string | null>(null)

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Subscribe to Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Synchronize local form copies when portfolio data loads
  useEffect(() => {
    setProfileForm(profile)
    setPhotoUrlInput(profile.photoUrl || "")
  }, [profile])

  useEffect(() => {
    setSocialForm(social)
  }, [social])

  useEffect(() => {
    setContactForm(contact)
  }, [contact])

  // Handle Auth
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both admin email and password.")
      return
    }
    if (authEmail.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setAuthError(`Only ${ADMIN_EMAIL} is authorized for Portfolio Studio.`)
      return
    }
    setIsSubmittingAuth(true)
    setAuthError(null)
    try {
      await signInWithEmail(authEmail, authPassword)
      showToast("Welcome to Portfolio Studio!", "success")
    } catch (err: any) {
      console.error("Auth error:", err)
      if (err.code === "auth/operation-not-allowed" || err.message?.includes("PASSWORD_LOGIN_DISABLED") || err.message?.includes("OPERATION_NOT_ALLOWED")) {
        setAuthError(
          "Email/Password sign-in is not enabled in Firebase Authentication. In Firebase Console → Authentication → Sign-in method, please enable the 'Email/Password' provider."
        )
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-email") {
        setAuthError(
          `Invalid credentials for ${ADMIN_EMAIL}. If you haven't created the password in Firebase yet, click 'Forgot / Setup Password?' or use Google Sign-In.`
        )
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError(
          "Firebase Authentication: unauthorized domain. Please add 'lokeshportfolio-pink.vercel.app' to Firebase Console → Authentication → Settings → Authorized domains."
        )
      } else {
        setAuthError(err.message || "Failed to sign in. Please verify your credentials.")
      }
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsSubmittingAuth(true)
    setAuthError(null)
    try {
      await signInWithGoogle()
      showToast("Signed in successfully with Google", "success")
    } catch (err: any) {
      console.error("Google Auth error:", err)
      if (err.code === "auth/unauthorized-domain") {
        setAuthError(
          "Firebase Authentication: unauthorized domain. In Firebase Console → Authentication → Settings → Authorized domains, please add 'lokeshportfolio-pink.vercel.app'."
        )
      } else if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Google Sign-In popup was closed before completing login.")
      } else {
        setAuthError(err.message || "Google sign in was cancelled or failed.")
      }
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  const handleSendResetLink = async () => {
    setIsSendingReset(true)
    setAuthError(null)
    try {
      await sendAdminPasswordReset(ADMIN_EMAIL)
      showToast(`Password setup link sent to ${ADMIN_EMAIL}! Check your inbox.`, "success")
    } catch (err: any) {
      console.error("Password reset error:", err)
      if (err.code === "auth/unauthorized-domain") {
        setAuthError(
          "Firebase Authentication: unauthorized domain. Please add 'lokeshportfolio-pink.vercel.app' to Firebase Console → Authentication → Settings → Authorized domains."
        )
      } else if (err.code === "auth/operation-not-allowed" || err.message?.includes("OPERATION_NOT_ALLOWED")) {
        setAuthError(
          "Email/Password provider is disabled in Firebase Console. In Firebase Console → Authentication → Sign-in method, please enable 'Email/Password'."
        )
      } else {
        setAuthError(err.message || "Failed to send password reset email.")
      }
    } finally {
      setIsSendingReset(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!authPassword || authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters to create the account in Firebase.")
      return
    }
    setIsCreatingAccount(true)
    setAuthError(null)
    try {
      await createAdminAccount(authPassword)
      showToast(`Admin account created in Firebase Authentication for ${ADMIN_EMAIL}!`, "success")
    } catch (err: any) {
      console.error("Create account error:", err)
      if (err.code === "auth/email-already-in-use") {
        setAuthError(`The account ${ADMIN_EMAIL} already exists in Firebase Auth. Try logging in or use 'Forgot / Setup Password?'.`)
      } else if (err.code === "auth/operation-not-allowed" || err.message?.includes("OPERATION_NOT_ALLOWED")) {
        setAuthError(
          "Email/Password sign-up is disabled in Firebase. In Firebase Console → Authentication → Sign-in method, please enable 'Email/Password'."
        )
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError(
          "Firebase Authentication: unauthorized domain. Please add 'lokeshportfolio-pink.vercel.app' to Firebase Console → Authentication → Settings → Authorized domains."
        )
      } else {
        setAuthError(err.message || "Failed to create Firebase Auth account.")
      }
    } finally {
      setIsCreatingAccount(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutStudio()
      showToast("Signed out of Studio", "info")
    } catch (err: any) {
      showToast("Sign out failed", "error")
    }
  }

  // --- Profile Photo Handlers ---
  const handlePhotoFileSelected = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, WEBP)", "error")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be under 5MB", "error")
      return
    }

    try {
      setPhotoUploadProgress(10)
      const downloadUrl = await uploadProfilePhoto(file, (progress) => {
        setPhotoUploadProgress(progress)
      })
      setProfileForm((prev) => ({ ...prev, photoUrl: downloadUrl }))
      setPhotoUrlInput(downloadUrl)
      updateProfileState({ photoUrl: downloadUrl })
      showToast("Profile photo uploaded and saved!", "success")
    } catch (err: any) {
      console.error("Photo upload error:", err)
      showToast("Upload failed: " + (err.message || "Please check Firebase Storage"), "error")
    } finally {
      setPhotoUploadProgress(null)
    }
  }

  const handleSavePhotoUrl = async () => {
    try {
      setSavingSection("photo")
      await saveProfileData({ photoUrl: photoUrlInput.trim() })
      setProfileForm((prev) => ({ ...prev, photoUrl: photoUrlInput.trim() }))
      updateProfileState({ photoUrl: photoUrlInput.trim() })
      showToast("Profile photo updated!", "success")
    } catch (e: any) {
      showToast("Failed to update photo URL", "error")
    } finally {
      setSavingSection(null)
    }
  }

  const handleRemovePhoto = async () => {
    try {
      setSavingSection("photo")
      await saveProfileData({ photoUrl: "" })
      setProfileForm((prev) => ({ ...prev, photoUrl: "" }))
      setPhotoUrlInput("")
      updateProfileState({ photoUrl: "" })
      showToast("Profile photo removed. Fallback monogram restored.", "info")
    } catch (e: any) {
      showToast("Failed to remove photo", "error")
    } finally {
      setSavingSection(null)
    }
  }

  // --- Profile Data Save ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingSection("profile")
      await saveProfileData(profileForm)
      updateProfileState(profileForm)
      showToast("Personal info & bio saved to Firestore!", "success")
    } catch (err: any) {
      showToast("Failed to save profile: " + err.message, "error")
    } finally {
      setSavingSection(null)
    }
  }

  // --- Experience CRUD ---
  const handleOpenNewExp = () => {
    setEditingExp({
      id: "",
      company: "",
      role: "",
      period: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "Remote",
      type: "Web Development",
      description: "",
      responsibilities: [],
      technologies: [],
      link: "",
      order: experiences.length,
      featured: true
    })
    setIsExpModalOpen(true)
  }

  const handleSaveExpModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExp) return
    try {
      setSavingSection("exp-modal")
      const { id, ...data } = editingExp
      const saved = await saveExperienceItem(data, id || undefined)

      setExperiencesState((prev) => {
        const index = prev.findIndex((item) => item.id === saved.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = saved
          return updated
        } else {
          return [...prev, saved].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }
      })

      setIsExpModalOpen(false)
      setEditingExp(null)
      showToast("Experience item saved successfully!", "success")
    } catch (err: any) {
      showToast("Error saving experience: " + err.message, "error")
    } finally {
      setSavingSection(null)
    }
  }

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return
    try {
      await deleteExperienceItem(id)
      setExperiencesState((prev) => prev.filter((item) => item.id !== id))
      showToast("Experience deleted", "info")
    } catch (err: any) {
      showToast("Failed to delete experience", "error")
    }
  }

  const handleMoveExp = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= experiences.length) return

    const reordered = [...experiences]
    const temp = reordered[index]
    reordered[index] = reordered[targetIndex]
    reordered[targetIndex] = temp

    // Update order numbers
    const updated = reordered.map((item, idx) => ({ ...item, order: idx }))
    setExperiencesState(updated)

    try {
      await Promise.all(updated.map((item) => saveExperienceItem(item, item.id)))
      showToast("Experience reordered", "success")
    } catch (e) {
      showToast("Reorder saved locally", "info")
    }
  }

  // --- Project CRUD ---
  const handleOpenNewProject = () => {
    const nextNumber = String(projects.length + 1).padStart(2, "0")
    setEditingProject({
      id: "",
      number: nextNumber,
      name: "",
      category: "AI & FinTech",
      tagline: "",
      shortDescription: "",
      description: "",
      whatIWorkedOn: [],
      technologies: [],
      status: "Live",
      liveUrl: "",
      githubUrl: "https://github.com/Lokesh-81",
      year: new Date().getFullYear().toString(),
      accentColor: "#a78bfa",
      gradient: "from-purple-900/40 via-violet-950/20 to-black/60",
      featured: true,
      visible: true,
      order: projects.length
    })
    setIsProjectModalOpen(true)
  }

  const handleSaveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    try {
      setSavingSection("proj-modal")
      const { id, ...data } = editingProject
      const saved = await saveProjectItem(data, id || undefined)

      setProjectsState((prev) => {
        const index = prev.findIndex((item) => item.id === saved.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = saved
          return updated
        } else {
          return [...prev, saved].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }
      })

      setIsProjectModalOpen(false)
      setEditingProject(null)
      showToast("Project saved and updated live on portfolio!", "success")
    } catch (err: any) {
      showToast("Error saving project: " + err.message, "error")
    } finally {
      setSavingSection(null)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await deleteProjectItem(id)
      setProjectsState((prev) => prev.filter((p) => p.id !== id))
      showToast("Project removed", "info")
    } catch (err: any) {
      showToast("Failed to delete project", "error")
    }
  }

  const handleToggleProjectVisibility = async (proj: ProjectItem) => {
    const updated = { ...proj, visible: !proj.visible }
    setProjectsState((prev) => prev.map((p) => (p.id === proj.id ? updated : p)))
    try {
      await saveProjectItem(updated, proj.id)
      showToast(updated.visible ? "Project is now visible on /work" : "Project hidden from /work", "info")
    } catch (e) {
      showToast("Visibility updated", "info")
    }
  }

  // --- Tech Stack CRUD ---
  const handleOpenNewTech = () => {
    setEditingTech({
      id: "",
      name: "",
      level: "Core",
      category: "Languages",
      order: technologies.length
    })
    setIsTechModalOpen(true)
  }

  const handleSaveTechModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTech) return
    try {
      setSavingSection("tech-modal")
      const { id, ...data } = editingTech
      const saved = await saveTechStackItem(data, id || undefined)

      setTechnologiesState((prev) => {
        const index = prev.findIndex((item) => item.id === saved.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = saved
          return updated
        } else {
          return [...prev, saved].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }
      })

      setIsTechModalOpen(false)
      setEditingTech(null)
      showToast("Technology skill saved!", "success")
    } catch (err: any) {
      showToast("Error saving technology: " + err.message, "error")
    } finally {
      setSavingSection(null)
    }
  }

  const handleDeleteTech = async (id: string) => {
    try {
      await deleteTechStackItem(id)
      setTechnologiesState((prev) => prev.filter((t) => t.id !== id))
      showToast("Tech skill removed", "info")
    } catch (e) {
      showToast("Failed to remove skill", "error")
    }
  }

  // --- Social & Contact Save ---
  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingSection("social")
      await saveSocialData(socialForm)
      updateSocialState(socialForm)
      showToast("Social links saved!", "success")
    } catch (err: any) {
      showToast("Failed to save social links", "error")
    } finally {
      setSavingSection(null)
    }
  }

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingSection("contact")
      await saveContactData(contactForm)
      updateContactState(contactForm)
      showToast("Contact details saved!", "success")
    } catch (err: any) {
      showToast("Failed to save contact info", "error")
    } finally {
      setSavingSection(null)
    }
  }

  // --- Database Seed ---
  const handleSeedDefaults = async () => {
    if (
      !confirm(
        "Sync initial authentic data to Firestore? This will populate your Firebase database with your portfolio data."
      )
    )
      return
    try {
      setSavingSection("seed")
      await seedInitialDataToFirestore()
      await refreshAll()
      showToast("Firestore synchronized with authentic portfolio content!", "success")
    } catch (err: any) {
      showToast("Seed failed: " + err.message, "error")
    } finally {
      setSavingSection(null)
    }
  }

  const projectCategoriesList = [
    "All",
    "Business / Startup Platform",
    "Healthcare / Technology",
    "Corporate / Business Platform",
    "AI / FinTech / Investment Research",
    "Photography / Creative Portfolio",
    "Education / EdTech"
  ]

  const techCategoriesList = [
    "All",
    "Languages",
    "Frontend & UI",
    "Backend & APIs",
    "Databases & Cloud",
    "Tools & Emerging"
  ]

  const accentColorPresets = [
    { label: "Purple", value: "#a78bfa", gradient: "from-purple-900/40 via-violet-950/20 to-black/60" },
    { label: "Sky Blue", value: "#38bdf8", gradient: "from-sky-900/40 via-blue-950/20 to-black/60" },
    { label: "Emerald", value: "#34d399", gradient: "from-emerald-900/40 via-teal-950/20 to-black/60" },
    { label: "Amber", value: "#f59e0b", gradient: "from-amber-900/40 via-orange-950/20 to-black/60" },
    { label: "Rose Pink", value: "#ec4899", gradient: "from-pink-900/40 via-rose-950/20 to-black/60" },
    { label: "Fuchsia", value: "#c084fc", gradient: "from-fuchsia-900/40 via-purple-950/20 to-black/60" },
    { label: "Blue", value: "#60a5fa", gradient: "from-blue-900/40 via-indigo-950/20 to-black/60" }
  ]

  // Filtered lists
  const filteredProjects = projects.filter((p) => {
    if (projectFilterCategory === "All") return true
    return p.category === projectFilterCategory
  })

  const filteredTech = technologies.filter((t) => {
    if (techCategoryFilter === "All") return true
    return t.category === techCategoryFilter
  })

  // Loading Screen
  if (authLoading) {
    return (
      <PortfolioShell className="pt-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
          <RefreshCw className="size-8 animate-spin text-purple-400" />
          <p className="text-sm font-mono text-white/60">Connecting to Studio...</p>
        </div>
      </PortfolioShell>
    )
  }

  // Unauthenticated Login Gate
  if (!currentUser) {
    return (
      <PortfolioShell className="pt-10 md:pt-16">
        <div className="mx-auto max-w-lg">
          <div className="overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 via-black/80 to-black/95 p-8 md:p-10 backdrop-blur-2xl shadow-2xl space-y-7">
            {/* Studio Icon & Branding */}
            <div className="text-center space-y-2.5">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-purple-400/40 bg-purple-500/10 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                <Lock className="size-6" />
              </div>
              <h1 className="text-3xl font-light tracking-tight text-white md:text-4xl">
                Portfolio <span className="instrument italic text-purple-300">Studio</span>
              </h1>
              <p className="text-xs text-white/65 leading-relaxed max-w-sm mx-auto">
                Admin Content Management System. Restricted to authorized administrator identity.
              </p>
            </div>

            {authError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Google Sign-in */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmittingAuth || isSendingReset || isCreatingAccount}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-medium text-white transition-all hover:border-purple-400/50 hover:bg-purple-500/10 hover:shadow-lg disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-black px-3 text-[10px] uppercase font-mono tracking-wider text-white/40">
                Or with Admin Credentials
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="poosala15@gmail.com"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleSendResetLink}
                    disabled={isSendingReset || isSubmittingAuth}
                    className="text-[10px] font-mono text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-2"
                  >
                    {isSendingReset ? "Sending Link..." : "Forgot / Setup Password?"}
                  </button>
                </div>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth || isSendingReset || isCreatingAccount}
                className="w-full rounded-xl bg-purple-600 py-3 text-xs font-semibold text-white transition-all hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingAuth ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3.5" />
                    <span>Enter Studio CMS</span>
                  </>
                )}
              </button>

              {/* First-time account initialization helper */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-white/40">
                <span>First time setting up?</span>
                <button
                  type="button"
                  onClick={handleCreateAdmin}
                  disabled={isCreatingAccount || isSubmittingAuth || !authPassword}
                  className="text-purple-300 hover:text-purple-200 underline underline-offset-2 disabled:opacity-40"
                  title="Registers poosala15@gmail.com with the entered password directly in Firebase Authentication"
                >
                  {isCreatingAccount ? "Registering in Firebase..." : "Initialize Admin in Firebase Auth"}
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-white/10 text-center">
              <Link
                href="/"
                className="text-xs text-white/45 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                ← Return to Public Portfolio
              </Link>
            </div>
          </div>
        </div>
      </PortfolioShell>
    )
  }

  // Authenticated Studio Interface
  return (
    <PortfolioShell className="pt-6 md:pt-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-200"
                : toast.type === "error"
                ? "border-rose-500/40 bg-rose-950/90 text-rose-200"
                : "border-sky-500/40 bg-sky-950/90 text-sky-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-400" />
            ) : toast.type === "error" ? (
              <AlertCircle className="size-4 text-rose-400" />
            ) : (
              <Sparkles className="size-4 text-sky-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-8">
        {/* Studio Top Control Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-black/80 to-purple-950/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
                  Live Studio CMS · Admin Connected
                </span>
              </div>
              <h1 className="text-2xl font-light tracking-tight text-white md:text-3xl">
                Content Management <span className="instrument italic text-purple-300">Studio</span>
              </h1>
              <p className="text-xs text-white/60">
                Logged in as <span className="font-mono text-white/90">{currentUser.email || "Admin"}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleSeedDefaults}
                disabled={savingSection === "seed"}
                className="flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-2 text-xs font-medium text-purple-200 transition-all hover:bg-purple-500/25"
                title="Sync default authentic content to Firestore collections"
              >
                <Database className="size-3.5 text-purple-300" />
                <span>{savingSection === "seed" ? "Syncing..." : "Sync / Bootstrap Data"}</span>
              </button>

              <Link
                href="/work"
                target="_blank"
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 text-xs font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                <Globe className="size-3.5 text-white/60" />
                <span>View Live Portfolio</span>
                <ArrowUpRight className="size-3 text-white/40" />
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-rose-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/10"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl">
          {[
            { id: "profile", label: "Profile", icon: UserIcon },
            { id: "experience", label: `Experience (${experiences.length})`, icon: Briefcase },
            { id: "projects", label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: "skills", label: `Tech Stack (${technologies.length})`, icon: Code2 },
            { id: "contact", label: "Socials & Contact", icon: PhoneCall },
            { id: "system", label: "Settings", icon: Database }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudioTab)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PROFILE & PHOTO */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Photo Uploader Card */}
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                    <ImageIcon className="size-4" />
                    <span>PROFILE PHOTO</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Upload your profile photo or provide an image link. Reflects instantly in the navbar and public views.
                  </p>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center justify-center gap-4 py-2">
                  <div className="relative group">
                    <div className="size-28 rounded-full border-2 border-purple-400/40 bg-white/10 overflow-hidden flex items-center justify-center shadow-xl">
                      {profileForm.photoUrl ? (
                        <img
                          src={profileForm.photoUrl}
                          alt={profileForm.displayName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold tracking-wider text-white">PL</span>
                      )}
                    </div>
                    <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-400 border-2 border-black" />
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingPhoto(true)
                    }}
                    onDragLeave={() => setIsDraggingPhoto(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDraggingPhoto(false)
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handlePhotoFileSelected(e.dataTransfer.files[0])
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                      isDraggingPhoto
                        ? "border-purple-400 bg-purple-500/10"
                        : "border-white/15 bg-white/[0.02] hover:border-purple-400/40 hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePhotoFileSelected(e.target.files[0])
                        }
                      }}
                    />
                    <Upload className="mx-auto size-6 text-purple-400 mb-2" />
                    <p className="text-xs font-medium text-white">Click or Drag & Drop Image</p>
                    <p className="text-[10px] text-white/40 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>

                  {photoUploadProgress !== null && (
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-[10px] text-purple-300 font-mono">
                        <span>Uploading to Storage...</span>
                        <span>{photoUploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${photoUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Direct Image URL input */}
                  <div className="w-full space-y-2 border-t border-white/10 pt-4">
                    <label className="text-[11px] font-mono text-white/50">Or Direct Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        placeholder="https://.../photo.jpg"
                        className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-purple-400 focus:outline-none"
                      />
                      <button
                        onClick={handleSavePhotoUrl}
                        disabled={savingSection === "photo"}
                        className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-500 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {profileForm.photoUrl && (
                    <button
                      onClick={handleRemovePhoto}
                      disabled={savingSection === "photo"}
                      className="text-xs text-rose-300/80 hover:text-rose-300 transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      <span>Remove Photo (Restore PL Monogram)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSaveProfile}
                className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-light text-white">Basic Personal Details</h2>
                    <p className="text-xs text-white/60">
                      Manage names, headline, bio descriptions, location, and education.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingSection === "profile"}
                    className="flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/30"
                  >
                    <Save className="size-3.5" />
                    <span>{savingSection === "profile" ? "Saving..." : "Save Profile"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/60">Full Legal Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/60">Display Name</label>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    Hero Subheading / Title
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    Homepage Short Bio / Value Statement
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.shortBio}
                    onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/60">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/60">Education Badge</label>
                    <input
                      type="text"
                      value={profileForm.education}
                      onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/60">
                      Recognition / Ambassador
                    </label>
                    <input
                      type="text"
                      value={profileForm.recognition}
                      onChange={(e) => setProfileForm({ ...profileForm, recognition: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/60">
                      Spoken Languages (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={profileForm.languages ? profileForm.languages.join(", ") : ""}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          languages: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        })
                      }
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    About Page Secondary Detail
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.aboutSubDescription}
                    onChange={(e) => setProfileForm({ ...profileForm, aboutSubDescription: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EXPERIENCE & LEADERSHIP */}
        {/* ========================================================================= */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-light text-white">Work Experience & Leadership</h2>
                <p className="text-xs text-white/60">
                  Manage your internships, roles, and campus ambassador engagements.
                </p>
              </div>

              <button
                onClick={handleOpenNewExp}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg"
              >
                <Plus className="size-4" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id || index}
                  className="group rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl transition-all hover:border-purple-400/40"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-300">
                          {exp.company}
                        </span>
                        <span className="text-white/40">·</span>
                        <span className="font-mono text-white/60">{exp.period}</span>
                        <span className="text-white/40">·</span>
                        <span className="text-white/50">{exp.location}</span>
                      </div>

                      <h3 className="text-lg font-medium text-white">{exp.role}</h3>
                      <p className="text-xs leading-relaxed text-white/70 max-w-3xl">{exp.description}</p>

                      {/* Responsibilities count */}
                      <div className="text-[11px] text-white/50">
                        {exp.responsibilities?.length || 0} bullet points · {exp.technologies?.length || 0} tech tags
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => handleMoveExp(index, "up")}
                        disabled={index === 0}
                        className="rounded-lg border border-white/10 p-2 text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveExp(index, "down")}
                        disabled={index === experiences.length - 1}
                        className="rounded-lg border border-white/10 p-2 text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="size-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingExp(exp)
                          setIsExpModalOpen(true)
                        }}
                        className="rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-200 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 className="size-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExp(exp.id)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROJECTS & CASE STUDIES */}
        {/* ========================================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-light text-white">Shipped Projects & Case Studies</h2>
                <p className="text-xs text-white/60">
                  Manage live projects shown on <span className="font-mono text-purple-300">/work</span>. Toggle visibility or edit case studies.
                </p>
              </div>

              <button
                onClick={handleOpenNewProject}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg"
              >
                <Plus className="size-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {projectCategoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectFilterCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                    projectFilterCategory === cat
                      ? "bg-purple-600 text-white shadow-sm"
                      : "border border-white/10 bg-black/40 text-white/60 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className={`relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                    proj.visible !== false
                      ? "border-white/15 bg-black/40 hover:border-purple-400/40"
                      : "border-white/5 bg-black/20 opacity-60"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-purple-300">{proj.number}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            proj.status === "Live"
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {proj.status}
                        </span>
                        <button
                          onClick={() => handleToggleProjectVisibility(proj)}
                          className="rounded-lg border border-white/10 p-1.5 text-white/50 hover:text-white transition-colors"
                          title={proj.visible !== false ? "Hide from Portfolio" : "Show on Portfolio"}
                        >
                          {proj.visible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono uppercase text-white/40">{proj.category}</span>
                      <h3 className="text-xl font-medium text-white">{proj.name}</h3>
                      <p className="text-xs text-purple-200/80 mt-0.5">{proj.tagline}</p>
                    </div>

                    <p className="text-xs text-white/65 leading-relaxed line-clamp-2">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.technologies?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {(proj.technologies?.length || 0) > 4 && (
                        <span className="text-[10px] text-white/40 pt-0.5">
                          +{(proj.technologies?.length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                    <div className="flex items-center gap-3">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-[11px]"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="size-3" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-[11px]"
                        >
                          <span>Repo</span>
                          <ArrowUpRight className="size-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(proj)
                          setIsProjectModalOpen(true)
                        }}
                        className="rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200 hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="size-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TECH STACK & SKILLS */}
        {/* ========================================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-light text-white">Technologies & Tech Stack</h2>
                <p className="text-xs text-white/60">
                  Manage programming languages, frameworks, databases, and tooling categories.
                </p>
              </div>

              <button
                onClick={handleOpenNewTech}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg"
              >
                <Plus className="size-4" />
                <span>Add Technology</span>
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {techCategoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTechCategoryFilter(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                    techCategoryFilter === cat
                      ? "bg-purple-600 text-white shadow-sm"
                      : "border border-white/10 bg-black/40 text-white/60 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredTech.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl hover:border-purple-400/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40">{tech.category}</span>
                    <h4 className="text-sm font-medium text-white">{tech.name}</h4>
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-mono ${
                        tech.level === "Core"
                          ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                          : tech.level === "Working Knowledge"
                          ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
                          : "border-white/10 bg-white/5 text-white/50"
                      }`}
                    >
                      {tech.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTech(tech)
                        setIsTechModalOpen(true)
                      }}
                      className="rounded-lg p-1.5 text-white/50 hover:text-white transition-colors"
                      title="Edit Skill"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTech(tech.id)}
                      className="rounded-lg p-1.5 text-rose-300/70 hover:text-rose-300 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SOCIAL PROFILES & CONTACT INFO */}
        {/* ========================================================================= */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Social Links Form */}
            <form
              onSubmit={handleSaveSocial}
              className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">Social & Developer Profiles</h3>
                  <p className="text-xs text-white/60">
                    Maintains both GitHub profiles (`lokeshnaivaidya-max` & `Lokesh-81`), LinkedIn, and Instagram.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={savingSection === "social"}
                  className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg"
                >
                  <Save className="size-3.5" />
                  <span>Save Social</span>
                </button>
              </div>

              {/* GitHub Profiles */}
              <div className="space-y-4">
                <label className="text-[11px] font-mono uppercase text-white/60">
                  GitHub Profiles (Popovers & Direct Links)
                </label>
                {socialForm.githubProfiles?.map((gh, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40">Label</label>
                        <input
                          type="text"
                          value={gh.label}
                          onChange={(e) => {
                            const updated = [...socialForm.githubProfiles]
                            updated[idx].label = e.target.value
                            setSocialForm({ ...socialForm, githubProfiles: updated })
                          }}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40">Username</label>
                        <input
                          type="text"
                          value={gh.username}
                          onChange={(e) => {
                            const updated = [...socialForm.githubProfiles]
                            updated[idx].username = e.target.value
                            setSocialForm({ ...socialForm, githubProfiles: updated })
                          }}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40">URL</label>
                      <input
                        type="url"
                        value={gh.url}
                        onChange={(e) => {
                          const updated = [...socialForm.githubProfiles]
                          updated[idx].url = e.target.value
                          setSocialForm({ ...socialForm, githubProfiles: updated })
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-white/60">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={socialForm.linkedinUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, linkedinUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-white/60">Instagram Profile URL</label>
                <input
                  type="url"
                  value={socialForm.instagramUrl}
                  onChange={(e) => setSocialForm({ ...socialForm, instagramUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>
            </form>

            {/* Contact Channels Form */}
            <form
              onSubmit={handleSaveContact}
              className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">Direct Inboxes & Phone</h3>
                  <p className="text-xs text-white/60">
                    Controls the direct mail cards and WhatsApp links on <span className="font-mono text-purple-300">/contact</span>.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={savingSection === "contact"}
                  className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg"
                >
                  <Save className="size-3.5" />
                  <span>Save Contact</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-white/60">Primary Email (Gmail)</label>
                <input
                  type="email"
                  value={contactForm.email1}
                  onChange={(e) => setContactForm({ ...contactForm, email1: e.target.value })}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-white/60">Secondary Email (Yahoo)</label>
                <input
                  type="email"
                  value={contactForm.email2}
                  onChange={(e) => setContactForm({ ...contactForm, email2: e.target.value })}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/60">Phone Number</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/60">WhatsApp Direct URL</label>
                  <input
                    type="text"
                    value={contactForm.whatsappUrl}
                    onChange={(e) => setContactForm({ ...contactForm, whatsappUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-white/60">
                  Location & Timezone Display
                </label>
                <input
                  type="text"
                  value={contactForm.locationDisplay}
                  onChange={(e) => setContactForm({ ...contactForm, locationDisplay: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: FIRESTORE SYSTEM STATUS */}
        {/* ========================================================================= */}
        {activeTab === "system" && (
          <div className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-light text-white">Firebase & Firestore Status</h2>
              <p className="text-xs text-white/60">
                Active Firestore collections, security rules status, and initial provisioning tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                  <span>Firestore DB</span>
                  <span className="size-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-lg font-medium text-white">Active</p>
                <p className="text-[11px] text-white/50">Collections: Profile, Experience, Tech, Projects, Social</p>
              </div>

              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                  <span>Authentication</span>
                  <span className="size-2 rounded-full bg-purple-400" />
                </div>
                <p className="text-lg font-medium text-white">Authenticated</p>
                <p className="text-[11px] text-white/50">Admin writes protected</p>
              </div>

              <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-sky-300 font-mono">
                  <span>Firebase Storage</span>
                  <span className="size-2 rounded-full bg-sky-400" />
                </div>
                <p className="text-lg font-medium text-white">Connected</p>
                <p className="text-[11px] text-white/50">Avatar drag & drop support</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Bootstrap & Sync Initial Portfolio Data</h4>
                  <p className="text-xs text-white/60">
                    If any collections are empty or need a full synchronization from code defaults, click here.
                  </p>
                </div>
                <button
                  onClick={handleSeedDefaults}
                  disabled={savingSection === "seed"}
                  className="rounded-full bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-lg"
                >
                  {savingSection === "seed" ? "Synchronizing..." : "Sync All Collections"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EXPERIENCE EDIT / ADD */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isExpModalOpen && editingExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-neutral-950 p-6 md:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-medium text-white">
                  {editingExp.id ? "Edit Experience Record" : "Add New Experience Record"}
                </h3>
                <button
                  onClick={() => setIsExpModalOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExpModal} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Company / Organization</label>
                    <input
                      type="text"
                      value={editingExp.company}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      required
                      placeholder="e.g. BELVO"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Role / Position</label>
                    <input
                      type="text"
                      value={editingExp.role}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      required
                      placeholder="e.g. Web Development Intern"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Period Display</label>
                    <input
                      type="text"
                      value={editingExp.period}
                      onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                      required
                      placeholder="June 2026 – September 2026"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Location</label>
                    <input
                      type="text"
                      value={editingExp.location}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      placeholder="Remote / Hyderabad"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Type</label>
                    <input
                      type="text"
                      value={editingExp.type}
                      onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value })}
                      placeholder="Internship / Leadership"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-white/60">Description Overview</label>
                  <textarea
                    rows={2}
                    value={editingExp.description}
                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Responsibilities bullet points */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    Key Responsibilities & Bullet Points
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {editingExp.responsibilities?.map((resp, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-purple-400 text-xs">•</span>
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => {
                            const updated = [...editingExp.responsibilities]
                            updated[i] = e.target.value
                            setEditingExp({ ...editingExp, responsibilities: updated })
                          }}
                          className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExp({
                              ...editingExp,
                              responsibilities: editingExp.responsibilities.filter((_, idx) => idx !== i)
                            })
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newRespInput}
                      onChange={(e) => setNewRespInput(e.target.value)}
                      placeholder="Add a new responsibility bullet point..."
                      className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRespInput.trim()) return
                        setEditingExp({
                          ...editingExp,
                          responsibilities: [...(editingExp.responsibilities || []), newRespInput.trim()]
                        })
                        setNewRespInput("")
                      }}
                      className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-500"
                    >
                      Add Point
                    </button>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    Technologies Used (Tags)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {editingExp.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-200"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExp({
                              ...editingExp,
                              technologies: editingExp.technologies.filter((_, idx) => idx !== i)
                            })
                          }}
                          className="hover:text-rose-400"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newTechExpInput}
                      onChange={(e) => setNewTechExpInput(e.target.value)}
                      placeholder="e.g. React, TypeScript, Supabase..."
                      className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTechExpInput.trim()) return
                        setEditingExp({
                          ...editingExp,
                          technologies: [...(editingExp.technologies || []), newTechExpInput.trim()]
                        })
                        setNewTechExpInput("")
                      }}
                      className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-500"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsExpModalOpen(false)}
                    className="rounded-full border border-white/20 px-5 py-2 text-xs font-medium text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSection === "exp-modal"}
                    className="rounded-full bg-purple-600 px-6 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg"
                  >
                    {savingSection === "exp-modal" ? "Saving..." : "Save Record"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: PROJECT EDIT / ADD */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isProjectModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-neutral-950 p-6 md:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-medium text-white">
                  {editingProject.id ? `Edit Project — ${editingProject.name}` : "Create New Project"}
                </h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProjectModal} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Number Index</label>
                    <input
                      type="text"
                      value={editingProject.number}
                      onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                      placeholder="01"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-mono uppercase text-white/60">Project Name</label>
                    <input
                      type="text"
                      value={editingProject.name}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      required
                      placeholder="e.g. Lumora AI"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Category</label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      required
                      placeholder="AI / FinTech / Healthcare"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.value as "Live" | "In Development"
                        })
                      }
                      className="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="Live">Live</option>
                      <option value="In Development">In Development</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-white/60">Tagline</label>
                  <input
                    type="text"
                    value={editingProject.tagline}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    required
                    placeholder="AI-driven financial research & market synthesis engine"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    Detailed Case Study Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">Live URL</label>
                    <input
                      type="url"
                      value={editingProject.liveUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-white/60">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={editingProject.githubUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Accent Color Preset Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/60">Accent Color</label>
                  <div className="flex flex-wrap gap-2">
                    {accentColorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            accentColor: preset.value,
                            gradient: preset.gradient
                          })
                        }
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                          editingProject.accentColor === preset.value
                            ? "border-white bg-white/20 text-white font-medium"
                            : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: preset.value }} />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* "What I Worked On" Bullet points */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase text-white/60">What I Worked On (List)</label>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {editingProject.whatIWorkedOn?.map((point, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-purple-400 text-xs">•</span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const updated = [...editingProject.whatIWorkedOn]
                            updated[i] = e.target.value
                            setEditingProject({ ...editingProject, whatIWorkedOn: updated })
                          }}
                          className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject({
                              ...editingProject,
                              whatIWorkedOn: editingProject.whatIWorkedOn.filter((_, idx) => idx !== i)
                            })
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newWorkItemInput}
                      onChange={(e) => setNewWorkItemInput(e.target.value)}
                      placeholder="Add engineering highlight..."
                      className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newWorkItemInput.trim()) return
                        setEditingProject({
                          ...editingProject,
                          whatIWorkedOn: [...(editingProject.whatIWorkedOn || []), newWorkItemInput.trim()]
                        })
                        setNewWorkItemInput("")
                      }}
                      className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-500"
                    >
                      Add Point
                    </button>
                  </div>
                </div>

                {/* Tech tags */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase text-white/60">
                    Tech Stack Technologies (Tags)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {editingProject.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-200"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject({
                              ...editingProject,
                              technologies: editingProject.technologies.filter((_, idx) => idx !== i)
                            })
                          }}
                          className="hover:text-rose-400"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newProjectTechInput}
                      onChange={(e) => setNewProjectTechInput(e.target.value)}
                      placeholder="e.g. Next.js, Gemini API, MongoDB..."
                      className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProjectTechInput.trim()) return
                        setEditingProject({
                          ...editingProject,
                          technologies: [...(editingProject.technologies || []), newProjectTechInput.trim()]
                        })
                        setNewProjectTechInput("")
                      }}
                      className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-500"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="rounded-full border border-white/20 px-5 py-2 text-xs font-medium text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSection === "proj-modal"}
                    className="rounded-full bg-purple-600 px-6 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg"
                  >
                    {savingSection === "proj-modal" ? "Saving..." : "Save Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: TECH STACK SKILL EDIT / ADD */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isTechModalOpen && editingTech && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-neutral-950 p-6 md:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-medium text-white">
                  {editingTech.id ? "Edit Technology" : "Add New Skill / Tool"}
                </h3>
                <button
                  onClick={() => setIsTechModalOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTechModal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-white/60">Technology Name</label>
                  <input
                    type="text"
                    value={editingTech.name}
                    onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                    required
                    placeholder="e.g. React, Next.js, Python"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-white/60">Category</label>
                  <select
                    value={editingTech.category}
                    onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frontend & UI">Frontend & UI</option>
                    <option value="Backend & APIs">Backend & APIs</option>
                    <option value="Databases & Cloud">Databases & Cloud</option>
                    <option value="Tools & Emerging">Tools & Emerging</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-white/60">Proficiency Level</label>
                  <select
                    value={editingTech.level}
                    onChange={(e) =>
                      setEditingTech({ ...editingTech, level: e.target.value as SkillLevel })
                    }
                    className="w-full rounded-xl border border-white/15 bg-neutral-900 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Core">Core</option>
                    <option value="Working Knowledge">Working Knowledge</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsTechModalOpen(false)}
                    className="rounded-full border border-white/20 px-5 py-2 text-xs font-medium text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSection === "tech-modal"}
                    className="rounded-full bg-purple-600 px-6 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-lg"
                  >
                    {savingSection === "tech-modal" ? "Saving..." : "Save Technology"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PortfolioShell>
  )
}
