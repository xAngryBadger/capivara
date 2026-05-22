import { useSyncExternalStore, useCallback } from 'react'

function getHash(): string {
  return window.location.hash.slice(1)
}

function subscribe(cb: () => void): () => void {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useHash(): string {
  return useSyncExternalStore(subscribe, getHash, () => '')
}

export function useHashRouter() {
  const hash = useHash()

  const navigate = useCallback((path: string) => {
    window.location.hash = path
  }, [])

  const goBack = useCallback(() => {
    window.location.hash = ''
  }, [])

  return { hash, navigate, goBack }
}
