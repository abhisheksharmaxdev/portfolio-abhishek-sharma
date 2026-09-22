import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { projects, type Project } from '@/content'
import { ProjectModal } from './ProjectModal'

interface Ctx {
  openProject: (slug: string) => void
}

const ProjectModalCtx = createContext<Ctx>({ openProject: () => {} })

/** Lets any section (Experience, Skills, GitHub…) open a project case study. */
export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Project | null>(null)
  const openProject = useCallback((slug: string) => {
    setCurrent(projects.find((p) => p.slug === slug) ?? null)
  }, [])
  const value = useMemo(() => ({ openProject }), [openProject])

  return (
    <ProjectModalCtx.Provider value={value}>
      {children}
      <ProjectModal project={current} onClose={() => setCurrent(null)} onNavigate={openProject} />
    </ProjectModalCtx.Provider>
  )
}

export const useProjectModal = () => useContext(ProjectModalCtx)
