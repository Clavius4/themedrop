import { clsx, type ClassValue } from 'clsx'
import { OS } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'windows'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win'))    return 'windows'
  if (ua.includes('mac'))    return 'macos'
  if (ua.includes('linux'))  return 'gnome'
  return 'windows'
}

export function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
