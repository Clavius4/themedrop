import { MetadataRoute } from 'next'
import { THEMES, CATEGORIES, OS_INFO } from '@/lib/themes'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://themedrop.vercel.app'

  const staticRoutes = ['/', '/themes'].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.9,
  }))

  const themeRoutes = THEMES.map(t => ({
    url: `${base}/theme/${t.slug}`,
    lastModified: new Date(t.releaseDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const osRoutes = Object.keys(OS_INFO).map(os => ({
    url: `${base}/os/${os}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const categoryRoutes = CATEGORIES.map(c => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...themeRoutes, ...osRoutes, ...categoryRoutes]
}
