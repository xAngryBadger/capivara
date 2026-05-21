const STORAGE_KEY = 'badger-api-url'

export function getApiUrl(): string {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setApiUrl(url: string): void {
  if (url) {
    localStorage.setItem(STORAGE_KEY, url.replace(/\/$/, ''))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function apiUrl(path: string): string {
  const base = getApiUrl()
  return `${base}${path}`
}
