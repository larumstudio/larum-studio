/* ============================================================
   app/sitemap.ts  —  ARCHIVO NUEVO

   Declara las cuatro URLs con sus equivalencias de idioma.
   Es lo que hace que Google sirva /en a quien busca en inglés.
   ============================================================ */
import type { MetadataRoute } from 'next'

const SITE = 'https://landing.larumstudio.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: SITE + '/',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: { es: SITE + '/', en: SITE + '/en' } },
    },
    {
      url: SITE + '/en',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: { es: SITE + '/', en: SITE + '/en' } },
    },
    {
      url: SITE + '/entorno',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: { es: SITE + '/entorno', en: SITE + '/en/entorno' },
      },
    },
    {
      url: SITE + '/en/entorno',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: { es: SITE + '/entorno', en: SITE + '/en/entorno' },
      },
    },
  ]
}
