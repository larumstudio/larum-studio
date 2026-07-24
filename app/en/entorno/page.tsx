/* ============================================================
   app/en/entorno/page.tsx  —  ARCHIVO NUEVO

   Crear carpeta app/en/entorno/ y colocar dentro.
   ============================================================ */
import type { Metadata } from 'next'
import EntornoPage from '../../components/EntornoPage'
import location from '../../data/location.en.json'

const SITE = 'https://landing.larumstudio.com'

export const metadata: Metadata = {
  title: `${location.hero.title} — ${location.country}`,
  description: location.hero.subtitle,
  alternates: {
    canonical: SITE + '/en/entorno',
    languages: {
      'es-PY': SITE + '/entorno',
      en: SITE + '/en/entorno',
      'x-default': SITE + '/entorno',
    },
  },
  openGraph: {
    title: location.hero.title,
    description: location.hero.subtitle,
    url: SITE + '/en/entorno',
    locale: 'en_US',
    alternateLocale: ['es_PY'],
    images: [{ url: location.hero.image }],
  },
}

export default function Page() {
  return <EntornoPage data={location} lang="en" />
}
