export type OS = 'windows' | 'macos' | 'gnome' | 'kde'
export type Category = 'tv-shows' | 'gaming' | 'anime' | 'nature' | 'minimal' | 'cyberpunk' | 'movies' | 'sports'

export interface OSDownload {
  os: OS
  label: string
  size: string
  file: string
  installCmd?: string
}

export interface Theme {
  slug: string
  name: string
  description: string
  longDescription: string
  category: Category
  tags: string[]
  wallpaperCount: number
  previews: string[]          // paths under /previews/
  downloads: OSDownload[]
  featured: boolean
  releaseDate: string
  totalDownloads: number
  rating: number
  ratingCount: number
  color: string               // dominant accent hex
}
