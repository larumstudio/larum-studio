import type { MetadataRoute } from 'next'
import { SITE } from './lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: SITE + '/',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          'es-PY': SITE + '/',
          en: SITE + '/en',
        },
      },
    },
    {
      url: SITE + '/en',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          'es-PY': SITE + '/',
          en: SITE + '/en',
        },
      },
    },
    {
      url: SITE + '/entorno',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'es-PY': SITE + '/entorno',
          en: SITE + '/en/area',
        },
      },
    },
    {
      url: SITE + '/en/area',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'es-PY': SITE + '/entorno',
          en: SITE + '/en/area',
        },
      },
    },
  ]
}
