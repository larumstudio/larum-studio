import type { Metadata } from 'next'
import { SITE } from '../lib/site'
import EntornoPage from '../components/EntornoPage'
import location from '../data/location.json'

export const metadata: Metadata = {
  title: 'San Bernardino, Paraguay | Vida junto al Lago Ypacaraí | Larum',
  description:
    'Descubra San Bernardino: un entorno residencial junto al Lago Ypacaraí, a menos de una hora de Asunción.',
  alternates: {
    canonical: SITE + '/entorno',
    languages: {
      'es-PY': SITE + '/entorno',
      en: SITE + '/en/area',
      'x-default': SITE + '/entorno',
    },
  },
  openGraph: {
    title: location.hero.title,
    description: location.hero.subtitle,
    url: SITE + '/entorno',
    locale: 'es_PY',
    alternateLocale: ['en_US'],
    images: [{ url: location.hero.image }],
    type: 'website',
  },
}

export default function EntornoRoutePage() {
  return <EntornoPage location={location} lang="es" />
}
