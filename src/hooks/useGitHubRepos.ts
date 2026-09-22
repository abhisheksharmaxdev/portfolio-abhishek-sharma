import { useEffect, useState } from 'react'

export interface Repo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
}

const CACHE_KEY = 'gh-repos-v1'
const TTL = 1000 * 60 * 60 // 1 hour

/**
 * Loads public repositories from the GitHub REST API (unauthenticated, cached
 * in sessionStorage). Returns status so the UI can fall back gracefully if
 * the API is rate-limited or offline.
 */
export function useGitHubRepos(user: string) {
  const [repos, setRepos] = useState<Repo[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const { at, data } = JSON.parse(cached) as { at: number; data: Repo[] }
        if (Date.now() - at < TTL) {
          setRepos(data)
          setStatus('ready')
          return
        }
      }
    } catch {
      /* ignore cache errors */
    }

    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Repo[]>
      })
      .then((data) => {
        if (cancelled) return
        const list = data.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase())
        setRepos(list)
        setStatus('ready')
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: list }))
        } catch {
          /* ignore */
        }
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
    }
  }, [user])

  return { repos, status }
}
