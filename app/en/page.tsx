/* ============================================================
   app/en/page.tsx  —  RUTA INGLESA  (ARCHIVO NUEVO)

   Crear la carpeta app/en/ y colocar este archivo dentro.
   Añadir un archivo nuevo no puede romper las rutas
   existentes: Next.js resuelve por carpeta.
   ============================================================ */
import type { Metadata } from 'next'
import PropertyPage from '../components/PropertyPage'
import data from '../data/property.en.json'

const SITE = 'https://landing.larumstudio.com'

export const metadata: Metadata = {
  title: `${data.property.name} — ${data.property.badge}`,
  description: data.property.tagline,
  alternates: {
    canonical: SITE + '/en',
    languages: { 'es-PY': SITE + '/', en: SITE + '/en', 'x-default': SITE + '/' },
  },
  openGraph: {
    title: data.property.heroHeadline,
    description: data.property.tagline,
    url: SITE + '/en',
    locale: 'en_US',
    alternateLocale: ['es_PY'],
    images: [{ url: data.property.posterHero }],
    type: 'website',
  },
}

export default function Page() {
  return <PropertyPage data={data} lang="en" />
}
