import { Theme } from '@/types'

export const THEMES: Theme[] = [
  {
    slug: 'peaky-blinders',
    name: 'Peaky Blinders',
    description: 'Dark 1920s Birmingham atmosphere. Deep charcoal, amber gold, and fog.',
    longDescription: `Step into Small Heath. This theme pack captures the raw, gritty atmosphere of the BBC series with 10 hand-picked HD wallpapers, a full dark amber/gold colour scheme for every OS, and a complete Terminal profile. Every element — from the deep charcoal backgrounds to the warm gold accents — is designed to make your desktop feel like a scene from the show.`,
    category: 'tv-shows',
    tags: ['dark', 'moody', 'gold', 'vintage', 'noir', 'BBC', 'drama'],
    wallpaperCount: 10,
    previews: [
      '/previews/peaky-blinders-1.jpg',
      '/previews/peaky-blinders-2.jpg',
      '/previews/peaky-blinders-3.jpg',
    ],
    downloads: [
      {
        os: 'windows',
        label: 'Windows 10 / 11',
        size: '7.8 MB',
        file: '/downloads/peaky-blinders-windows.zip',
        installCmd: 'Double-click PeakyBlinders.deskthemepack',
      },
      {
        os: 'macos',
        label: 'macOS 12–15',
        size: '3.9 MB',
        file: '/downloads/peaky-blinders-macos.zip',
        installCmd: 'chmod +x install.sh && ./install.sh',
      },
      {
        os: 'gnome',
        label: 'Ubuntu / GNOME',
        size: '3.9 MB',
        file: '/downloads/peaky-blinders-ubuntu.zip',
        installCmd: 'chmod +x install.sh && ./install.sh',
      },
      {
        os: 'kde',
        label: 'Kali / KDE Plasma',
        size: '3.9 MB',
        file: '/downloads/peaky-blinders-kde.zip',
        installCmd: 'chmod +x install.sh && ./install.sh',
      },
    ],
    featured: true,
    releaseDate: '2026-06-13',
    totalDownloads: 0,
    rating: 5.0,
    ratingCount: 0,
    color: '#C8A030',
  },
  {
    slug: 'breaking-bad',
    name: 'Breaking Bad',
    description: 'Desert heat, chemical blue, and the cold grey of Albuquerque. Say my name.',
    longDescription: `The desert. The lab. The transformation. This theme channels the iconic visual language of Breaking Bad — sun-baked yellows, cold chemical blues, and the harsh grey of the New Mexico landscape. Includes 10 wallpapers and a full colour scheme for all platforms.`,
    category: 'tv-shows',
    tags: ['desert', 'blue', 'yellow', 'drama', 'AMC', 'crime'],
    wallpaperCount: 10,
    previews: ['/previews/breaking-bad-1.jpg'],
    downloads: [
      { os: 'windows', label: 'Windows 10 / 11', size: '~8 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'macos',   label: 'macOS 12–15',     size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'gnome',   label: 'Ubuntu / GNOME',  size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'kde',     label: 'KDE Plasma',       size: '~4 MB', file: '#', installCmd: 'Coming soon' },
    ],
    featured: false,
    releaseDate: '2026-07-01',
    totalDownloads: 0,
    rating: 4.9,
    ratingCount: 0,
    color: '#4A90D4',
  },
  {
    slug: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    description: 'Neon-drenched Night City. Electric yellow, deep magenta, chrome black.',
    longDescription: `Wake up Samurai. Night City glows on your desktop — electric yellows bleed into deep magentas over pitch-black chrome. Built for the future. Optimised for dark setups and multiple monitors.`,
    category: 'gaming',
    tags: ['neon', 'cyberpunk', 'gaming', 'yellow', 'magenta', 'dark', 'sci-fi'],
    wallpaperCount: 10,
    previews: ['/previews/cyberpunk-1.jpg'],
    downloads: [
      { os: 'windows', label: 'Windows 10 / 11', size: '~8 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'macos',   label: 'macOS 12–15',     size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'gnome',   label: 'Ubuntu / GNOME',  size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'kde',     label: 'KDE Plasma',       size: '~4 MB', file: '#', installCmd: 'Coming soon' },
    ],
    featured: true,
    releaseDate: '2026-07-15',
    totalDownloads: 0,
    rating: 4.8,
    ratingCount: 0,
    color: '#F5E642',
  },
  {
    slug: 'dark-netflix',
    name: 'Dark (Netflix)',
    description: 'Winden forest, time loops, and eternal blue-grey rain. Knots and caves.',
    longDescription: `The caves of Winden never looked so good on a desktop. Deep forest greens, cold steel blues, and the oppressive dark of the tunnels. A theme for people who think in timelines.`,
    category: 'tv-shows',
    tags: ['dark', 'forest', 'blue', 'grey', 'Netflix', 'sci-fi', 'German'],
    wallpaperCount: 10,
    previews: ['/previews/dark-1.jpg'],
    downloads: [
      { os: 'windows', label: 'Windows 10 / 11', size: '~8 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'macos',   label: 'macOS 12–15',     size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'gnome',   label: 'Ubuntu / GNOME',  size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'kde',     label: 'KDE Plasma',       size: '~4 MB', file: '#', installCmd: 'Coming soon' },
    ],
    featured: false,
    releaseDate: '2026-07-20',
    totalDownloads: 0,
    rating: 4.9,
    ratingCount: 0,
    color: '#3D6B8A',
  },
  {
    slug: 'attack-on-titan',
    name: 'Attack on Titan',
    description: 'Survey Corps green, cold iron grey, and the fire of the rumbling.',
    longDescription: `On that day mankind received a grim reminder. This theme captures the epic scale of Attack on Titan — from the green of the Survey Corps cloaks to the titan-scorched horizons. Available for all four platforms.`,
    category: 'anime',
    tags: ['anime', 'green', 'dark', 'epic', 'manga', 'Japanese'],
    wallpaperCount: 10,
    previews: ['/previews/aot-1.jpg'],
    downloads: [
      { os: 'windows', label: 'Windows 10 / 11', size: '~8 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'macos',   label: 'macOS 12–15',     size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'gnome',   label: 'Ubuntu / GNOME',  size: '~4 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'kde',     label: 'KDE Plasma',       size: '~4 MB', file: '#', installCmd: 'Coming soon' },
    ],
    featured: false,
    releaseDate: '2026-08-01',
    totalDownloads: 0,
    rating: 4.7,
    ratingCount: 0,
    color: '#4A7B3C',
  },
  {
    slug: 'minimal-noir',
    name: 'Minimal Noir',
    description: 'Pure black. Single line. Zero clutter. Built for developers.',
    longDescription: `No distractions. No noise. Just pure black, a single sharp white accent line, and enough breathing room to think clearly. Minimal Noir is built for developers and designers who want their desktop to disappear into the background.`,
    category: 'minimal',
    tags: ['minimal', 'black', 'white', 'developer', 'clean', 'focus'],
    wallpaperCount: 8,
    previews: ['/previews/minimal-1.jpg'],
    downloads: [
      { os: 'windows', label: 'Windows 10 / 11', size: '~2 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'macos',   label: 'macOS 12–15',     size: '~2 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'gnome',   label: 'Ubuntu / GNOME',  size: '~2 MB', file: '#', installCmd: 'Coming soon' },
      { os: 'kde',     label: 'KDE Plasma',       size: '~2 MB', file: '#', installCmd: 'Coming soon' },
    ],
    featured: false,
    releaseDate: '2026-08-10',
    totalDownloads: 0,
    rating: 4.6,
    ratingCount: 0,
    color: '#E8E8E8',
  },
]

export const CATEGORIES = [
  { slug: 'tv-shows',  label: 'TV Shows',   icon: '📺', count: THEMES.filter(t => t.category === 'tv-shows').length },
  { slug: 'gaming',    label: 'Gaming',      icon: '🎮', count: THEMES.filter(t => t.category === 'gaming').length },
  { slug: 'anime',     label: 'Anime',       icon: '⛩️',  count: THEMES.filter(t => t.category === 'anime').length },
  { slug: 'nature',    label: 'Nature',      icon: '🌿', count: THEMES.filter(t => t.category === 'nature').length },
  { slug: 'minimal',   label: 'Minimal',     icon: '◻️',  count: THEMES.filter(t => t.category === 'minimal').length },
  { slug: 'cyberpunk', label: 'Cyberpunk',   icon: '⚡', count: THEMES.filter(t => t.category === 'cyberpunk').length },
  { slug: 'movies',    label: 'Movies',      icon: '🎬', count: THEMES.filter(t => t.category === 'movies').length },
  { slug: 'sports',    label: 'Sports',      icon: '⚽', count: THEMES.filter(t => t.category === 'sports').length },
]

export const OS_INFO: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  windows: { label: 'Windows',      icon: '⊞', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  macos:   { label: 'macOS',        icon: '',  color: '#A3A3A3', bg: 'rgba(163,163,163,0.12)' },
  gnome:   { label: 'GNOME/Ubuntu', icon: '🐧', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  kde:     { label: 'KDE Plasma',   icon: '🔵', color: '#818CF8', bg: 'rgba(129,140,248,0.12)' },
}

export function getTheme(slug: string): Theme | undefined {
  return THEMES.find(t => t.slug === slug)
}

export function getThemesByCategory(category: string): Theme[] {
  return THEMES.filter(t => t.category === category)
}

export function getFeaturedThemes(): Theme[] {
  return THEMES.filter(t => t.featured)
}

export function getAllSlugs(): string[] {
  return THEMES.map(t => t.slug)
}
