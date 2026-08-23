"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Database,
  FlaskConical,
  Clock,
  Code
} from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import {
  fetchStudioProjects,
  fetchStudioExperiments,
  fetchStudioChangelog,
  saveStudioProject,
  deleteStudioProject,
  saveStudioExperiment,
  deleteStudioExperiment,
  saveStudioChangelog,
  deleteStudioChangelog,
  isFirebaseConfigured
} from "@/lib/firebase"
import type { StudioProject, StudioExperiment, StudioChangelog } from "@/lib/data/studio"

export default function StudioAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [authError, setAuthError] = useState("")

  const [activeTab, setActiveTab] = useState<"projects" | "experiments" | "changelog">("projects")
  const [projects, setProjects] = useState<StudioProject[]>([])
  const [experiments, setExperiments] = useState<StudioExperiment[]>([])
  const [changelog, setChangelog] = useState<StudioChangelog[]>([])

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Project Modal State
  const [editingProject, setEditingProject] = useState<Partial<StudioProject> | null>(null)
  // Experiment Modal State
  const [editingExperiment, setEditingExperiment] = useState<Partial<StudioExperiment> | null>(null)
  // Changelog Modal State
  const [editingChangelog, setEditingChangelog] = useState<Partial<StudioChangelog> | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Support admin key or dev demo key
    if (passcode.trim() === "lokesh2026" || passcode.trim() === "admin") {
      setIsAuthenticated(true)
      setAuthError("")
      loadData()
    } else {
      setAuthError("Invalid access key. Try 'lokesh2026' for developer access.")
    }
  }

  const loadData = async () => {
    try {
      const [p, e, c] = await Promise.all([
        fetchStudioProjects(),
        fetchStudioExperiments(),
        fetchStudioChangelog()
      ])
      setProjects(p)
      setExperiments(e)
      setChangelog(c)
    } catch (err) {
      console.error(err)
    }
  }

  // --- Project CRUD Handlers ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject?.title || !editingProject?.description) return

    const toSave: Omit<StudioProject, "id"> = {
      title: editingProject.title,
      description: editingProject.description,
      category: editingProject.category || "AI / Product",
      status: editingProject.status || "In Development",
      technologies: Array.isArray(editingProject.technologies)
        ? editingProject.technologies
        : (editingProject.technologies as any)?.split(",").map((s: string) => s.trim()) || ["React", "TypeScript"],
      progress: Number(editingProject.progress) || 50,
      url: editingProject.url || "",
      githubUrl: editingProject.githubUrl || "",
      createdAt: editingProject.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await saveStudioProject(toSave, editingProject.id)
    setEditingProject(null)
    loadData()
    showToast("Project saved successfully")
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    await deleteStudioProject(id)
    loadData()
    showToast("Project deleted")
  }

  // --- Experiment CRUD Handlers ---
  const handleSaveExperiment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExperiment?.title || !editingExperiment?.description) return

    const toSave: Omit<StudioExperiment, "id"> = {
      title: editingExperiment.title,
      description: editingExperiment.description,
      technology: editingExperiment.technology || "TypeScript",
      category: editingExperiment.category || "AI",
      status: editingExperiment.status || "Active",
      url: editingExperiment.url || "",
      createdAt: editingExperiment.createdAt || new Date().toISOString()
    }

    await saveStudioExperiment(toSave, editingExperiment.id)
    setEditingExperiment(null)
    loadData()
    showToast("Experiment saved")
  }

  const handleDeleteExperiment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experiment?")) return
    await deleteStudioExperiment(id)
    loadData()
    showToast("Experiment deleted")
  }

  // --- Changelog CRUD Handlers ---
  const handleSaveChangelog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingChangelog?.title || !editingChangelog?.description) return

    const toSave: Omit<StudioChangelog, "id"> = {
      title: editingChangelog.title,
      description: editingChangelog.description,
      date: editingChangelog.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      category: editingChangelog.category || "Feature",
      version: editingChangelog.version || "v2.0"
    }

    await saveStudioChangelog(toSave, editingChangelog.id)
    setEditingChangelog(null)
    loadData()
    showToast("Changelog entry saved")
  }

  const handleDeleteChangelog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this changelog entry?")) return
    await deleteStudioChangelog(id)
    loadData()
    showToast("Changelog entry deleted")
  }

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-10">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-semibold">
                Studio Management Portal
              </span>
              <h1 className="text-3xl font-light text-white tracking-tight md:text-4xl">
                Studio <span className="instrument italic">Admin.</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/50">
            <span
              className={`size-2 rounded-full ${
                isFirebaseConfigured ? "bg-emerald-400" : "bg-purple-400 animate-pulse"
              }`}
            />
            <span>{isFirebaseConfigured ? "Firestore Persistence Active" : "Local Sync Mode"}</span>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-purple-500/50 bg-purple-950/90 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Auth Guard Screen */}
        {!isAuthenticated ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-black/60 p-8 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-400">
              <Lock className="size-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-medium text-white">Studio Admin Access</h2>
              <p className="text-xs text-white/60">
                Enter your administrative key to manage Studio projects, experiments, and changelog updates.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1.5">
                  Access Key / Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter key (e.g. lokesh2026)"
                  className="w-full rounded-xl border border-white/15 bg-black/80 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
                  autoFocus
                />
                {authError && <p className="mt-2 text-xs text-rose-400">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-600 py-3 text-xs font-semibold text-white transition hover:bg-purple-500"
              >
                Authenticate & Access CMS
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-white/40">Demo passcode: lokesh2026</span>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Management Panel */
          <div className="space-y-8">
            {/* Tab selection & Add New */}
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    activeTab === "projects" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Sparkles className="size-3.5" />
                  <span>Projects ({projects.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("experiments")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    activeTab === "experiments" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <FlaskConical className="size-3.5" />
                  <span>Experiments ({experiments.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("changelog")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    activeTab === "changelog" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Clock className="size-3.5" />
                  <span>Changelog ({changelog.length})</span>
                </button>
              </div>

              {activeTab === "projects" && (
                <button
                  onClick={() =>
                    setEditingProject({
                      title: "",
                      description: "",
                      category: "AI / Product",
                      status: "In Development",
                      technologies: ["React", "TypeScript"],
                      progress: 50
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <Plus className="size-3.5" />
                  <span>New Studio Project</span>
                </button>
              )}

              {activeTab === "experiments" && (
                <button
                  onClick={() =>
                    setEditingExperiment({
                      title: "",
                      description: "",
                      technology: "WebGL / React",
                      category: "AI",
                      status: "Active"
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <Plus className="size-3.5" />
                  <span>New Experiment</span>
                </button>
              )}

              {activeTab === "changelog" && (
                <button
                  onClick={() =>
                    setEditingChangelog({
                      title: "",
                      description: "",
                      category: "Feature",
                      version: "v2.3.0",
                      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <Plus className="size-3.5" />
                  <span>New Changelog Entry</span>
                </button>
              )}
            </div>

            {/* TAB: PROJECTS LIST */}
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-purple-300 font-mono">{p.category}</span>
                        <span className="text-[10px] text-amber-400">{p.status} ({p.progress}%)</span>
                      </div>
                      <h4 className="text-lg font-medium text-white">{p.title}</h4>
                      <p className="text-xs text-white/60 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <div className="text-[10px] text-white/40">
                        {p.technologies?.slice(0, 3).join(", ")}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProject(p)}
                          className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="size-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="flex size-7 items-center justify-center rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: EXPERIMENTS LIST */}
            {activeTab === "experiments" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {experiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-purple-300 font-mono">{exp.category}</span>
                        <span className="text-[10px] text-emerald-400">{exp.status}</span>
                      </div>
                      <h4 className="text-base font-medium text-white">{exp.title}</h4>
                      <p className="text-xs text-white/60 line-clamp-2">{exp.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/40">
                      <span>{exp.technology}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingExperiment(exp)}
                          className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="size-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteExperiment(exp.id)}
                          className="flex size-7 items-center justify-center rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: CHANGELOG LIST */}
            {activeTab === "changelog" && (
              <div className="space-y-3">
                {changelog.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-purple-300">{c.version}</span>
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/50">{c.category}</span>
                        <span className="text-white/40">{c.date}</span>
                      </div>
                      <h4 className="text-sm font-medium text-white">{c.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingChangelog(c)}
                        className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="size-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteChangelog(c.id)}
                        className="flex size-7 items-center justify-center rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                        title="Delete"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: PROJECT EDIT/CREATE */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-950 p-6 md:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-medium text-white">
                  {editingProject.id ? "Edit Studio Project" : "Add New Studio Project"}
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="rounded-full p-1 text-white/60 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div>
                  <label className="text-white/60 block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProject.category || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Progress %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingProject.progress || 50}
                      onChange={(e) => setEditingProject({ ...editingProject, progress: Number(e.target.value) })}
                      className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/Lokesh-81/..."
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="rounded-xl border border-white/15 px-4 py-2 font-medium text-white/70 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-500"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EXPERIMENT EDIT/CREATE */}
        {editingExperiment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-950 p-6 md:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-medium text-white">
                  {editingExperiment.id ? "Edit Experiment" : "Add New Experiment"}
                </h3>
                <button
                  onClick={() => setEditingExperiment(null)}
                  className="rounded-full p-1 text-white/60 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExperiment} className="space-y-4 text-xs">
                <div>
                  <label className="text-white/60 block mb-1">Experiment Title</label>
                  <input
                    type="text"
                    required
                    value={editingExperiment.title || ""}
                    onChange={(e) => setEditingExperiment({ ...editingExperiment, title: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingExperiment.description || ""}
                    onChange={(e) => setEditingExperiment({ ...editingExperiment, description: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1">Category</label>
                    <select
                      value={editingExperiment.category || "AI"}
                      onChange={(e) => setEditingExperiment({ ...editingExperiment, category: e.target.value as any })}
                      className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="AI">AI</option>
                      <option value="3D Web">3D Web</option>
                      <option value="APIs">APIs</option>
                      <option value="Animations">Animations</option>
                      <option value="Data Visualization">Data Visualization</option>
                      <option value="Experimental UI">Experimental UI</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Technology Stack</label>
                    <input
                      type="text"
                      value={editingExperiment.technology || ""}
                      onChange={(e) => setEditingExperiment({ ...editingExperiment, technology: e.target.value })}
                      placeholder="e.g. WebGL / GLSL"
                      className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingExperiment(null)}
                    className="rounded-xl border border-white/15 px-4 py-2 font-medium text-white/70 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-500"
                  >
                    Save Experiment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CHANGELOG EDIT/CREATE */}
        {editingChangelog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-950 p-6 md:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-medium text-white">
                  {editingChangelog.id ? "Edit Changelog Entry" : "Add Changelog Entry"}
                </h3>
                <button
                  onClick={() => setEditingChangelog(null)}
                  className="rounded-full p-1 text-white/60 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveChangelog} className="space-y-4 text-xs">
                <div>
                  <label className="text-white/60 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingChangelog.title || ""}
                    onChange={(e) => setEditingChangelog({ ...editingChangelog, title: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingChangelog.description || ""}
                    onChange={(e) => setEditingChangelog({ ...editingChangelog, description: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1">Version</label>
                    <input
                      type="text"
                      value={editingChangelog.version || "v2.0"}
                      onChange={(e) => setEditingChangelog({ ...editingChangelog, version: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Date</label>
                    <input
                      type="text"
                      value={editingChangelog.date || ""}
                      onChange={(e) => setEditingChangelog({ ...editingChangelog, date: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingChangelog(null)}
                    className="rounded-xl border border-white/15 px-4 py-2 font-medium text-white/70 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-500"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortfolioShell>
  )
}
