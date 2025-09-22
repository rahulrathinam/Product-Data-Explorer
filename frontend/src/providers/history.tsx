"use client"
import { useEffect } from 'react'

export function useHistoryTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = () => {
      try {
        const path = window.location.pathname + window.location.search
        const existing = JSON.parse(localStorage.getItem('browse_history') || '[]') as string[]
        const next = [path, ...existing.filter((p) => p !== path)].slice(0, 50)
        localStorage.setItem('browse_history', JSON.stringify(next))
        fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        }).catch(() => {})
      } catch {}
    }
    handler()
    window.addEventListener('popstate', handler)
    const pushState = history.pushState
    history.pushState = function (...args) {
      // @ts-ignore
      const r = pushState.apply(this, args)
      handler()
      return r
    }
    return () => {
      window.removeEventListener('popstate', handler)
      history.pushState = pushState
    }
  }, [])
}









