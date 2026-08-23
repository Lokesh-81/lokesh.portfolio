"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  fetchProfileData,
  fetchExperiencesData,
  fetchTechStackData,
  fetchProjectsData,
  fetchSocialData,
  fetchContactData,
  initialProfileData,
  initialExperienceData,
  initialTechStackData,
  initialProjectsData,
  initialSocialData,
  initialContactData,
  type ProfileData,
  type ExperienceItem,
  type TechItem,
  type ProjectItem,
  type SocialData,
  type ContactData
} from "@/lib/firebase"

interface PortfolioContextValue {
  profile: ProfileData
  experiences: ExperienceItem[]
  technologies: TechItem[]
  projects: ProjectItem[]
  social: SocialData
  contact: ContactData
  loading: boolean
  refreshAll: () => Promise<void>
  updateProfileState: (data: Partial<ProfileData>) => void
  updateSocialState: (data: Partial<SocialData>) => void
  updateContactState: (data: Partial<ContactData>) => void
  setExperiencesState: React.Dispatch<React.SetStateAction<ExperienceItem[]>>
  setTechnologiesState: React.Dispatch<React.SetStateAction<TechItem[]>>
  setProjectsState: React.Dispatch<React.SetStateAction<ProjectItem[]>>
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(initialProfileData)
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperienceData)
  const [technologies, setTechnologies] = useState<TechItem[]>(initialTechStackData)
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjectsData)
  const [social, setSocial] = useState<SocialData>(initialSocialData)
  const [contact, setContact] = useState<ContactData>(initialContactData)
  const [loading, setLoading] = useState(true)

  const refreshAll = useCallback(async () => {
    try {
      const [prof, exp, tech, proj, soc, cont] = await Promise.all([
        fetchProfileData(),
        fetchExperiencesData(),
        fetchTechStackData(),
        fetchProjectsData(),
        fetchSocialData(),
        fetchContactData()
      ])
      setProfile(prof)
      setExperiences(exp)
      setTechnologies(tech)
      setProjects(proj)
      setSocial(soc)
      setContact(cont)
    } catch (e) {
      console.warn("Failed to load live portfolio data, using defaults:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  const updateProfileState = (data: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }

  const updateSocialState = (data: Partial<SocialData>) => {
    setSocial((prev) => ({ ...prev, ...data }))
  }

  const updateContactState = (data: Partial<ContactData>) => {
    setContact((prev) => ({ ...prev, ...data }))
  }

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        experiences,
        technologies,
        projects,
        social,
        contact,
        loading,
        refreshAll,
        updateProfileState,
        updateSocialState,
        updateContactState,
        setExperiencesState: setExperiences,
        setTechnologiesState: setTechnologies,
        setProjectsState: setProjects
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext)
  if (!context) {
    // Return graceful fallback state if outside provider
    return {
      profile: initialProfileData,
      experiences: initialExperienceData,
      technologies: initialTechStackData,
      projects: initialProjectsData,
      social: initialSocialData,
      contact: initialContactData,
      loading: false,
      refreshAll: async () => {},
      updateProfileState: () => {},
      updateSocialState: () => {},
      updateContactState: () => {},
      setExperiencesState: () => {},
      setTechnologiesState: () => {},
      setProjectsState: () => {}
    }
  }
  return context
}
